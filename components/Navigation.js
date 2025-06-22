"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  MessageCircle,
  Home,
  Info,
  HelpCircle,
  Phone,
  FileQuestion,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, isRTL } = useLanguage();

  const navItems = [
    { href: "/", label: t("navigation.home"), icon: Home },
    { href: "/chat", label: t("navigation.chat"), icon: MessageCircle },
    { href: "/about", label: t("navigation.about"), icon: Info },
    { href: "/help", label: t("navigation.help"), icon: HelpCircle },
    { href: "/contact", label: t("navigation.contact"), icon: Phone },
    { href: "/faq", label: t("navigation.faq"), icon: FileQuestion },
  ];

  const authItems = [
    { href: "/login", label: t("navigation.signIn"), icon: LogIn },
    { href: "/signup", label: t("navigation.signUp"), icon: UserPlus },
  ];

  return (
    <nav className="bg-slate-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/ai-logo.jpg"
                alt="AI Logo"
                width={40}
                height={40}
                className="rounded-lg mx-2"
              />
              <span className="text-white font-bold  sm:text-sm md:text-lg ">
                {t("navigation.aiAdvisor")}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center ${
                    isRTL ? "space-x-reverse" : ""
                  } space-x-1 text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-slate-600`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Auth Buttons */}
            <div
              className={`flex items-center space-x-2 ${
                isRTL ? "mr-4 pr-4 border-r" : "ml-4 pl-4 border-l"
              } border-slate-600`}
            >
              {authItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center ${
                      isRTL ? "space-x-reverse" : ""
                    } space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      item.href === "/signup"
                        ? "bg-cyan-600 text-white hover:bg-cyan-700"
                        : "text-gray-300 hover:text-white hover:bg-slate-600"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white hover:bg-slate-600 p-2 rounded-md"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800 rounded-lg mt-2 mb-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center ${
                      isRTL ? "space-x-reverse" : ""
                    } space-x-2 text-gray-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-slate-700`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              {/* Mobile Auth Buttons */}
              <div className="border-t border-slate-600 pt-3 mt-3">
                {authItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center ${
                        isRTL ? "space-x-reverse" : ""
                      } space-x-2 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                        item.href === "/signup"
                          ? "bg-cyan-600 text-white hover:bg-cyan-700"
                          : "text-gray-300 hover:text-white hover:bg-slate-600"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
