import "./globals.css";
import Footer from "./components/Footer/Footer";
import { Navbar } from "./components/Navbar/Navbar";
import { AuthProvider } from "../lib/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="w-full flex-grow mb-0">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
