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
          <main className="flex-grow p-0 m-0 md:p-4 md:m-0">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
