import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-black">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    © {new Date().getFullYear()} InternShield. Protecting students from exploitation.
                </p>
                <div className="flex gap-6">
                    <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                        Privacy Policy
                    </Link>
                    <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                        Terms of Service
                    </Link>
                </div>
            </div>
        </footer>
    );
}
