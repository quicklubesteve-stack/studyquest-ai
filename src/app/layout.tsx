import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store/useAppStore";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AccessibilityBar } from "@/components/common/AccessibilityBar";

export const metadata: Metadata = {
  title: "StudyQuest AI — Learn Your Way. Play Your Way. Grow Every Day.",
  description:
    "An interactive, multi-generation, AI-powered educational web application for learners from kindergarten through senior adulthood.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-pt-20">
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <AppProvider>
            {/* Skip link for keyboard accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-quest-600 text-white font-bold p-3 z-50 rounded-lg shadow-lg"
            >
              Skip to main content
            </a>
            <AccessibilityBar />
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
