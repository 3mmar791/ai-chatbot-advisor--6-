"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  MessageCircle,
  Search,
  BookOpen,
  Lightbulb,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t, isRTL, translations } = useLanguage();
  console.log(translations);
  const helpTopics = [
    {
      icon: MessageCircle,
      title: t("help.topics.howToUse.title"),
      content: translations?.help?.topics?.howToUse?.content || [],
      key: "howToUse",
    },
    {
      icon: Lightbulb,
      title: t("help.topics.betterAnswers.title"),
      content: translations?.help?.topics?.betterAnswers?.content || [],
      key: "betterAnswers",
    },
    {
      icon: BookOpen,
      title: t("help.topics.availableInfo.title"),
      content: translations?.help?.topics?.availableInfo?.content || [],
      key: "availableInfo",
    },
    {
      icon: HelpCircle,
      title: t("help.topics.commonQuestions.title"),
      content: translations?.help?.topics?.commonQuestions?.content || [],
      key: "commonQuestions",
    },
  ];
  // Filter topics based on search term
  const filteredTopics = helpTopics.filter((topic) => {
    const matchesTitle = topic.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesContent = Array.isArray(topic.content)
      ? topic.content.some(
          (item) =>
            typeof item === "string" &&
            item.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : false;
    return matchesTitle || matchesContent;
  });

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 py-12 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-slate-700 to-cyan-600 p-4 rounded-full">
              <HelpCircle className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-700 mb-4">
            {t("help.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("help.subtitle")}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search
              className={`absolute ${
                isRTL ? "right-3" : "left-3"
              } top-1/2 transform -translate-y-1/2 text-gray-400`}
              size={20}
            />
            <Input
              type="text"
              placeholder={t("help.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${
                isRTL ? "pr-10" : "pl-10"
              } rounded-xl border-2 focus:border-cyan-500`}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* Help Topics */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {filteredTopics.map((topic) => (
              <Card
                key={topic.key}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-cyan-100 p-2 rounded-full">
                      <topic.icon className="text-cyan-600" size={20} />
                    </div>
                    <span>{topic.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {topic.content.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start space-x-2"
                      >
                        <CheckCircle
                          className="text-green-500 mt-0.5 flex-shrink-0"
                          size={16}
                        />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t("help.noResults")}</p>
            <p className="text-gray-400">{t("help.noResultsDesc")}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-slate-700 to-cyan-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-6">{t("help.stillNeedHelp")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => (window.location.href = "/chat")}
            >
              <MessageCircle className="mr-2" size={18} />
              {t("help.quickActions.tryChatbot")}
              <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => (window.location.href = "/contact")}
            >
              {t("help.quickActions.contactFaculty")}
              <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => (window.location.href = "/faq")}
            >
              {t("help.quickActions.viewFaq")}
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
