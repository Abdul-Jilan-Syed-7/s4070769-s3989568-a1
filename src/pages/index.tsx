import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-2xl w-full text-center text-gray-800 space-y-6">
        <h1 className="text-4xl font-bold">TeachTeam Portal</h1>

        <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
          <button
            onClick={() => router.push("/signin-tutor")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition duration-200 hover:cursor-pointer"
          >
            Sign in as Tutor
          </button>
          <button
            onClick={() => router.push("/signin-lecturer")}
            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition duration-200 hover:cursor-pointer"
          >
            Sign in as Lecturer
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Need help? Contact <a href="mailto:support@teachteam.edu.au" className="underline text-blue-500">support@teachteam.edu.au</a>
        </div>
      </div>
    </div>
  );
}
