/**
 * POST /.netlify/functions/analyze
 *
 * Accepts multipart/form-data with:
 *   companyName  {string}
 *   senderEmail  {string}
 *   offerContent {string}
 *   file         {File?}   – PDF or DOCX
 *
 * Returns JSON:
 *   { riskScore, verdict, issues, scanId, timestamp }
 */

const Groq    = require('groq-sdk');
const admin   = require('firebase-admin');
const busboy  = require('busboy');

// ─── Firebase Admin init (lazy singleton) ─────────────────────────────────────
function getFirestore() {
  if (!admin.apps.length) {
    let credentialOptions;
    
    // METHOD 1: Individual robust variables (Best for local .env files)
    if (process.env.FIREBASE_PRIVATE_KEY) {
      credentialOptions = {
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Safely parse literal string \n characters from dotenv
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
    } 
    // METHOD 2: Legacy JSON String (Best for CI/CD environments)
    else {
      let serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT || '{}';
      if (serviceAccountString.startsWith("'") && serviceAccountString.endsWith("'")) {
        serviceAccountString = serviceAccountString.slice(1, -1);
      }
      credentialOptions = JSON.parse(serviceAccountString);
    }

    if (!credentialOptions.projectId || (!credentialOptions.privateKey && !credentialOptions.private_key)) {
      console.error("FATAL FIREBASE ADMIN INIT: Missing projectId or privateKey!");
    }

    admin.initializeApp({
      credential: admin.credential.cert(credentialOptions),
    });
  }
  return admin.firestore();
}

// ─── Groq client ──────────────────────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'MISSING_API_KEY' });

// ─── Core Threat Signatures ───────────────────────────────────────────────────
const FINANCIAL_FRAUD = [
  'processing fee', 'training fee', 'registration fee', 'security deposit',
  'pay a', 'send money', 'wire transfer', 'western union', 'money order',
  'upfront payment', 'advance payment', 'refundable deposit', 'cashapp', 'zelle'
];

const URGENCY_TACTICS = [
  'act now', 'limited time', 'respond immediately', 'urgent', 'asap',
  'do not delay', '24 hours', '48 hours', 'expire', 'last chance', 'immediately'
];

const UNREALISTIC_CLAIMS = [
  'work from home and earn', 'no experience needed', 'guaranteed income',
  'earn thousands', 'passive income', 'be your own boss', '$50/hr', '$40/hr',
  'too good to be true', 'uncapped earnings', 'make money fast', 'data entry'
];

const IDENTITY_THEFT = [
  'social security', 'ssn', 'bank account details', 'routing number',
  'passport copy', 'driver license', 'front and back', 'credit card number'
];

const SKETCHY_COMMS = [
  'telegram', 'whatsapp interview', 'signal app', 'skype interview solely',
  'dear applicant', 'dear student', 'undisclosed company', 'our client'
];

function ruleBasedScore(domain, offerText) {
  const text  = offerText.toLowerCase();
  const score = { domainMismatch: 0, financialFraud: 0, urgency: 0, unrealistic: 0, identityTheft: 0, sketchyComms: 0 };
  const flags = [];

  // 1. Domain Risk Analysis
  const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'ymail.com', 'aol.com', 'live.com', 'protonmail.com', 'zoho.com'];
  const suspiciousTLDs = ['-careers.', '-jobs.', '-recruitment.', '-hr.', '-hiring.', 'jobs-', 'careers-'];
  if (freeProviders.includes(domain)) {
    score.domainMismatch = 35;
    flags.push({ check: 'domain', detail: `Uses a free email provider (${domain}). Legitimate companies use corporate domains.` });
  } else if (suspiciousTLDs.some(t => domain.includes(t))) {
    score.domainMismatch = 25;
    flags.push({ check: 'domain', detail: `Domain (${domain}) looks like a disposable routing domain often used in phishing.` });
  }

  // 2. Financial Extortion
  const payHits = FINANCIAL_FRAUD.filter(k => text.includes(k));
  if (payHits.length > 0) {
    score.financialFraud = Math.min(45, payHits.length * 20);
    flags.push({ check: 'financial', detail: `Found requests for money: "${payHits.slice(0, 2).join('", "')}". Authentic employers never demand payment.` });
  }

  // 3. Identity Theft Hooks
  const identityHits = IDENTITY_THEFT.filter(k => text.includes(k));
  if (identityHits.length > 0) {
    score.identityTheft = 40;
    flags.push({ check: 'identity', detail: `Premature request for sensitive ID or bank details ("${identityHits[0]}"). Huge red flag.` });
  }

  // 4. Sketchy Comm Channels (Telegram/WhatsApp)
  const commsHits = SKETCHY_COMMS.filter(k => text.includes(k));
  if (commsHits.length > 0) {
    score.sketchyComms = 25;
    flags.push({ check: 'comms', detail: `Unprofessional or anon communication methods requested: "${commsHits[0]}".` });
  }

  // 5. Unrealistic Claims
  const unrealHits = UNREALISTIC_CLAIMS.filter(k => text.includes(k));
  if (unrealHits.length > 0) {
    score.unrealistic = Math.min(25, unrealHits.length * 10);
    flags.push({ check: 'unrealistic', detail: `Features unrealistic or highly generic compensation promises.` });
  }

  // 6. Urgency/Pressure
  const urgencyHits = URGENCY_TACTICS.filter(k => text.includes(k));
  if (urgencyHits.length > 0) {
    score.urgency = Math.min(15, urgencyHits.length * 5);
    flags.push({ check: 'urgency', detail: `Uses high-pressure tactics ("${urgencyHits[0]}") to rush your decision.` });
  }

  // 7. Structure & Formatting Anomalies (Phishing Hallmarks)
  if (offerText.length < 150) {
    score.sketchyComms += 20;
    flags.push({ check: 'structure', detail: `Offer is suspiciously short (under 150 chars). Professional offers include full legal and role context.` });
  }

  // Common copy-paste generic greetings used by mass-spammers
  if (text.includes('dear applicant') || text.includes('dear candidate') || text.includes('undisclosed company')) {
    score.sketchyComms += 15;
    flags.push({ check: 'structure', detail: `Uses a generic copy-paste greeting ("Dear Applicant") instead of addressing you by name.` });
  }

  const total = Object.values(score).reduce((a, b) => a + b, 0);
  return { ruleScore: total, scoreBreakdown: score, ruleFlags: flags };
}

// ─── Groq AI analysis ─────────────────────────────────────────────────────────
async function getAIAnalysis(companyName, senderEmail, offerContent) {
  const prompt = `You are an elite corporate cyber-fraud investigative AI.
Your job is to critically analyze an internship/job offer for fraud using multi-factor signals.

Company Stated: ${companyName}
Sender Email: ${senderEmail}
Offer Content:
"""
${offerContent.slice(0, 3000)}
"""

Return this EXACT JSON structure ONLY:
{
  "aiScore": <0-100 fraud probability, 100 = 100% fake>,
  "verdict": "<Safe | Suspicious | High Risk>",
  "issues": [ { "title": "<short issue title>", "description": "<1-2 sentences>", "severity": "<low | medium | high>" } ],
  "summary": "<one sentence overall assessment>"
}

Perform a rigorous multi-factor check using your internal knowledge:
1. **Corporate Verification**: Do you know of a company named "${companyName}"? Is it a recognized startup/enterprise? If it is completely unknown or uses a highly generic name (e.g. "Global Tech Pvt"), increase risk.
2. **Domain Matching**: Does "${senderEmail}" match the official corporate domain of the company? (e.g., Apple uses @apple.com, not @apple-careers.in).
3. **Stipend/Role Logic**: Does the role and offered stipend make logical sense for a company of this reported scale? Is it "too good to be true"?
4. **Behavioral Red Flags**: Are there grammatical errors, unprofessional phrasing, forced urgency, demands for upfront payment, or requests to move to WhatsApp/Telegram?

Provide a strict, deeply analytical result. Return ONLY valid JSON.`;

  const completion = await groq.chat.completions.create({
    model:       'llama-3.3-70b-versatile',
    messages:    [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens:  1024,
  });

  const raw = completion.choices[0]?.message?.content?.trim() || '{}';

  // Strip potential markdown code fences
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  try {
    return JSON.parse(jsonStr);
  } catch {
    // Fallback if parsing fails
    return {
      aiScore: 50,
      verdict: 'Suspicious',
      issues:  [{ title: 'AI Analysis Incomplete', description: 'Could not fully parse AI response. Manual review recommended.', severity: 'medium' }],
      summary: 'Partial analysis completed.',
    };
  }
}

// ─── File text extraction ──────────────────────────────────────────────────────
async function extractTextFromFile(buffer, mimetype, filename) {
  const lower = (filename || '').toLowerCase();

  if (lower.endsWith('.pdf') || mimetype === 'application/pdf') {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (lower.endsWith('.docx') || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const mammoth = require('mammoth');
    const result  = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  return '';
}

// ─── Parse multipart form ──────────────────────────────────────────────────────
function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Multipart parse timeout')), 6000);

    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';

    // Fallback: JSON body
    if (contentType.includes('application/json')) {
      clearTimeout(timer);
      try {
        const body = JSON.parse(event.body || '{}');
        return resolve({ fields: body, files: {} });
      } catch (e) {
        return reject(e);
      }
    }

    if (!contentType.includes('multipart/') && !contentType.includes('urlencoded')) {
      clearTimeout(timer);
      return resolve({ fields: {}, files: {} });
    }

    try {
      const fields = {};
      const files  = {};

      // Need to require globally or dynamically. We have it up top.
      const bb = busboy({ headers: { 'content-type': contentType }, limits: { fileSize: 5 * 1024 * 1024 } });

      bb.on('field', (name, val) => { fields[name] = val; });

      bb.on('file', (name, stream, info) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end',  () => { files[name] = { buffer: Buffer.concat(chunks), ...info }; });
      });

      const onDone = () => {
        clearTimeout(timer);
        resolve({ fields, files });
      };

      bb.on('close', onDone);
      bb.on('finish', onDone);
      bb.on('error', (err) => { clearTimeout(timer); reject(err); });

      const bodyBuffer = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64')
        : Buffer.from(event.body || '', 'binary');

      bb.end(bodyBuffer);
    } catch (err) {
      clearTimeout(timer);
      reject(err);
    }
  });
}

// ─── Main handler ─────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type':                 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    // 1. Parse request
    const { fields, files } = await parseMultipart(event);

    const companyName  = (fields.companyName  || '').trim();
    const senderEmail  = (fields.senderEmail  || '').trim();
    const userId       = (fields.userId       || '').trim();
    let   offerContent = (fields.offerContent || '').trim();

    if (!companyName || !senderEmail) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'companyName and senderEmail are required.' }) };
    }

    // 2. Extract file text and append
    if (files.file) {
      try {
        const fileText = await extractTextFromFile(files.file.buffer, files.file.mimeType, files.file.filename);
        if (fileText) offerContent += '\n\n[Extracted from file]:\n' + fileText;
      } catch (fe) {
        console.warn('File extraction failed:', fe.message);
      }
    }

    // 3. Extract domain
    const domain = senderEmail.includes('@') ? senderEmail.split('@')[1].toLowerCase() : senderEmail;

    // 3.5 Native DNS MX Record Check (Is the domain actually real?)
    const dns = require('dns').promises;
    let hasValidMX = true;
    try {
      if (domain) {
        const mxRecords = await dns.resolveMx(domain);
        if (!mxRecords || mxRecords.length === 0) hasValidMX = false;
      }
    } catch (dnsErr) {
      hasValidMX = false; // Domain likely doesn't exist or is completely dead
    }

    // 4. Rule-based scoring (runs synchronously, fast)
    const { ruleScore, scoreBreakdown, ruleFlags } = ruleBasedScore(domain, offerContent);

    // Add DNS failure to rules
    if (!hasValidMX) {
      scoreBreakdown.domainMismatch += 50; 
      ruleFlags.push({ check: 'dns', detail: `The email domain (${domain}) has no valid mail servers (MX records). This is a massive red flag—it is likely a spoofed or dead domain.` });
    }

    // 5. AI analysis via Groq (async)
    let aiResult = { aiScore: 50, verdict: 'Suspicious', issues: [], summary: '' };
    try {
      aiResult = await getAIAnalysis(companyName, senderEmail, offerContent);
    } catch (aiErr) {
      console.error('Groq error:', aiErr.message);
    }

    // 6. Combine scores: Advanced Additive + Max Formula
    // If either the AI or the Rule Engine is highly confident it's a scam, we trust the highest signal, 
    // and then add a bonus weight from the other engine.
    const maxSignal     = Math.max(aiResult.aiScore, ruleScore);
    const minSignal     = Math.min(aiResult.aiScore, ruleScore);
    const combinedScore = Math.min(100, Math.round(maxSignal + (minSignal * 0.3)));

    // 7. Determine stricter verdicts
    let verdict;
    if (combinedScore >= 75)      verdict = 'High Risk';
    else if (combinedScore >= 35) verdict = 'Suspicious';
    else                          verdict = 'Safe';

    // 8. Build issues list (AI issues + any rule flags not already surfaced)
    const issues = Array.isArray(aiResult.issues) ? aiResult.issues : [];

    // Inject rule-based issues if not already covered
    if (scoreBreakdown.domainMismatch > 0 && !issues.some(i => i?.title?.toLowerCase()?.includes('domain'))) {
      issues.unshift({
        title:       'Domain Risk Advised',
        description: ruleFlags.find(f => f.check === 'domain' || f.check === 'dns')?.detail || 'Sender domain has severe issues or cannot be verified.',
        severity:    scoreBreakdown.domainMismatch >= 25 ? 'high' : 'medium',
      });
    }
    if (scoreBreakdown.financialFraud > 0 && !issues.some(i => i?.title?.toLowerCase()?.includes('payment') || i?.title?.toLowerCase()?.includes('financial'))) {
      issues.push({
        title:       'Financial Extortion Risk',
        description: ruleFlags.find(f => f.check === 'financial')?.detail || 'Contains language requesting payment. Authentic employers never charge applicants.',
        severity:    'high',
      });
    }
    if (scoreBreakdown.identityTheft > 0 && !issues.some(i => i?.title?.toLowerCase()?.includes('identity') || i?.title?.toLowerCase()?.includes('ssn'))) {
      issues.push({
        title:       'Identity Theft Hook',
        description: ruleFlags.find(f => f.check === 'identity')?.detail || 'Unusual request for highly sensitive personal data without standard background checks.',
        severity:    'high',
      });
    }
    if (scoreBreakdown.sketchyComms > 0 && !issues.some(i => i?.title?.toLowerCase()?.includes('communication') || i?.title?.toLowerCase()?.includes('sketchy'))) {
      issues.push({
        title:       'Unprofessional Communication',
        description: ruleFlags.find(f => f.check === 'comms')?.detail || 'Requires communication over anonymous apps like Telegram or WhatsApp.',
        severity:    'medium',
      });
    }
    
    // 9. Store in Firestore
    let scanId = 'IS-' + Date.now().toString(36).toUpperCase();
    try {
      const db  = getFirestore();
      const ref = await db.collection('scans').add({
        companyName,
        senderEmail,
        userId: userId || null, // Associate scan with user if logged in
        domain,
        offerContentSnippet: offerContent.slice(0, 500),
        riskScore:           combinedScore,
        aiScore:             aiResult.aiScore,
        ruleScore,
        scoreBreakdown,
        verdict,
        issues,
        summary:             aiResult.summary || '',
        hasFile:             !!files.file,
        timestamp:           admin.firestore.FieldValue.serverTimestamp(),
        createdAt:           new Date().toISOString(),
      });
      scanId = 'IS-' + ref.id.slice(0, 8).toUpperCase();
    } catch (dbErr) {
      console.error('Firestore write error:', dbErr.message);
      // Non-fatal — still return result
    }

    // 10. Return response
    const response = {
      riskScore: combinedScore,
      verdict,
      issues:    issues.slice(0, 5),          // cap at 5 cards
      summary:   aiResult.summary || '',
      scanId,
      domain,
      timestamp: new Date().toISOString(),
    };

    return {
      statusCode: 200,
      headers:    CORS,
      body:       JSON.stringify(response),
    };

  } catch (err) {
    console.error('analyze function error:', err);
    return {
      statusCode: 500,
      headers:    CORS,
      body:       JSON.stringify({ error: err.message, stack: err.stack }),
    };
  }
};
