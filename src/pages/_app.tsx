import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Nav from "../components/navbar";
import Footer from "../components/footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Nav />
      <main className="flex-grow p-4">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
