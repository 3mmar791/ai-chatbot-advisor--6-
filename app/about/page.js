"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Eye,
  Award,
  Users,
  BookOpen,
  Globe,
  Calendar,
  MapPin,
  GraduationCap,
  Lightbulb,
} from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext"; // Adjust the import path as necessary

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: Users, number: "1000+", label: t("about.stats.studentsEnrolled") },
    {
      icon: BookOpen,
      number: "4",
      label: t("about.stats.specializedPrograms"),
    },
    { icon: Award, number: "50+", label: t("about.stats.facultyMembers") },
    { icon: Globe, number: "2030", label: t("about.stats.visionAligned") },
  ];

  const programs = [
    {
      title: t("about.programs.dataScience.title"),
      description: t("about.programs.dataScience.description"),
      icon: "📊",
    },
    {
      title: t("about.programs.machineIntelligence.title"),
      description: t("about.programs.machineIntelligence.description"),
      icon: "🤖",
    },
    {
      title: t("about.programs.cybersecurity.title"),
      description: t("about.programs.cybersecurity.description"),
      icon: "🔒",
    },
    {
      title: t("about.programs.intelligentSystems.title"),
      description: t("about.programs.intelligentSystems.description"),
      icon: "⚡",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
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
                alt="Faculty of AI Logo"
                width={100}
                height={100}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t("about.title")}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-cyan-600" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-slate-700 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-slate-700 mb-6">
                {t("about.aboutFaculty")}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t("about.description1")}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t("about.description2")}
              </p>
            </div>
            <div
              className={`bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 text-white`}
              dir={isRTL ? "rtl" : "ltr"}
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              <h3 className="text-2xl font-bold mb-4">
                {t("about.quickFacts")}
              </h3>
              <div className="space-y-3">
                {/* Established */}
                <div
                  className={`flex items-center gap-x-3 ${
                    isRTL ? "flex-row-reverse justify-end" : ""
                  }`}
                >
                  {isRTL ? (
                    <>
                      <span>{t("about.established")}</span>
                      <Calendar className="text-cyan-200" size={20} />
                    </>
                  ) : (
                    <>
                      <Calendar className="text-cyan-200" size={20} />
                      <span>{t("about.established")}</span>
                    </>
                  )}
                </div>
                {/* Location */}
                <div
                  className={`flex items-center gap-x-3 ${
                    isRTL ? "flex-row-reverse justify-end" : ""
                  }`}
                >
                  {isRTL ? (
                    <>
                      <span>{t("about.location")}</span>
                      <MapPin className="text-cyan-200" size={20} />
                    </>
                  ) : (
                    <>
                      <MapPin className="text-cyan-200" size={20} />
                      <span>{t("about.location")}</span>
                    </>
                  )}
                </div>
                {/* Duration */}
                <div
                  className={`flex items-center gap-x-3 ${
                    isRTL ? "flex-row-reverse justify-end" : ""
                  }`}
                >
                  {isRTL ? (
                    <>
                      <span>{t("about.duration")}</span>
                      <GraduationCap className="text-cyan-200" size={20} />
                    </>
                  ) : (
                    <>
                      <GraduationCap className="text-cyan-200" size={20} />
                      <span>{t("about.duration")}</span>
                    </>
                  )}
                </div>
                {/* Language */}
                <div
                  className={`flex items-center gap-x-3 ${
                    isRTL ? "flex-row-reverse justify-end" : ""
                  }`}
                >
                  {isRTL ? (
                    <>
                      <span>{t("about.language")}</span>
                      <Globe className="text-cyan-200" size={20} />
                    </>
                  ) : (
                    <>
                      <Globe className="text-cyan-200" size={20} />
                      <span>{t("about.language")}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div
                  className={`flex items-center mb-4 ${
                    isRTL
                      ? "flex-row-reverse gap-x-3 justify-end"
                      : "space-x-3 justify-start"
                  }`}
                >
                  {isRTL ? (
                    <>
                      <h3 className="text-2xl font-bold text-slate-700 text-right">
                        {t("about.vision")}
                      </h3>
                      <div className="bg-cyan-100 p-3 rounded-full">
                        <Eye className="text-cyan-600" size={24} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-cyan-100 p-3 rounded-full">
                        <Eye className="text-cyan-600" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-700 text-left">
                        {t("about.vision")}
                      </h3>
                    </>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {t("about.visionText")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-slate-500 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div
                  className={`flex items-center mb-4 ${
                    isRTL
                      ? "flex-row-reverse gap-x-3 justify-end"
                      : "space-x-3 justify-start"
                  }`}
                >
                  {isRTL ? (
                    <>
                      <h3 className="text-2xl font-bold text-slate-700 text-right">
                        {t("about.mission")}
                      </h3>
                      <div className="bg-slate-100 p-3 rounded-full">
                        <Target className="text-slate-600" size={24} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-slate-100 p-3 rounded-full">
                        <Target className="text-slate-600" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-700 text-left">
                        {t("about.mission")}
                      </h3>
                    </>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {t("about.missionText")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Programs */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-slate-700 mb-12">
              {t("about.ourPrograms")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programs.map((program, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{program.icon}</div>
                    <h3 className="text-xl font-bold text-slate-700 mb-3">
                      {program.title}
                    </h3>
                    <p className="text-gray-600">{program.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-gradient-to-r from-slate-700 to-cyan-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <div className="flex justify-center mb-6">
              <Lightbulb className="text-cyan-300" size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-6">
              {t("about.whyChooseUs")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="font-bold mb-2">{t("about.industryFocused")}</h3>
                <p className="text-gray-200">
                  {t("about.industryFocusedDesc")}
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">{t("about.globalStandards")}</h3>
                <p className="text-gray-200">
                  {t("about.globalStandardsDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
