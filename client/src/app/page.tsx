import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold">
          TaskFlow
        </h1>

        <p className="mt-4 text-gray-600">
          Real-time Collaborative Kanban Board
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-black px-6 py-3 text-white"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-lg border px-6 py-3"
          >
            Signup
          </Link>
        </div>
      </div>
    </main>
  );
}