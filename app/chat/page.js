"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Bot,
  User,
  Menu,
  X,
  Plus,
  MessageSquare,
  Trash2,
  Edit3,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  saveChat,
  getUserChats,
  updateChatTitle,
  updateChatMessages,
  deleteChat,
} from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
// Security function to sanitize input
function sanitizeInput(input) {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim()
    .slice(0, 500); // Limit length
}

// Thinking animation component
function ThinkingAnimation() {
  return (
    <div className="flex items-center space-x-2 p-4">
      <Bot className="text-cyan-500" size={24} />
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
      <span className="text-gray-500 text-sm animate-pulse">
        AI is thinking...
      </span>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const { t, isRTL } = useLanguage();

  // State for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Current chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      content: `🤖 ${t("chat.botGreeting")}`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedTopics = [
    {
      icon: "📚",
      text: t("chat.suggestedTopicsList.admissionCriteria"),
      query: t("chat.suggestedQueries.admissionRequirements"),
    },
    {
      icon: "🧠",
      text: t("chat.suggestedTopicsList.programMajors"),
      query: t("chat.suggestedQueries.availableMajors"),
    },
    {
      icon: "⏳",
      text: t("chat.suggestedTopicsList.creditHours"),
      query: t("chat.suggestedQueries.creditHoursNeeded"),
    },
    {
      icon: "📝",
      text: t("chat.suggestedTopicsList.registrationDeadlines"),
      query: t("chat.suggestedQueries.registrationDeadlines"),
    },
    {
      icon: "🎓",
      text: t("chat.suggestedTopicsList.graduationProject"),
      query: t("chat.suggestedQueries.graduationProject"),
    },
    {
      icon: "👨‍🏫",
      text: t("chat.suggestedTopicsList.academicAdvising"),
      query: t("chat.suggestedQueries.academicAdvising"),
    },
    {
      icon: "📅",
      text: t("chat.suggestedTopicsList.semesterCalendar"),
      query: t("chat.suggestedQueries.academicCalendar"),
    },
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user's chat sessions
  const loadChatSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await getUserChats(user.id);
      if (error) {
        console.error("Error loading chats:", error);
        return;
      }
      setChatSessions(data || []);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  // Load chat sessions when user is available
  useEffect(() => {
    if (user) {
      loadChatSessions();
    }
  }, [user]);

  // Handle chat selection
  const selectChat = (chatId) => {
    const selectedChat = chatSessions.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setActiveChatId(chatId);
      setMessages(selectedChat.messages || []);
      setIsSidebarOpen(false); // Close sidebar on mobile after selection
    }
  };

  // Create new chat
  const createNewChat = async () => {
    if (!user) return;

    const newMessages = [
      {
        id: 1,
        role: "bot",
        content: `🤖 ${t("chat.botGreeting")}`,
        timestamp: new Date(),
      },
    ];

    const newTitle = `${t("chat.newChatTitle")} ${chatSessions.length + 1}`;

    try {
      setIsSaving(true);
      const { data, error } = await saveChat(newTitle, newMessages, user.id);

      if (error) {
        alert(t("chat.failedToCreateChat"));
        return;
      }

      setChatSessions((prev) => [data, ...prev]);
      setActiveChatId(data.id);
      setMessages(newMessages);
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error creating new chat:", error);
      alert(t("chat.failedToCreateChat"));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle chat title editing
  const startEditingTitle = (chatId, currentTitle) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const saveEditedTitle = async (chatId) => {
    if (!editingTitle.trim()) return;

    try {
      const { error } = await updateChatTitle(chatId, editingTitle.trim());

      if (error) {
        alert("Failed to update chat title. Please try again.");
        return;
      }

      // Update local state
      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: editingTitle.trim() } : chat
        )
      );

      setEditingChatId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Error updating chat title:", error);
      alert("Failed to update chat title. Please try again.");
    }
  };

  const cancelEditingTitle = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  // Delete chat
  const handleDeleteChat = async (chatId) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      const { error } = await deleteChat(chatId);

      if (error) {
        alert("Failed to delete chat. Please try again.");
        return;
      }

      // Update local state
      setChatSessions((prev) => prev.filter((chat) => chat.id !== chatId));

      // If deleted chat was active, reset to new chat
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([
          {
            id: 1,
            role: "bot",
            content:
              "🤖 Hello! I'm your AI Academic Advisor. How can I help you today?",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat. Please try again.");
    }
  };

  // Simulate AI response (replace with actual API call later)
  const simulateAIResponse = async (userMessage) => {
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 2000)
    );

    const responses = {
      admission:
        "For admission to the Faculty of AI, you need a high school certificate with a science or math track. International students must pass a math qualifier. The minimum grade requirements vary each year based on competition.",
      credit:
        "You need 146 credit hours to graduate, distributed over 4 academic years (8 semesters). This includes core courses, electives, field training, and your graduation project.",
      majors:
        "We offer four main specializations: Data Science, Machine Intelligence, Cybersecurity, and Intelligent Systems. Each program is designed to prepare you for the future of AI technology.",
      project:
        "The graduation project is worth 6 credit hours and spans your final year. You'll work on a real-world AI problem under faculty supervision. Field training (internship) is also mandatory.",
      default:
        "Thank you for your question! I'm here to help with information about the Faculty of Artificial Intelligence at Menoufia University. Could you please be more specific about what you'd like to know?",
    };

    const lowerMessage = userMessage.toLowerCase();
    let response = responses.default;

    for (const [key, value] of Object.entries(responses)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    return response;
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const sanitizedInput = sanitizeInput(input);

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: sanitizedInput,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await simulateAIResponse(sanitizedInput);

      const botMessage = {
        id: Date.now() + 1,
        role: "bot",
        content: response,
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);

      // Save/update chat in database
      if (activeChatId) {
        // Update existing chat
        await updateChatMessages(activeChatId, finalMessages);
        setChatSessions((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId
              ? { ...chat, messages: finalMessages, updated_at: new Date() }
              : chat
          )
        );
      } else {
        // Create new chat if none is active
        const newTitle = `Chat about ${sanitizedInput.slice(0, 30)}...`;
        const { data, error } = await saveChat(
          newTitle,
          finalMessages,
          user.id
        );

        if (!error && data) {
          setChatSessions((prev) => [data, ...prev]);
          setActiveChatId(data.id);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedTopic = (query) => {
    setInput(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return t("chat.today");
    if (days === 1) return t("chat.yesterday");
    if (days < 7) return `${days} ${t("chat.daysAgo")}`;
    return date.toLocaleDateString();
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen
            ? "translate-x-0"
            : isRTL
            ? "translate-x-full"
            : "-translate-x-full"
        } fixed inset-y-0 ${
          isRTL ? "right-0" : "left-0"
        } z-40 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-slate-700 to-cyan-600">
          <div className="py-1">
            <h2 className="text-lg font-semibold text-white">
              {t("chat.chatHistory")}
            </h2>
            <p className="text-xs text-cyan-100">
              {t("chat.welcome")},{" "}
              {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
          <div
            className={`flex items-center ${
              isRTL ? "space-x-reverse" : ""
            } space-x-2`}
          >
            <Button
              onClick={createNewChat}
              disabled={isSaving}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg"
              title={t("chat.newChat")}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Plus size={18} />
              )}
            </Button>
            <Button
              onClick={handleSignOut}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg"
              title={t("chat.signOut")}
            >
              <LogOut size={18} />
            </Button>
            <Button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg"
            >
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* Chat Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {chatSessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageSquare className="mx-auto mb-2" size={32} />
              <p>{t("chat.noChatSessions")}</p>
              <p className="text-sm">{t("chat.startNewConversation")}</p>
            </div>
          ) : (
            <div className="p-2">
              {chatSessions.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={`group relative p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    activeChatId === chat.id
                      ? "bg-cyan-50 border-l-4 border-l-cyan-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {editingChatId === chat.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                saveEditedTitle(chat.id);
                              } else if (e.key === "Escape") {
                                cancelEditingTitle();
                              }
                            }}
                            className="text-sm"
                            autoFocus
                          />
                          <div className="flex space-x-1">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                saveEditedTitle(chat.id);
                              }}
                              className="text-xs px-2 py-1 bg-green-500 text-white rounded"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelEditingTitle();
                              }}
                              className="text-xs px-2 py-1 bg-gray-500 text-white rounded"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-medium text-slate-700 truncate">
                            {chat.title}
                          </h3>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {chat.messages?.length > 1
                              ? chat.messages[
                                  chat.messages.length - 1
                                ]?.content?.slice(0, 50) + "..."
                              : "New conversation"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimestamp(chat.created_at)}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Chat Actions */}
                    {editingChatId !== chat.id && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingTitle(chat.id, chat.title);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
                          title="Edit Title"
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chat.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
                          title="Delete Chat"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Supabase Integration Status */}
        <div className="p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            <p>🔗 {t("chat.connectedToSupabase")}</p>
            <p>{t("chat.chatsAutoSaved")}</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-slate-700 to-cyan-600 p-4 text-white shadow-lg">
          <div
            className={`flex items-center ${
              isRTL ? "space-x-reverse" : ""
            } space-x-3`}
          >
            <Button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg"
            >
              <Menu size={18} />
            </Button>
            <div className="bg-white/20 p-2 rounded-full">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t("chat.title")}</h1>
              <p className="text-cyan-100">{t("chat.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.role === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      message.role === "user" ? "bg-cyan-500" : "bg-slate-600"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="text-white" size={16} />
                    ) : (
                      <Bot className="text-white" size={16} />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm md:text-base">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-cyan-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && <ThinkingAnimation />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Topics */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Suggested Topics:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {suggestedTopics.map((topic, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedTopic(topic.query)}
                    className="text-left justify-start h-auto p-2 hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200"
                  >
                    <span className="mr-1">{topic.icon}</span>
                    <span className="text-xs">{topic.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("chat.typePlaceholder")}
                className="flex-1 rounded-xl border-2 focus:border-cyan-500"
                disabled={isLoading}
                maxLength={500}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-cyan-500 hover:bg-cyan-600 rounded-xl px-6"
              >
                <Send size={18} />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send • {input.length}/500 characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
