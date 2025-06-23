import "./globals.css";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata = {
  title: "AI Chatbot Advisor - Faculty of AI, Menoufia University",
  description:
    "Your smart academic assistant for the Faculty of Artificial Intelligence at Menoufia University",
  generator: "v0.dev",
  icons: {
    icon: "/ai-logo.jpg", // Favicon path (PNG format)
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <LanguageProvider>
          <AuthProvider>
            <Navigation />
            <main className="min-h-screen">{children}</main>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
