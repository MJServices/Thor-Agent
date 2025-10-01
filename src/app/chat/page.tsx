"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  History,
  X,
  ChevronLeft,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { Squares } from "@/components/ui/squares-background";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  imageUrl?: string; // Added for image messages
}

interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  preview: {
    role: string;
    content: string;
  }[];
}

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null); // Track current chat ID
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Thor Agent AI. How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false); // New state for image mode
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalChats: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  // Load chat history when history panel is opened
  useEffect(() => {
    if (showHistory) {
      loadChatHistory(1);
    }
  }, [showHistory]);

  const loadChatHistory = async (page: number = 1) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/chat/history?page=${page}&limit=10`);
      const data = await res.json();

      if (data.success) {
        setChatHistory(data.data.chats);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/${chatId}`);
      const data = await res.json();

      if (data.success) {
        // Convert timestamps to Date objects
        const loadedMessages = data.data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));

        setMessages(loadedMessages);
        setCurrentChatId(chatId); // Set the current chat ID
        setShowHistory(false);
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (isImageMode) {
      // Handle image generation
      await handleImageGeneration();
    } else {
      // Handle regular chat
      await handleChatMessage();
    }
  };

  const handleChatMessage = async () => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call the AI chat API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          messages: [
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: "user", content: inputValue },
          ],
        }),
      });

      const data = await res.json();

      if (data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.data.response,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        // Set the current chat ID if it's a new chat
        if (data.data.chatId && !currentChatId) {
          setCurrentChatId(data.data.chatId);
        }
      } else {
        // Handle error response
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message || "Failed to get response. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error: any) {
      // Handle network error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Failed to get response: ${
          error.message || "Please check your network connection and try again."
        }`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGeneration = async () => {
    // Add user image prompt
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `Generate an image: ${inputValue}`,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // If we don't have a chat ID yet, create a new chat first
      let chatId = currentChatId;
      if (!currentChatId) {
        console.log("No current chat ID, creating new chat for image"); // Debug log

        // Create a new chat with the initial message
        try {
          const chatRes = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              messages: [
                {
                  role: "assistant",
                  content:
                    "Hello! I'm Thor Agent AI. How can I assist you today?",
                },
                {
                  role: "user",
                  content: `Generate an image: ${inputValue}`,
                },
              ],
            }),
          });

          const chatData = await chatRes.json();
          if (chatData.success && chatData.data.chatId) {
            console.log("Created new chat for image:", chatData.data.chatId); // Debug log
            chatId = chatData.data.chatId;
            setCurrentChatId(chatId);
          }
        } catch (chatError) {
          console.error("Failed to create chat for image:", chatError);
        }
      }

      // Call the image generation API
      const res = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          prompt: inputValue,
          width: 512,
          height: 512,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Add the generated image to the chat
        const imageMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Here's the image you requested:",
          role: "assistant",
          timestamp: new Date(),
          // Handle both imageBase64 and imageUrl
          imageUrl: data.data.imageBase64
            ? `data:image/jpeg;base64,${data.data.imageBase64}`
            : data.data.imageUrl,
        };
        setMessages((prev) => [...prev, imageMessage]);

        // Save the image message to the database if we have a chat ID
        if (chatId) {
          try {
            const res = await fetch(`/api/chat/${chatId}/messages`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                message: {
                  role: "assistant",
                  content: imageMessage.content,
                  imageUrl: imageMessage.imageUrl,
                  timestamp: imageMessage.timestamp,
                },
              }),
            });

            const result = await res.json();
            if (!result.success) {
              console.error(
                "Failed to save image message to chat:",
                result.message
              );
            }
          } catch (saveError) {
            console.error("Failed to save image message to chat:", saveError);
          }
        } else {
          console.log(
            "No chat ID available, image message not saved to database"
          );
        }
      } else {
        // Handle error response
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            data.message || "Failed to generate image. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error: any) {
      // Handle network error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Failed to generate image: ${
          error.message || "Please check your network connection and try again."
        }`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setInputValue("");
      setIsLoading(false);
      setIsImageMode(false); // Reset to chat mode after generating image
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        id: "1",
        content: "Hello! I'm Thor Agent AI. How can I assist you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ]);
    setCurrentChatId(null); // Reset current chat ID
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content: "Hello! I'm Thor Agent AI. How can I assist you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ]);
    setCurrentChatId(null); // Reset current chat ID
  };

  const deleteChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/${chatId}/delete`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        // Remove the chat from the history list
        setChatHistory((prev: ChatHistoryItem[]) =>
          prev.filter((chat: ChatHistoryItem) => chat.id !== chatId)
        );
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const navItems = ["Home", "Features", "Chat", "Pricing", "Contact"];

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-yellow-100 text-xl"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  // If not authenticated, don't render the chat
  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 flex flex-col">
      <style>{`
        .chat-messages-container {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .chat-messages-container::-webkit-scrollbar {
          width: 6px;
        }
        .chat-messages-container::-webkit-scrollbar-track {
          background: rgba(107, 33, 168, 0.1);
        }
        .chat-messages-container::-webkit-scrollbar-thumb {
          background: rgba(107, 33, 168, 0.5);
          border-radius: 3px;
        }
        .chat-history-container {
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }
        .chat-history-container::-webkit-scrollbar {
          width: 6px;
        }
        .chat-history-container::-webkit-scrollbar-track {
          background: rgba(107, 33, 168, 0.1);
        }
        .chat-history-container::-webkit-scrollbar-thumb {
          background: rgba(107, 33, 168, 0.5);
          border-radius: 3px;
        }
      `}</style>
      {/* Background elements */}
      <Squares
        direction="diagonal"
        speed={0.3}
        squareSize={80}
        borderColor="#B084E8"
        hoverFillColor="#F3C710"
        className="absolute inset-0 z-0"
      />

      {/* Header */}
      <Header items={navItems} color="#ffd700" />

      {/* Main chat area */}
      <div className="flex-1 pt-20 pb-6 px-4 flex flex-col z-10">
        <div className="max-w-4xl mx-auto w-full flex flex-1">
          {/* Chat History Panel */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full md:w-80 lg:w-96 mr-4 bg-purple-900/30 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-yellow-100 text-lg font-bold flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Chat History
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => loadChatHistory(1)}
                      className="text-yellow-100 hover:text-yellow-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="text-yellow-100 hover:text-yellow-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {historyLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-yellow-100">Loading...</div>
                  </div>
                ) : (
                  <>
                    <div className="chat-history-container flex-1 overflow-y-auto mb-4">
                      {chatHistory.length > 0 ? (
                        chatHistory.map((chat) => (
                          <div
                            key={chat.id}
                            className="p-3 mb-2 bg-purple-800/20 hover:bg-purple-800/40 rounded-lg cursor-pointer border border-purple-500/20 transition-all relative"
                          >
                            <div className="flex justify-between items-start">
                              <div
                                className="flex-1 min-w-0"
                                onClick={() => loadChat(chat.id)}
                              >
                                <div className="font-medium text-yellow-100 truncate">
                                  {chat.title}
                                </div>
                                <div className="text-xs text-yellow-100/70 mt-1">
                                  {new Date(
                                    chat.updatedAt
                                  ).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-yellow-100/50 mt-1">
                                  {chat.preview.map((msg, idx) => (
                                    <div key={idx} className="truncate w-full">
                                      <span className="font-medium">
                                        {msg.role === "user" ? "You: " : "AI: "}
                                      </span>
                                      <span className="truncate">
                                        {msg.content}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteChat(chat.id);
                                }}
                                className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-yellow-100/70 text-center py-4">
                          No chat history found
                        </div>
                      )}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() =>
                            loadChatHistory(pagination.currentPage - 1)
                          }
                          disabled={!pagination.hasPrevPage}
                          className="px-3 py-1 bg-purple-800/50 text-yellow-100 rounded-lg disabled:opacity-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-yellow-100 text-sm">
                          Page {pagination.currentPage} of{" "}
                          {pagination.totalPages}
                        </span>
                        <button
                          onClick={() =>
                            loadChatHistory(pagination.currentPage + 1)
                          }
                          disabled={!pagination.hasNextPage}
                          className="px-3 py-1 bg-purple-800/50 text-yellow-100 rounded-lg disabled:opacity-50"
                        >
                          <ChevronLeft className="w-4 h-4 rotate-180" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center px-3 py-2 bg-purple-800/50 hover:bg-purple-800/70 text-yellow-100 rounded-lg transition-all"
              >
                <History className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">History</span>
              </button>
              <button
                onClick={startNewChat}
                className="flex items-center px-3 py-2 bg-purple-800/50 hover:bg-purple-800/70 text-yellow-100 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            </div>

            {/* Chat messages container - FIXED SCROLLING */}
            <div
              className="chat-messages-container flex-1 mb-4"
              style={{ maxHeight: "calc(100vh - 280px)" }}
            >
              <div className="max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex my-4 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="max-w-3xl">
                      <div
                        className={`rounded-2xl p-4 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border border-yellow-400/30 rounded-br-none"
                            : "bg-gradient-to-r from-purple-800/30 to-purple-900/30 border border-purple-500/30 rounded-bl-none"
                        }`}
                      >
                        {message.imageUrl ? (
                          <div className="flex flex-col">
                            <p className="text-yellow-100 mb-3">
                              {message.content}
                            </p>
                            <div className="rounded-lg overflow-hidden border border-purple-500/30">
                              <img
                                src={message.imageUrl}
                                alt="Generated by AI"
                                className="max-w-full h-auto"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-yellow-100 whitespace-pre-wrap">
                            {message.content}
                          </p>
                        )}
                        <p className="text-xs text-yellow-100/50 mt-2">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0 ml-3 mt-1">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-900" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start my-4">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-800/30 to-purple-900/30 border border-purple-500/30 rounded-2xl rounded-bl-none p-4 max-w-3xl">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                        <span className="text-yellow-100/70 text-sm ml-2">
                          {isImageMode
                            ? "Thor Agent is creating your image..."
                            : "Thor Agent is thinking..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area */}
            <div className="max-w-4xl mx-auto w-full">
              <div className="border-t border-purple-500/30 bg-purple-900/20 backdrop-blur-md rounded-xl p-4">
                {/* Mode toggle buttons */}
                <div className="flex mb-3 space-x-2">
                  <button
                    onClick={() => setIsImageMode(false)}
                    className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      !isImageMode
                        ? "bg-yellow-500 text-purple-900"
                        : "bg-purple-800/50 text-yellow-100"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Chat
                  </button>
                  <button
                    onClick={() => setIsImageMode(true)}
                    className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      isImageMode
                        ? "bg-yellow-500 text-purple-900"
                        : "bg-purple-800/50 text-yellow-100"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Generate Image
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        isImageMode
                          ? "Describe the image you want to generate..."
                          : "Message Thor Agent AI..."
                      }
                      className="w-full bg-purple-900/40 border border-purple-400/30 rounded-xl py-3 px-4 text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-purple-900 py-3 px-5 rounded-xl font-bold shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center"
                  >
                    {isImageMode ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
                <p className="text-xs text-yellow-100/50 text-center mt-2">
                  {isImageMode
                    ? "Thor Agent AI can generate images based on your descriptions. Please be descriptive but appropriate."
                    : "Thor Agent AI can make mistakes. Consider checking important information."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
