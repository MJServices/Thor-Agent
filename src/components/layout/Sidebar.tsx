"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Zap,
  DollarSign,
  Mail,
  LogIn,
  UserPlus,
  X,
  Menu,
  LogOut,
} from "lucide-react";
import ImageComponent from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Features", href: "/features", icon: Zap },
  { name: "Pricing", href: "/pricing", icon: DollarSign },
  { name: "Contact", href: "/contact", icon: Mail },
  { name: "Chat", href: "/chat", icon: Mail },
  { name: "Sign In", href: "/signin", icon: LogIn },
  { name: "Sign Up", href: "/signup", icon: UserPlus },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Filter navigation items based on authentication status
  const filteredNavItems = navItems.filter((item) => {
    // Hide Sign In and Sign Up if user is logged in
    if (user && (item.href === "/signin" || item.href === "/signup")) {
      return false;
    }
    // Show all other items
    return true;
  });

  // Add logout item if user is logged in
  const finalNavItems = user
    ? [...filteredNavItems, { name: "Logout", href: "#", icon: LogOut }]
    : filteredNavItems;

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        ref={toggleButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] p-2 rounded-lg bg-purple-900/40 backdrop-blur-md border border-yellow-400/20 text-yellow-100 hover:bg-purple-800/40 transition-all duration-300 shadow-lg"
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-purple-900/50 to-purple-950/50 backdrop-blur-xl border-r border-yellow-400/20 z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-yellow-400/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center shadow-lg golden-glow p-2">
                      <ImageComponent
                        src="/logo.png"
                        alt="Thor Agent"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-purple-800/40 transition-colors md:hidden"
                    aria-label="Close sidebar"
                  >
                    <X className="w-5 h-5 text-yellow-100" />
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {finalNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        {item.href === "#" ? (
                          <button
                            onClick={handleLogout}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left ${
                              isActive
                                ? "bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border border-yellow-400/30 text-yellow-100 shadow-lg"
                                : "text-yellow-100/80 hover:bg-purple-800/40 hover:text-yellow-100"
                            }`}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{item.name}</span>
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                              isActive
                                ? "bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border border-yellow-400/30 text-yellow-100 shadow-lg"
                                : "text-yellow-100/80 hover:bg-purple-800/40 hover:text-yellow-100"
                            }`}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-yellow-400/20">
                <div className="text-center text-yellow-100/60 text-sm">
                  © {new Date().getFullYear()} Thor Agent
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
