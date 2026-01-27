import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
            <div className="flex items-center gap-2">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    InternShield
                </Link>
            </div>
            <div className="hidden items-center gap-6 md:flex">
                <Link href="/" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">
                    Home
                </Link>
                <Link href="/analyze" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">
                    Analyze Offer
                </Link>
                <Link href="/reviews" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">
                    Community Reviews
                </Link>
                <Link href="/about" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">
                    About
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <Link
                    href="/analyze"
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                    Check Risk
                </Link>
            </div>
        </nav>
    );
}
