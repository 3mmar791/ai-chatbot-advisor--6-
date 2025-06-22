"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

function sanitizeInput(input) {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export default function ForgotPasswordPage() {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedEmail = sanitizeInput(email);

    if (!sanitizedEmail) {
      setError(t("auth.validation.emailRequired") || "Email is required");
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      setError(
        t("auth.validation.emailInvalid") ||
          "Please enter a valid email address"
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        sanitizedEmail,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

      if (error) {
        console.error("Reset password error:", error);
        setError(
          t("auth.forgotPassword.resetFailed") ||
            "Failed to send reset email. Please try again."
        );
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Reset password error:", error);
      setError(
        t("auth.forgotPassword.resetFailed") ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="text-green-600" size={48} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-700 mb-4">
              📧 {t("auth.forgotPassword.checkEmail")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("auth.forgotPassword.emailSent")} <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-8">
              {t("auth.forgotPassword.emailInstructions")}
            </p>
            <div className="space-y-4">
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-slate-700 to-cyan-600 hover:from-slate-800 hover:to-cyan-700">
                  <ArrowLeft className={isRTL ? "ml-2" : "mr-2"} size={16} />
                  {t("auth.forgotPassword.backToSignIn")}
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                variant="outline"
                className="w-full"
              >
                {t("auth.forgotPassword.tryDifferentEmail")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/ai-logo.jpg"
              alt="AI Logo"
              width={80}
              height={80}
              className="rounded-2xl shadow-lg"
            />
          </div>
          <h2 className="text-3xl font-bold text-slate-700 mb-2">
            🔑 {t("auth.forgotPassword.title")}
          </h2>
          <p className="text-gray-600">{t("auth.forgotPassword.subtitle")}</p>
        </div>

        {/* Reset Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-slate-700">
              {t("auth.forgotPassword.passwordRecovery")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  📧 {t("auth.forgotPassword.email")}
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 ${
                      isRTL ? "right-0 pr-3" : "left-0 pl-3"
                    } flex items-center pointer-events-none`}
                  >
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${
                      isRTL ? "pr-10" : "pl-10"
                    } rounded-xl border-2 focus:border-cyan-500`}
                    placeholder={t("auth.forgotPassword.emailPlaceholder")}
                    maxLength={100}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-slate-700 to-cyan-600 hover:from-slate-800 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t("auth.forgotPassword.sendingResetLink")}</span>
                  </div>
                ) : (
                  `📧 ${t("auth.forgotPassword.sendResetLink")}`
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-cyan-600 hover:text-cyan-500 flex items-center justify-center"
              >
                <ArrowLeft className={isRTL ? "ml-1" : "mr-1"} size={16} />
                {t("auth.forgotPassword.backToSignIn")}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            🔒 {t("auth.forgotPassword.securityNote")}
          </h3>
          <p className="text-xs text-blue-700">
            {t("auth.forgotPassword.securityDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}
