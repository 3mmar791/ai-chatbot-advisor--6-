"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BookOpen,
  Clock,
  FileText,
  Users,
  Globe,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState(new Set(["0-0"])); // First question open by default
  const { t, isRTL, translations } = useLanguage();

  const faqCategories = [
    {
      key: "admission",
      icon: GraduationCap,
      color: "text-blue-500",
    },
    {
      key: "programs",
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      key: "creditHours",
      icon: Clock,
      color: "text-purple-500",
    },
    {
      key: "trainingProjects",
      icon: FileText,
      color: "text-orange-500",
    },
    {
      key: "gradesAssessment",
      icon: Users,
      color: "text-red-500",
    },
    {
      key: "generalInfo",
      icon: Globe,
      color: "text-cyan-500",
    },
  ];

  // Helper function to safely get questions array
  const getQuestions = (categoryKey) => {
    try {
      const category = translations?.faq?.categories?.[categoryKey];
      if (category && Array.isArray(category.questions)) {
        return category.questions;
      }
      return [];
    } catch (err) {
      console.error("Error getting questions:", err);
      return [];
    }
  };

  const toggleItem = (categoryIndex, questionIndex) => {
    const itemId = `${categoryIndex}-${questionIndex}`;
    const newOpenItems = new Set(openItems);

    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }

    setOpenItems(newOpenItems);
  };

  const filteredCategories = faqCategories
    .map((category, categoryIndex) => {
      const questions = getQuestions(category.key);
      const filteredQuestions = questions.filter(
        (q) =>
          q?.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q?.answer?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return {
        ...category,
        title: t(`faq.categories.${category.key}.title`),
        questions: filteredQuestions,
      };
    })
    .filter((category) => category.questions.length > 0);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 py-12 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-700 mb-4">
            {t("faq.title")}
          </h1>
          <p className="text-xl text-gray-600">{t("faq.subtitle")}</p>
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
              placeholder={t("faq.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${
                isRTL ? "pr-10" : "pl-10"
              } rounded-xl border-2 focus:border-cyan-500`}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div
                key={category.key}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Category Header */}
                <div className="bg-gradient-to-r from-slate-100 to-cyan-50 p-6 border-b">
                  <div
                    className={`flex items-center ${
                      isRTL ? "flex-row-reverse justify-end" : "justify-start"
                    } space-x-3 ${isRTL ? "space-x-reverse" : ""}`}
                  >
                    {/* Icon and title order based on direction */}
                    {isRTL ? (
                      <>
                        <div className="bg-white p-2 rounded-full shadow-sm">
                          <Icon className={category.color} size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-700 text-right">
                          {category.title}
                        </h2>
                      </>
                    ) : (
                      <>
                        <div className="bg-white p-2 rounded-full shadow-sm">
                          <Icon className={category.color} size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-700 text-left">
                          {category.title}
                        </h2>
                      </>
                    )}
                  </div>
                </div>

                {/* Questions */}
                <div className="divide-y divide-gray-100">
                  {category.questions.map((faq, questionIndex) => {
                    const itemId = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openItems.has(itemId);

                    return (
                      <div
                        key={questionIndex}
                        className="transition-all duration-200"
                      >
                        <button
                          onClick={() =>
                            toggleItem(categoryIndex, questionIndex)
                          }
                          className={`w-full text-left p-6 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200 ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-between ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <h3
                              className={`text-lg font-semibold text-slate-700 ${
                                isRTL ? "pl-4" : "pr-4"
                              }`}
                            >
                              {faq.question}
                            </h3>
                            {isOpen ? (
                              <ChevronUp
                                className="text-cyan-500 flex-shrink-0"
                                size={20}
                              />
                            ) : (
                              <ChevronDown
                                className="text-gray-400 flex-shrink-0"
                                size={20}
                              />
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <div
                            className={`px-6 pb-6 animate-in slide-in-from-top-2 duration-200 ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            <div className="bg-cyan-50 rounded-lg p-4 border-l-4 border-l-cyan-500">
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t("faq.noResults")}
            </h3>
            <p className="text-gray-500 mb-6">{t("faq.noResultsDesc")}</p>
            <Button
              onClick={() => setSearchTerm("")}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {t("faq.clearSearch")}
            </Button>
          </div>
        )}

        {/* Still Have Questions */}
        <div className="mt-16 bg-gradient-to-r from-slate-700 to-cyan-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            {t("faq.stillHaveQuestions")}
          </h2>
          <p className="mb-6 text-gray-200">
            {t("faq.stillHaveQuestionsDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => (window.location.href = "/chat")}
            >
              <MessageCircle className={isRTL ? "ml-2" : "mr-2"} size={18} />
              {t("faq.askChatbot")}
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => (window.location.href = "/contact")}
            >
              {t("faq.contactFaculty")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
