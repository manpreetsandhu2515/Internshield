import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
            <Navbar />

            <main className="flex-1">
                {/* Mission Header */}
                <section className="relative isolate px-6 pt-14 lg:px-8">
                    <div className="mx-auto max-w-4xl py-16 sm:py-24">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
                                Protecting Students, One Offer at a Time
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                                InternShield is dedicated to exposing exploitative internship practices and empowering early-career professionals with the knowledge they need to make safe career decisions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* The Problem & Solution */}
                <section className="bg-white py-24 dark:bg-zinc-900">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                            <div className="lg:pr-8 lg:pt-4">
                                <div className="lg:max-w-lg">
                                    <h2 className="text-base font-semibold leading-7 text-blue-600">The Problem</h2>
                                    <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                                        The Internship Wild West
                                    </p>
                                    <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                                        Thousands of students fall victim to predatory internships every year. From unpaid labor disguised as "training" to vague contracts that exploit intellectual property, the landscape is full of traps.
                                    </p>
                                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                        <div className="relative pl-9">
                                            <dt className="inline font-semibold text-zinc-900 dark:text-zinc-50">
                                                🚩 Unpaid Labor
                                            </dt>
                                            <dd className="inline">: Companies expecting full-time output for zero compensation.</dd>
                                        </div>
                                        <div className="relative pl-9">
                                            <dt className="inline font-semibold text-zinc-900 dark:text-zinc-50">
                                                🚩 Vague Roles
                                            </dt>
                                            <dd className="inline">: Descriptions that hide the reality of menial tasks.</dd>
                                        </div>
                                        <div className="relative pl-9">
                                            <dt className="inline font-semibold text-zinc-900 dark:text-zinc-50">
                                                🚩 Scams
                                            </dt>
                                            <dd className="inline">: "Pay-to-work" schemes and data harvesting operations.</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            <div className="flex items-center justify-center lg:items-start">
                                <div className="rounded-2xl bg-zinc-50 p-8 ring-1 ring-zinc-200 dark:bg-zinc-800/50 dark:ring-zinc-700">
                                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Our Solution</h3>
                                    <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                                        We use advanced AI (DeepSeek) to analyze offer letters and contracts instantly. Our system parses legalese, detects red flags, and verifies company reputations to give students a clear "Safe" or "Risky" verdict.
                                    </p>
                                    <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-700">
                                        <p className="font-semibold text-blue-600">Free forever for students.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Our Values</h2>
                            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                                Built by students, for students.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-center sm:grid-cols-3 lg:mx-0 lg:max-w-none">
                            <div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Transparency</h3>
                                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">No hidden biases. Our analysis is objective and based on data.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Privacy</h3>
                                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Your offer letters are analyzed anonymously. We don't sell your data.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Community</h3>
                                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Join a network of students sharing their experiences to protect each other.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
