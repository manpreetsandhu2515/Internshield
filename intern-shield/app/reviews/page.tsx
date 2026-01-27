"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock Data
interface Review {
    id: number;
    company: string;
    role: string;
    rating: number; // 1-5
    comment: string;
    author: string;
    date: string;
    verified: boolean;
}

const INITIAL_REVIEWS: Review[] = [
    {
        id: 1,
        company: "Tech Solutions Inc.",
        role: "Software Intern",
        rating: 2,
        comment: "Unpaid and overworked. They promised mentorship but I just made coffee and did data entry. Avoid.",
        author: "Anonymous Student",
        date: "2 days ago",
        verified: true,
    },
    {
        id: 2,
        company: "Global Innovations",
        role: "Marketing Intern",
        rating: 5,
        comment: "Amazing experience! Stipend was fair ($25/hr), and the team treated me like a full-time employee.",
        author: "Sarah J.",
        date: "1 week ago",
        verified: true,
    },
    {
        id: 3,
        company: "Alpha Startup",
        role: "Graphic Designer",
        rating: 3,
        comment: "Okayish. Learned a lot but the hours were long and the pay was barely minimum wage.",
        author: "Mike T.",
        date: "3 weeks ago",
        verified: false,
    },
    {
        id: 4,
        company: "Unknown Ventures",
        role: "Data Analyst",
        rating: 1,
        comment: "Scam alert! They asked me to pay for 'training materials' before starting. Left immediately.",
        author: "Verified User",
        date: "1 month ago",
        verified: true,
    },
];

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form State
    const [newCompany, setNewCompany] = useState("");
    const [newRole, setNewRole] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCompany || !newRole || !newComment) return;

        const newReview: Review = {
            id: Date.now(),
            company: newCompany,
            role: newRole,
            rating: newRating,
            comment: newComment,
            author: "You (Just Now)",
            date: "Just now",
            verified: false,
        };

        setReviews([newReview, ...reviews]);
        setIsFormOpen(false);
        // Reset form
        setNewCompany("");
        setNewRole("");
        setNewRating(5);
        setNewComment("");
    };

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row mb-12 animate-fade-in-up">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                                Community Reviews
                            </h1>
                            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                                See what others are saying. Transparency promotes safety.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95"
                        >
                            {isFormOpen ? "Cancel Review" : "Write a Review"}
                        </button>
                    </div>

                    {/* Review Form */}
                    {isFormOpen && (
                        <div className="mb-12 animate-fade-in-up">
                            <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                                <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">Share Your Experience</h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-50">Company Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="mt-2 block w-full rounded-md border-0 bg-zinc-50 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-zinc-800 dark:text-zinc-50 dark:ring-zinc-700 sm:text-sm sm:leading-6"
                                            placeholder="e.g. Google"
                                            value={newCompany}
                                            onChange={(e) => setNewCompany(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-50">Internship Role</label>
                                        <input
                                            type="text"
                                            required
                                            className="mt-2 block w-full rounded-md border-0 bg-zinc-50 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-zinc-800 dark:text-zinc-50 dark:ring-zinc-700 sm:text-sm sm:leading-6"
                                            placeholder="e.g. Software Engineer Intern"
                                            value={newRole}
                                            onChange={(e) => setNewRole(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-50">Rating (1-5)</label>
                                        <select
                                            className="mt-2 block w-full rounded-md border-0 bg-zinc-50 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-zinc-800 dark:text-zinc-50 dark:ring-zinc-700 sm:text-sm sm:leading-6"
                                            value={newRating}
                                            onChange={(e) => setNewRating(Number(e.target.value))}
                                        >
                                            <option value={5}>⭐⭐⭐⭐⭐ (Excellent)</option>
                                            <option value={4}>⭐⭐⭐⭐ (Good)</option>
                                            <option value={3}>⭐⭐⭐ (Okay)</option>
                                            <option value={2}>⭐⭐ (Bad)</option>
                                            <option value={1}>⭐ (Terrible)</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-50">Review</label>
                                        <textarea
                                            rows={4}
                                            required
                                            className="mt-2 block w-full rounded-md border-0 bg-zinc-50 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-zinc-800 dark:text-zinc-50 dark:ring-zinc-700 sm:text-sm sm:leading-6"
                                            placeholder="Tell us about the pay, culture, and workload..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 hover:scale-105 transition-all"
                                    >
                                        Post Review
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Review List */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {reviews.map((review, index) => (
                            <div
                                key={review.id}
                                className={`flex flex-col rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md animate-fade-in-up ${review.rating === 1 ? "border-red-200 bg-red-50/30 dark:border-red-900/30 dark:bg-red-900/10" :
                                        "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                                    }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{review.company}</h3>
                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{review.role}</p>
                                    </div>
                                    <div className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                                        <span className="text-yellow-500">★</span>
                                        <span className="font-bold text-zinc-900 dark:text-zinc-50">{review.rating}</span>
                                    </div>
                                </div>

                                <p className="mt-4 flex-1 text-base text-zinc-600 dark:text-zinc-400">"{review.comment}"</p>

                                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-400 dark:from-zinc-700 dark:to-zinc-900"></div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">{review.author}</span>
                                            <span className="text-xs text-zinc-500 dark:text-zinc-500">{review.date}</span>
                                        </div>
                                    </div>
                                    {review.verified && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400">
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
