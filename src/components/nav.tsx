import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const  {logout } = useAuth();
    const router = useRouter();
    return (
      <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">TeachTeam</Link>
        <div className="space-x-4">
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="hover:underline"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
    )
}