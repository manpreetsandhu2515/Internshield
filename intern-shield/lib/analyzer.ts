"use server";
import OpenAI from "openai";

export type RiskLevel = "Safe" | "Caution" | "High Risk";
export type Recommendation = "Proceed" | "Proceed with Caution" | "Avoid";

export interface AnalysisResult {
    risk_score: number;
    risk_level: RiskLevel;
    detected_risks: string[];
    green_flags: string[];
    missing_information: string[];
    student_explanation: string;
    final_recommendation: Recommendation;
    company_reliability: "Verified" | "Unknown" | "Suspicious";
    company_insight: string;
    salary_insight: string;
}

const SYSTEM_PROMPT = `
You are InternShield, an AI-powered system that helps students evaluate the safety and legitimacy of internship offers.

Your task is to analyze internship-related information provided by the user.
Use Natural Language Processing (NLP) reasoning to identify potential risks, including:
- Unpaid or exploitative work
- Vague or unclear job roles
- Missing stipend, duration, or contract details
- Excessive work expectations
- Unprofessional communication

Also, analyze the company and role details:
- Identify the company name and verify its reputation/reliability (based on your training data).
- Estimate the average salary range for the mentioned role in the industry.

After analysis, generate a JSON response with:
1. risk_score (0-100)
2. risk_level (Safe, Caution, High Risk)
3. detected_risks (array of strings)
4. green_flags (array of strings)
5. missing_information (array of strings)
6. student_explanation (simple, non-technical language)
7. final_recommendation (Proceed, Proceed with Caution, Avoid)
8. company_reliability (Verified, Unknown, Suspicious) - "Verified" if a known legitimate company, "Suspicious" if red flags found, "Unknown" if not enough info.
9. company_insight (Brief details about the company or "Company name not found/recognized")
10. salary_insight (Estimated average salary for this role or "Salary data unavailable")

Return strictly valid JSON. No markdown formatting.
`;

export async function analyzeOffer(text: string): Promise<AnalysisResult> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey || apiKey === "your_deepseek_api_key_here") {
        // Fallback for simulation if no key is present
        console.warn("⚠️ No OpenRouter API Key found. Returning mock data.");
        return mockAnalyze(text);
    }

    try {
        const client = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
            defaultHeaders: {
                "HTTP-Referer": "http://localhost:3000", // Update with your actual site URL in production
                "X-Title": "InternShield",
            }
        });

        const response = await client.chat.completions.create({
            model: "deepseek/deepseek-chat",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: text },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;

        if (!content) {
            throw new Error("No content received from API");
        }

        // Parse JSON safely
        const parsedResult = JSON.parse(content);
        return parsedResult as AnalysisResult;

    } catch (error) {
        console.error("Analysis Failed:", error);
        // Fallback to mock if API fails
        return mockAnalyze(text);
    }
}

// Fallback Mock Function
function mockAnalyze(text: string): AnalysisResult {
    const lowerText = text.toLowerCase();
    const risks: string[] = [];
    const greenFlags: string[] = [];
    const missing: string[] = [];

    if (lowerText.includes("unpaid") || lowerText.includes("no stipend")) risks.push("Unpaid work detected");
    if (lowerText.includes("telegram")) risks.push("Unprofessional communication (Telegram)");

    if (lowerText.includes("stipend") || /\$\d+/.test(text)) greenFlags.push("Stipend mentioned");
    if (lowerText.includes("contract")) greenFlags.push("Contract mentioned");

    if (!lowerText.includes("duration")) missing.push("Internship duration");

    let score = 100 - (risks.length * 20) + (greenFlags.length * 5);
    if (!lowerText.includes("stipend")) score -= 30;
    score = Math.max(0, Math.min(100, score));

    let level: RiskLevel = score < 50 ? "High Risk" : score < 80 ? "Caution" : "Safe";
    let rec: Recommendation = score < 50 ? "Avoid" : score < 80 ? "Proceed with Caution" : "Proceed";

    // Mock Company Logic
    let companyReliability: "Verified" | "Unknown" | "Suspicious" = "Unknown";
    let companyInsight = "No company name detected in simulation.";

    if (lowerText.includes("google") || lowerText.includes("microsoft") || lowerText.includes("amazon")) {
        companyReliability = "Verified";
        companyInsight = "Big Tech company, generally very safe regarding contracts.";
    } else if (lowerText.includes("unknown startup")) {
        companyReliability = "Suspicious";
        companyInsight = "Using a generic startup name explicitly often used in scams.";
    }

    // Mock Salary Logic
    let salaryInsight = "Market average for internships varies. Software Engineering normally ~$15-30/hr.";

    return {
        risk_score: score,
        risk_level: level,
        detected_risks: risks,
        green_flags: greenFlags,
        missing_information: missing,
        student_explanation: "Analysis simulation (API Key missing or failed). Please check your offer details.",
        final_recommendation: rec,
        company_reliability: companyReliability,
        company_insight: companyInsight,
        salary_insight: salaryInsight
    };
}
