import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-xl w-full text-center text-gray-800">
        <h1 className="text-4xl font-bold mb-4">Welcome to the TT Web System</h1>
        <p className="text-lg text-gray-600 mb-8">
          Please choose your role to sign in.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          <button
            onClick={() => router.push("/signin-tutor")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
          >
            Sign in as Tutor
          </button>
          <button
            onClick={() => router.push("/signin-lecturer")}
            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
          >
            Sign in as Lecturer
          </button>
        </div>
      </div>
    </div>
  );
}
