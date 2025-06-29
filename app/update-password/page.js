"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Lock,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

function sanitizeInput(input) {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

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

export default function UpdatePasswordPage() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          setIsValidSession(false);
        } else if (session) {
          setIsValidSession(true);
        } else {
          const accessToken = searchParams.get("access_token");
          const refreshToken = searchParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              console.error("Session set error:", sessionError);
              setIsValidSession(false);
            } else {
              setIsValidSession(true);
            }
          } else {
            setIsValidSession(false);
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        setIsValidSession(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [searchParams]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password =
        t("auth.validation.passwordRequired") || "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        t("auth.validation.passwordMinLength8") ||
        "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        t("auth.validation.confirmPasswordRequired") ||
        "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        t("auth.validation.passwordsDoNotMatch") || "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(sanitizedValue));
    }

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
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        console.error("Password update error:", error);
        setErrors({
          general:
            error.message ||
            t("auth.updatePassword.updateFailed") ||
            "Failed to update password. Please try again.",
        });
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Password update error:", error);
      setErrors({
        general:
          t("auth.updatePassword.updateFailed") ||
          "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {t("auth.updatePassword.verifyingResetLink")}
          </p>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle className="text-red-600" size={48} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-700 mb-4">
              ❌ {t("auth.updatePassword.invalidResetLink")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("auth.updatePassword.invalidLinkDescription")}
            </p>
            <div className="space-y-4">
              <Link href="/forgot-password">
                <Button className="w-full bg-gradient-to-r from-slate-700 to-cyan-600 hover:from-slate-800 hover:to-cyan-700">
                  {t("auth.updatePassword.requestNewResetLink")}
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className={isRTL ? "ml-2" : "mr-2"} size={16} />
                  {t("auth.updatePassword.backToSignIn")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
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
              ✅ {t("auth.updatePassword.passwordUpdated")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("auth.updatePassword.passwordUpdateSuccess")}
            </p>
            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-slate-700 to-cyan-600 hover:from-slate-800 hover:to-cyan-700">
                {t("auth.updatePassword.continueToSignIn")}
              </Button>
            </Link>
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
            🔒 {t("auth.updatePassword.title")}
          </h2>
          <p className="text-gray-600">{t("auth.updatePassword.subtitle")}</p>
        </div>

        {/* Update Password Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-slate-700">
              {t("auth.updatePassword.setNewPassword")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <span className="text-red-700 text-sm">{errors.general}</span>
                </div>
              )}

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  🔒 {t("auth.updatePassword.newPassword")}
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
                    placeholder={t("auth.updatePassword.passwordPlaceholder")}
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
                        {t(
                          `auth.signUp.passwordStrength.${passwordStrength.strength}`
                        ).toUpperCase()}
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
                  <div className="flex items-center space-x-1 mt-1">
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
                  🔒 {t("auth.updatePassword.confirmNewPassword")}
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
                      isRTL ? "pr-10 pl-12" : "pl-10 pr-12"
                    } rounded-xl border-2 focus:border-cyan-500 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder={t(
                      "auth.updatePassword.confirmPasswordPlaceholder"
                    )}
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
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertCircle className="text-red-500" size={16} />
                    <span className="text-red-500 text-sm">
                      {errors.confirmPassword}
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
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t("auth.updatePassword.updatingPassword")}</span>
                  </div>
                ) : (
                  `🔒 ${t("auth.updatePassword.updatePassword")}`
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
                {t("auth.updatePassword.backToSignIn")}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        {/* <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800 mb-2">
            🔒 {t("auth.updatePassword.securityNotice")}
          </h3>
          <p className="text-xs text-green-700">
            {t("auth.updatePassword.securityDescription")}
          </p>
        </div> */}
      </div>
    </div>
  );
}
