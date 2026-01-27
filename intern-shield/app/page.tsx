import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center py-32 text-center px-4 md:px-6 lg:py-40 overflow-hidden">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#a855f7] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>

          <h1 className="max-w-5xl text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-8xl animate-fade-in-up opacity-0">
            Is your internship offer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">legit</span>?
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 animate-fade-in-up opacity-0 animate-delay-100">
            Don't sign blindly. InternShield uses advanced AI to scan offer letters for hidden red flags, unpaid exploitations, and scam warnings.
          </p>
          <div className="mt-12 flex items-center justify-center gap-x-8 animate-fade-in-up opacity-0 animate-delay-200">
            <Link
              href="/analyze"
              className="rounded-full bg-zinc-900 px-10 py-4 text-base font-semibold text-white shadow-xl transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Analyze Offer Free
            </Link>
            <Link href="/about" className="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-50 hover:text-blue-600 transition-colors">
              How it works <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Why InternShield?</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                AI-Powered Protection for Interns
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-50">
                    AI Risk Analysis
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-400">
                    <p className="flex-auto">
                      Our NLP engine scans your offer letter for hidden red flags, missing stipends, and vague responsibilities.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-50">
                    Community Verified
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-400">
                    <p className="flex-auto">
                      See ratings and warnings from real students who have worked there. Don't rely on Glassdoor alone.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-50">
                    Instant Verdict
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-400">
                    <p className="flex-auto">
                      Get a clear "Safe", "Warning", or "Danger" score in seconds, explained in simple language.
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
