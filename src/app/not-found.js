import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">Oops! Page Not Found.</h2>
      <p className="mt-2 text-gray-800 dark:text-gray-400">
        It seems you&apos;ve taken a wrong turn. Let&apos;s get you back on track.
      </p>
      <div className="mt-6">
        <Link href="/" className="px-6 py-3 text-lg font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">
          Go back to homepage
        </Link>
      </div>
    </div>
  );
}
