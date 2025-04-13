import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { logout } = useAuth();

  const currentPath = router.pathname;

  // Hide navbar on login, signup, and role-based sign-in pages
  const hideNavbar = ["/signin-tutor", "/signin-lecturer", "/signup"].includes(currentPath);
  if (hideNavbar) return null;

  // Show Sign Out only on dashboard pages
  const showSignOut = ["/tutor-dashboard", "/lecturer-dashboard"].includes(currentPath);

  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">TeachTeam</Link>

        <div className="space-x-4">
          {!showSignOut && (
            <Link href="/" className="hover:underline">Home</Link>
          )}

          {showSignOut && (
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="hover:underline"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
