import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thor Agent - Your Imagination, Amplified",
  description:
    "AI co-creator for artists, designers, and innovators. Generate breathtaking visuals, sculpt digital worlds, and bring your most ambitious ideas to life.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <Sidebar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
