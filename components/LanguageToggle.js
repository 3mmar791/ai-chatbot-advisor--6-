"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Globe, Check } from "lucide-react"

export default function LanguageToggle() {
  const { language, changeLanguage, isLoading } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === language)

  const handleLanguageChange = async (langCode) => {
    if (langCode !== language) {
      await changeLanguage(langCode)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-slate-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{currentLanguage?.flag}</span>
        <span className="hidden md:inline">{currentLanguage?.name}</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[150px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between transition-colors duration-200 ${
                  language === lang.code ? "bg-cyan-50 text-cyan-600" : "text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </div>
                {language === lang.code && <Check size={16} className="text-cyan-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
