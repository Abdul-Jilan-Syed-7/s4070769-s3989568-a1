import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  return (
    <section className="max-w-4xl mx-auto text-center sm:text-left">
      <h1 className="text-4xl font-bold mb-4">Welcome to TeachTeam (TT)</h1>
      <p className="mb-6 text-lg leading-relaxed">
        TeachTeam is a streamlined system to facilitate tutor hiring at the School of Computer Science.
      </p>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => router.push("/signin")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </div>
    </section>
  );
}
