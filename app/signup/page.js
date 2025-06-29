"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
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

// Password strength checker
function checkPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  let strength = "weak";
  let color = "red";

  if (score >= 4) {
    strength = "strong";
    color = "green";
  } else if (score >= 3) {
    strength = "medium";
    color = "yellow";
  }

  return { checks, score, strength, color };
}

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { t, isRTL } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = t("auth.validation.fullNameRequired");
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = t("auth.validation.fullNameMinLength");
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = t("auth.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("auth.validation.emailInvalid");
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t("auth.validation.passwordRequired");
    } else if (formData.password.length < 8) {
      newErrors.password = t("auth.validation.passwordMinLength8");
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.validation.confirmPasswordRequired");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.validation.passwordsDoNotMatch");
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t("auth.validation.agreeToTermsRequired");
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

    // Update password strength for password field
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(sanitizedValue));
    }

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
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (error) {
        alert(`${t("auth.signUp.registrationFailed")}: ${error.message}`);
        return;
      }

      if (data?.user) {
        alert(t("auth.signUp.accountCreated"));
        router.push("/login");
      }
    } catch (error) {
      alert(
        `${t(
          "auth.signUp.registrationFailed"
        )}: An unexpected error occurred. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update the return JSX to use translations for all text elements
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
            📝 {t("auth.signUp.title")}
          </h2>
          <p className="text-gray-600">{t("auth.signUp.subtitle")}</p>
        </div>

        {/* Sign Up Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-slate-700">
              {t("auth.signUp.getStarted")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  👤 {t("auth.signUp.fullName")}
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 ${
                      isRTL ? "right-0 pr-3" : "left-0 pl-3"
                    } flex items-center pointer-events-none`}
                  >
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`${
                      isRTL ? "pr-10" : "pl-10"
                    } rounded-xl border-2 focus:border-cyan-500 ${
                      errors.fullName ? "border-red-500" : ""
                    }`}
                    placeholder={t("auth.signUp.fullNamePlaceholder")}
                    maxLength={100}
                    required
                  />
                </div>
                {errors.fullName && (
                  <div
                    className={`flex items-center ${
                      isRTL ? "space-x-reverse" : ""
                    } space-x-1 mt-1`}
                  >
                    <AlertCircle className="text-red-500" size={16} />
                    <span className="text-red-500 text-sm">
                      {errors.fullName}
                    </span>
                  </div>
                )}
              </div>

              {/* Continue with other form fields using similar pattern... */}
              {/* Email, Password, Confirm Password fields with translations */}
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  📧 {t("auth.signUp.email")}
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
                    placeholder={t("auth.signUp.emailPlaceholder")}
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
                  🔒 {t("auth.signUp.password")}
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
                      isRTL ? "pr-12 pl-10" : "pl-10 pr-12"
                    } rounded-xl border-2 focus:border-cyan-500 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder={t("auth.signUp.passwordPlaceholder")}
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

                {/* Password Strength Indicator */}
                {passwordStrength && formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.color === "green"
                              ? "bg-green-500"
                              : passwordStrength.color === "yellow"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.color === "green"
                            ? "text-green-600"
                            : passwordStrength.color === "yellow"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {passwordStrength.strength.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="flex items-center space-x-1">
                        {passwordStrength.checks.length ? (
                          <Check className="text-green-500" size={12} />
                        ) : (
                          <X className="text-red-500" size={12} />
                        )}
                        <span>
                          {t(
                            "auth.signUp.passwordStrength.requirements.characters"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {passwordStrength.checks.uppercase ? (
                          <Check className="text-green-500" size={12} />
                        ) : (
                          <X className="text-red-500" size={12} />
                        )}
                        <span>
                          {t(
                            "auth.signUp.passwordStrength.requirements.uppercase"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {passwordStrength.checks.number ? (
                          <Check className="text-green-500" size={12} />
                        ) : (
                          <X className="text-red-500" size={12} />
                        )}
                        <span>
                          {t(
                            "auth.signUp.passwordStrength.requirements.number"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {passwordStrength.checks.special ? (
                          <Check className="text-green-500" size={12} />
                        ) : (
                          <X className="text-red-500" size={12} />
                        )}
                        <span>
                          {t(
                            "auth.signUp.passwordStrength.requirements.symbol"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

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

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  🔒 {t("auth.signUp.confirmPassword")}
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
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`${
                      isRTL ? "pr-12 pl-10" : "pl-10 pr-12"
                    } rounded-xl border-2 focus:border-cyan-500 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder={t("auth.signUp.confirmPasswordPlaceholder")}
                    maxLength={100}
                    required
                  />
                  <button
                    type="button"
                    className={`absolute inset-y-0 ${
                      isRTL ? "left-0 pl-3" : "right-0 pr-3"
                    } flex items-center`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div
                    className={`flex items-center ${
                      isRTL ? "space-x-reverse" : ""
                    } space-x-1 mt-1`}
                  >
                    <AlertCircle className="text-red-500" size={16} />
                    <span className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </span>
                  </div>
                )}
              </div>

              {/* Terms Agreement */}
              <div>
                <div className="flex items-start">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded mt-1"
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className={`${
                      isRTL ? "mr-2" : "ml-2"
                    } block text-sm text-gray-700`}
                  >
                    ✅ {t("auth.signUp.agreeToTerms")}{" "}
                    <Link
                      href="/terms"
                      className="text-cyan-600 hover:text-cyan-500"
                    >
                      {t("auth.signUp.termsOfService")}
                    </Link>{" "}
                    {t("auth.signUp.and")}{" "}
                    <Link
                      href="/privacy"
                      className="text-cyan-600 hover:text-cyan-500"
                    >
                      {t("auth.signUp.privacyPolicy")}
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <div
                    className={`flex items-center ${
                      isRTL ? "space-x-reverse" : ""
                    } space-x-1 mt-1`}
                  >
                    <AlertCircle className="text-red-500" size={16} />
                    <span className="text-red-500 text-sm">
                      {errors.agreeToTerms}
                    </span>
                  </div>
                )}
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
                    <span>{t("auth.signUp.creatingAccount")}</span>
                  </div>
                ) : (
                  `📝 ${t("auth.signUp.createAccount")}`
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t("auth.signUp.alreadyHaveAccount")}{" "}
                <Link
                  href="/login"
                  className="font-medium text-cyan-600 hover:text-cyan-500"
                >
                  {t("auth.signUp.signInHere")} →
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        {/* <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800 mb-2">🔒 {t("auth.signUp.securityNotice")}</h3>
          <p className="text-xs text-green-700">{t("auth.signUp.securityDescription")}</p>
        </div> */}
      </div>
    </div>
  );
}
