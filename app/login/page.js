"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

// Security function to sanitize input
function sanitizeInput(input) {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { t, isRTL } = useLanguage();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = t("auth.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("auth.validation.emailInvalid");
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t("auth.validation.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("auth.validation.passwordMinLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = type === "checkbox" ? checked : sanitizeInput(value);

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert(t("auth.validation.fixErrors"));
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        alert(`${t("auth.signIn.loginFailed")}: ${error.message}`);
        return;
      }

      if (data?.user) {
        alert(t("auth.signIn.loginSuccess"));
        router.push("/chat");
      }
    } catch (error) {
      alert(
        `${t(
          "auth.signIn.loginFailed"
        )}: An unexpected error occurred. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
            🔐 {t("auth.signIn.title")}
          </h2>
          <p className="text-gray-600">{t("auth.signIn.subtitle")}</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-slate-700">
              {t("auth.signIn.welcomeBack")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  📧 {t("auth.signIn.email")}
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
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${
                      isRTL ? "pr-10" : "pl-10"
                    } rounded-xl border-2 focus:border-cyan-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder={t("auth.signIn.emailPlaceholder")}
                    maxLength={100}
                    required
                  />
                </div>
                {errors.email && (
                  <div
                    className={`flex items-center ${
                      isRTL ? "space-x-reverse" : ""
                    } space-x-1 mt-1`}
                  >
                    <AlertCircle className="text-red-500" size={16} />
                    <span className="text-red-500 text-sm">{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  🔑 {t("auth.signIn.password")}
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 ${
                      isRTL ? "right-0 pr-3" : "left-0 pl-3"
                    } flex items-center pointer-events-none`}
                  >
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`${
                      isRTL ? "pr-10 pl-12" : "pl-10 pr-12"
                    } rounded-xl border-2 focus:border-cyan-500 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder={t("auth.signIn.passwordPlaceholder")}
                    maxLength={100}
                    required
                  />
                  <button
                    type="button"
                    className={`absolute inset-y-0 ${
                      isRTL ? "left-0 pl-3" : "right-0 pr-3"
                    } flex items-center`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div
                    className={`flex items-center ${
                      isRTL ? "space-x-reverse" : ""
                    } space-x-1 mt-1`}
                  >
                    <AlertCircle className="text-red-500" size={16} />
                    <span className="text-red-500 text-sm">
                      {errors.password}
                    </span>
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className={`${
                      isRTL ? "mr-2" : "ml-2"
                    } block text-sm text-gray-700`}
                  >
                    ✅ {t("auth.signIn.rememberMe")}
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-cyan-600 hover:text-cyan-500"
                >
                  🔘 {t("auth.signIn.forgotPassword")}
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-slate-700 to-cyan-600 hover:from-slate-800 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
              >
                {isLoading ? (
                  <div
                    className={`flex items-center ${
                      isRTL ? "space-x-reverse" : ""
                    } space-x-2`}
                  >
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t("auth.signIn.signingIn")}</span>
                  </div>
                ) : (
                  `🔐 ${t("auth.signIn.signInSecurely")}`
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t("auth.signIn.noAccount")}{" "}
                <Link
                  href="/signup"
                  className="font-medium text-cyan-600 hover:text-cyan-500"
                >
                  {t("auth.signIn.createAccount")} →
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            🔒 {t("auth.signIn.securityNotice")}
          </h3>
          <p className="text-xs text-blue-700">
            {t("auth.signIn.securityDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}
