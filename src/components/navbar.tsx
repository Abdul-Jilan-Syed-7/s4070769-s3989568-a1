import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">TeachTeam</Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/signin" className="hover:underline">Sign In</Link>
          <Link href="/signup" className="hover:underline">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
