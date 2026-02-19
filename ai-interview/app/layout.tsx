import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "InterviewAI - AI-Powered Interview Preparation",
  description: "Practice interviews with real-time AI feedback",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-950 text-white antialiased relative font-sans">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#fff",
              border: "1px solid #334155",
              borderRadius: "12px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}