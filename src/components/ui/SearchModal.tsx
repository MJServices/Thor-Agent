"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ArrowRight,
  Clock,
  Zap,
  Image,
  DollarSign,
  Mail,
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  icon: React.ReactNode;
}

const searchData: SearchResult[] = [
  {
    id: "1",
    title: "AI-Powered Intelligence",
    description:
      "Advanced machine learning algorithms for creative suggestions",
    category: "Features",
    url: "/features",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "2",
    title: "Creative Gallery",
    description: "Explore stunning creations made with Thor Agent",
    category: "Gallery",
    url: "/gallery",
    icon: <Image className="w-4 h-4" />,
  },
  {
    id: "3",
    title: "Pro Plan",
    description: "For serious creators and professionals - $19/month",
    category: "Pricing",
    url: "/pricing",
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    id: "4",
    title: "Contact Support",
    description: "Get help from our expert support team",
    category: "Contact",
    url: "/contact",
    icon: <Mail className="w-4 h-4" />,
  },
  {
    id: "5",
    title: "Team Collaboration",
    description: "Real-time collaboration features for teams",
    category: "Features",
    url: "/features",
    icon: <Zap className="w-4 h-4" />,
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      const updated = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  const handleResultClick = (result: SearchResult) => {
    handleSearch(result.title);
    window.location.href = result.url;
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 z-50"
          >
            <div className="bg-purple-950/95 backdrop-blur-md border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-4 p-6 border-b border-purple-500/20">
                <Search className="w-5 h-5 text-purple-300" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search features, pricing, help..."
                  className="flex-1 bg-transparent text-white placeholder-purple-200/50 focus:outline-none text-lg"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-purple-500/20 transition-colors"
                >
                  <X className="w-5 h-5 text-purple-300" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {query.trim() ? (
                  results.length > 0 ? (
                    <div className="p-2">
                      {results.map((result, index) => (
                        <motion.button
                          key={result.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleResultClick(result)}
                          className="w-full p-4 rounded-lg hover:bg-purple-500/20 transition-colors text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center text-purple-300">
                              {result.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-medium group-hover:text-purple-200">
                                {result.title}
                              </h3>
                              <p className="text-purple-200/70 text-sm">
                                {result.description}
                              </p>
                              <span className="text-purple-300/60 text-xs">
                                {result.category}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-purple-200/70">
                        No results found for "{query}"
                      </p>
                    </div>
                  )
                ) : (
                  <div className="p-4">
                    {recentSearches.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-purple-200 font-medium mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Recent Searches
                        </h3>
                        <div className="space-y-1">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => setQuery(search)}
                              className="block w-full text-left p-2 rounded-lg hover:bg-purple-500/20 transition-colors text-purple-100/80 hover:text-white"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-purple-200 font-medium mb-3">
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "View Features", query: "features" },
                          { label: "See Pricing", query: "pricing" },
                          { label: "Browse Gallery", query: "gallery" },
                          { label: "Get Support", query: "contact" },
                        ].map((action) => (
                          <button
                            key={action.label}
                            onClick={() => setQuery(action.query)}
                            className="p-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors text-purple-100 text-sm"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
