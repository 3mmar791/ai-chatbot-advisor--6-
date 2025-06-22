"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPage() {
  const { t, isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-700 via-slate-600 to-cyan-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div
            className={`text-center transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex justify-center mb-8">
              <Image
                src="/images/ai-logo.jpg"
                alt="AI Logo"
                width={100}
                height={100}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              🔒 {t("privacy.title")}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {t("privacy.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/signup">
            <Button
              variant="outline"
              className={`flex items-center space-x-2 hover:bg-gray-50 ${
                isRTL ? "space-x-reverse" : ""
              }`}
            >
              <ArrowLeft
                size={16}
                className={isRTL ? "transform rotate-180" : ""}
              />
              <span>{t("privacy.backToSignUp")}</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle
                className={`text-3xl text-slate-700 flex items-center ${
                  isRTL ? "flex-row-reverse space-x-reverse" : "space-x-3"
                }`}
              >
                <Shield className="text-cyan-600" size={32} />
                <span>{t("privacy.title")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <div className="space-y-8 text-gray-700">
                <p className="text-lg leading-relaxed">
                  {t("privacy.introduction")}
                </p>

                <div className="space-y-6">
                  {Object.entries(
                    t("privacy.sections", {}, { returnObjects: true })
                  ).map(([key, section], index) => (
                    <div key={key}>
                      <h2 className="text-2xl font-bold text-slate-700 mb-4">
                        {index + 1}. {section.title}
                      </h2>
                      <p className="leading-relaxed">{section.content}</p>
                    </div>
                  ))}

                  <div className="border-t pt-6 mt-8">
                    <p className="text-sm text-gray-500">
                      <strong>{t("privacy.lastUpdated")}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-8 bg-gradient-to-r from-slate-700 to-cyan-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold mb-4">
                📧 {t("privacy.questionsTitle")}
              </h3>
              <p className="mb-6">{t("privacy.questionsDesc")}</p>
              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center ${
                  isRTL ? "sm:flex-row-reverse" : ""
                }`}
              >
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {t("privacy.contactFaculty")}
                  </Button>
                </Link>
                <Link href="/help">
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {t("privacy.helpCenter")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
