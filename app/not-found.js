"use client";

import Link from "next/link";
import { Home, MessageCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t, isRTL } = useLanguage();

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center px-4 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <div className="text-center max-w-md mx-auto">
        <div className="text-8xl font-bold text-slate-300 mb-4">404</div>
        <h1 className="text-3xl font-bold text-slate-700 mb-4">
          {t("notFound.title")}
        </h1>
        <p className="text-gray-600 mb-8">{t("notFound.description")}</p>

        <div className="space-y-4">
          <Link href="/">
            <button className="w-full bg-gradient-to-r from-slate-700 to-cyan-600 hover:from-slate-800 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center mb-2">
              <Home className={isRTL ? "ml-2" : "mr-2"} size={18} />
              {t("notFound.goHome")}
            </button>
          </Link>

          <Link href="/chat">
            <button className="w-full border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center">
              <MessageCircle className={isRTL ? "ml-2" : "mr-2"} size={18} />
              {t("notFound.tryChatbot")}
            </button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full text-gray-600 hover:text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
          >
            <ArrowLeft
              className={isRTL ? "ml-2 transform rotate-180" : "mr-2"}
              size={18}
            />
            {t("notFound.goBack")}
          </button>
        </div>
      </div>
    </div>
  );
}
