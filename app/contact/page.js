"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Globe,
  Send,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function sanitizeInput(input) {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();

  const contactInfo = [
    {
      icon: MapPin,
      title: t("contact.contactInfo.facultyAddress"),
      content: t("contact.contactInfo.addressText"),
      color: "text-red-500",
    },
    {
      icon: Mail,
      title: t("contact.contactInfo.email"),
      content: "info@ai.menofia.edu.eg",
      color: "text-blue-500",
    },
    {
      icon: Phone,
      title: t("contact.contactInfo.phone"),
      content: "2240266",
      color: "text-green-500",
    },
    {
      icon: Clock,
      title: t("contact.contactInfo.officeHours"),
      content: t("contact.contactInfo.officeHoursText"),
      color: "text-purple-500",
    },
    {
      icon: Globe,
      title: t("contact.contactInfo.website"),
      content: "https://mu.menofia.edu.eg/FAI",
      color: "text-cyan-500",
    },
  ];

  // ... (keep all your existing handler functions unchanged)

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 py-12 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-700 mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-gray-600">{t("contact.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information - Improved Arabic styling */}
          <div>
            <h2
              className={`text-2xl font-bold text-slate-700 mb-8 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("contact.getInTouch")}
            </h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`flex items-start ${
                          isRTL ? "flex-row-reverse" : ""
                        } gap-4`}
                      >
                        {/* Icon placement based on direction */}
                        {isRTL ? null : (
                          <div className="p-3 rounded-full bg-gray-100">
                            <Icon className={info.color} size={24} />
                          </div>
                        )}
                        <div
                          className={`${
                            isRTL ? "text-right" : "text-left"
                          } flex-1`}
                        >
                          <h3 className="font-semibold text-slate-700 mb-2">
                            {info.title}
                          </h3>
                          <p
                            className={`text-gray-600 whitespace-pre-line ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            {info.content}
                          </p>
                        </div>
                        {/* Icon placement based on direction */}
                        {isRTL ? (
                          <div className="p-3 rounded-full bg-gray-100">
                            <Icon className={info.color} size={24} />
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Chat Option */}
            <Card className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <MessageCircle className="mx-auto mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">
                  {t("contact.needQuickAnswers")}
                </h3>
                <p className="mb-4">{t("contact.quickAnswersDesc")}</p>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => (window.location.href = "/chat")}
                >
                  {t("contact.startChatting")}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form (keep your existing form code unchanged) */}
          <div>
            {/* ... (keep your existing form code exactly as is) ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
