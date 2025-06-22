"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  GraduationCap,
  BookOpen,
  Clock,
  FileText,
  Users,
  Calendar,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: GraduationCap,
      title: t("home.features.admissionRequirements.title"),
      desc: t("home.features.admissionRequirements.desc"),
    },
    {
      icon: BookOpen,
      title: t("home.features.academicPrograms.title"),
      desc: t("home.features.academicPrograms.desc"),
    },
    {
      icon: Clock,
      title: t("home.features.creditHourSystem.title"),
      desc: t("home.features.creditHourSystem.desc"),
    },
    {
      icon: FileText,
      title: t("home.features.courseRegistration.title"),
      desc: t("home.features.courseRegistration.desc"),
    },
    {
      icon: Users,
      title: t("home.features.graduationProject.title"),
      desc: t("home.features.graduationProject.desc"),
    },
    {
      icon: Calendar,
      title: t("home.features.fieldTraining.title"),
      desc: t("home.features.fieldTraining.desc"),
    },
  ];

  const quickQuestions = t("home.quickQuestions", []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-700 via-slate-600 to-cyan-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div
            className={`text-center transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Image
                  src="/images/ai-logo.jpg"
                  alt="AI Logo"
                  width={120}
                  height={120}
                  className="rounded-2xl shadow-2xl animate-pulse"
                />
                <div
                  className={`absolute -top-2 ${
                    isRTL ? "-left-2" : "-right-2"
                  }`}
                >
                  <Sparkles className="text-cyan-400 animate-spin" size={24} />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              👋 {t("home.title")}
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-4 max-w-4xl mx-auto">
              {t("home.subtitle")}
            </p>

            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              {t("home.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <MessageCircle
                    className={`${isRTL ? "ml-2" : "mr-2"}`}
                    size={20}
                  />
                  {t("home.startChatting")}
                  <ArrowRight
                    className={`${isRTL ? "mr-2" : "ml-2"}`}
                    size={20}
                  />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-slate-700 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
                >
                  {t("common.learnMore")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-700 mb-6">
            {t("home.academicAssistant")}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t("home.assistantDescription")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className={`hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                    isRTL
                      ? "border-r-4 border-r-cyan-500"
                      : "border-l-4 border-l-cyan-500"
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="text-cyan-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* What You Can Ask */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-700 mb-12">
            {t("home.whatYouCanAsk")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              t("home.features.admissionRequirements.title"),
              t("home.features.academicPrograms.title"),
              t("home.features.creditHourSystem.title"),
              t("home.features.courseRegistration.title"),
              t("home.features.graduationProject.title"),
              t("home.features.fieldTraining.title"),
              t("home.features.gradingGPA.title"),
              t("home.features.attendanceExams.title"),
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  isRTL ? "space-x-reverse" : ""
                } space-x-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <CheckCircle
                  className="text-green-500 flex-shrink-0"
                  size={20}
                />
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              {t("home.tryTheseQuestions")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickQuestions.map((question, index) => (
                <Link
                  key={index}
                  href={`/chat?q=${encodeURIComponent(question)}`}
                >
                  <Button
                    variant="outline"
                    className={`w-full ${
                      isRTL
                        ? "text-right justify-end"
                        : "text-left justify-start"
                    } bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200`}
                  >
                    <MessageCircle
                      className={`${isRTL ? "ml-2" : "mr-2"} flex-shrink-0`}
                      size={16}
                    />
                    <span className="truncate">"{question}"</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
