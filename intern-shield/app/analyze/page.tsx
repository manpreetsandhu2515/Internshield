"use client";

import { useState, ChangeEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { analyzeOffer, AnalysisResult } from "@/lib/analyzer";

export default function AnalyzePage() {
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!inputText.trim()) return;
        setLoading(true);
        setResult(null);

        // Call the mock analyzer (simulating API call)
        try {
            const data = await analyzeOffer(inputText);
            setResult(data);
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setInputText(text);
        };
        reader.readAsText(file);
    };

    // Helper for score color
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 border-green-600";
        if (score >= 50) return "text-yellow-600 border-yellow-600";
        return "text-red-600 border-red-600";
    };

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-10 animate-fade-in-up">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                            Analyze Your Internship Offer
                        </h1>
                        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                            Paste your offer letter or upload a file. We'll verify the company, check the salary, and spot red flags.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Input Section */}
                        <div className="flex flex-col gap-4 animate-fade-in-up animate-delay-100">
                            {/* File Upload Area */}
                            <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-6 transition-all hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-500/50 dark:hover:bg-blue-900/10">
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".txt,.csv,.md,.json"
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                    onChange={handleFileUpload}
                                />
                                <div className="text-center">
                                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                    </div>
                                    <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                        {fileName ? `Loaded: ${fileName}` : "Upload Offer File (TXT/CSV)"}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Drag & drop or click to browse</p>
                                </div>
                            </div>

                            <div className="relative">
                                <textarea
                                    id="offer-text"
                                    className="min-h-[400px] w-full rounded-2xl border-0 bg-white p-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-800 sm:text-sm sm:leading-6"
                                    placeholder="Or paste offer details here... (e.g., 'We are offering a 6-month unpaid internship...')"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !inputText}
                                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-center text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        Analying Offer...
                                    </div>
                                ) : (
                                    "Run Safety Check"
                                )}
                            </button>
                        </div>

                        {/* Results Section */}
                        <div className="flex flex-col gap-6 animate-fade-in-up animate-delay-200">
                            {!result && !loading && (
                                <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
                                    <div className="max-w-xs">
                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-zinc-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Ready to Analyze</h3>
                                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                            Your results will appear here. We check for salary, contract clarity, and company reputation.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {loading && (
                                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="relative flex h-20 w-20 items-center justify-center">
                                        <div className="absolute h-full w-full animate-ping rounded-full bg-blue-100 opacity-75 dark:bg-blue-900/20"></div>
                                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                                    </div>
                                    <p className="mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Analyzing Offer...</p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Scanning for red flags and salary data</p>
                                </div>
                            )}

                            {result && (
                                <div className="flex flex-col gap-6">
                                    {/* Main Score Card */}
                                    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                                        <div className="absolute top-0 right-0 p-6 opacity-10">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-32 w-32">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>

                                        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                            <div>
                                                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Safety Score</h2>
                                                <div className="mt-2 flex items-baseline gap-2">
                                                    <span className={`text-6xl font-black ${getScoreColor(result.risk_score).split(' ')[0]}`}>
                                                        {result.risk_score}
                                                    </span>
                                                    <span className="text-lg font-medium text-zinc-400">/100</span>
                                                </div>
                                                <div className={`mt-4 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold ${result.risk_level === "Safe" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                                        result.risk_level === "Caution" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}>
                                                    {result.risk_level === "Safe" && "✅ "}
                                                    {result.risk_level === "Caution" && "⚠️ "}
                                                    {result.risk_level === "High Risk" && "🚨 "}
                                                    {result.risk_level}
                                                </div>
                                            </div>

                                            <div className="flex-1 border-t pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0 dark:border-zinc-800">
                                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Verdict Recommendation</h3>
                                                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                    {result.student_explanation}
                                                </p>
                                                <p className="mt-4 font-bold text-zinc-900 dark:text-zinc-50">
                                                    Advice: {result.final_recommendation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Insights Grid */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/30">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                                    </svg>
                                                </div>
                                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Company Check</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`h-2.5 w-2.5 rounded-full ${result.company_reliability === "Verified" ? "bg-green-500" :
                                                        result.company_reliability === "Suspicious" ? "bg-red-500" : "bg-zinc-400"
                                                    }`} />
                                                <span className="font-medium text-zinc-900 dark:text-zinc-50">{result.company_reliability}</span>
                                            </div>
                                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{result.company_insight}</p>
                                        </div>

                                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/30">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Salary Insight</span>
                                            </div>
                                            <span className="font-medium text-zinc-900 dark:text-zinc-50">Market Estimate</span>
                                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{result.salary_insight}</p>
                                        </div>
                                    </div>

                                    {/* Detailed Lists */}
                                    <div className="space-y-4">
                                        {result.detected_risks.length > 0 && (
                                            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-5 dark:border-red-900/30 dark:bg-red-900/10">
                                                <h4 className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                    </svg>
                                                    Red Flags Found
                                                </h4>
                                                <ul className="mt-3 space-y-2">
                                                    {result.detected_risks.map((risk, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-red-900/80 dark:text-red-200/80">
                                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500"></span>
                                                            {risk}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {result.green_flags.length > 0 && (
                                            <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5 dark:border-green-900/30 dark:bg-green-900/10">
                                                <h4 className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                    </svg>
                                                    Good Signs
                                                </h4>
                                                <ul className="mt-3 space-y-2">
                                                    {result.green_flags.map((flag, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-green-900/80 dark:text-green-200/80">
                                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"></span>
                                                            {flag}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {result.missing_information.length > 0 && (
                                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-800/30">
                                                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Missing Details</h4>
                                                <ul className="mt-3 space-y-2">
                                                    {result.missing_information.map((info, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400"></span>
                                                            {info}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
