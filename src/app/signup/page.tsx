"use client";

import { Squares } from "@/components/ui/squares-background";
import { InteractiveCard } from "@/components/lightswind/interactive-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (result.success) {
        router.push("/chat");
      } else {
        setError(result.message || "Failed to create account");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden flex items-center justify-center p-4">
      <Squares
        direction="diagonal"
        speed={0.5}
        squareSize={80}
        borderColor="#B084E8"
        hoverFillColor="#F3C710"
        className="absolute inset-0"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-20"
      >
        <InteractiveCard
          InteractiveColor="#ffd700"
          tailwindBgClass="bg-purple-900/30 backdrop-blur-md"
          className="p-8 rounded-3xl border border-purple-400/30 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-yellow-100 mb-2">
              Create Account
            </h1>
            <p className="text-yellow-100/70">
              Join Thor Agent to unleash your creativity
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-yellow-100 font-medium mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-yellow-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-purple-900/40 border border-purple-400/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-yellow-100 font-medium mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-yellow-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-purple-900/40 border border-purple-400/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-yellow-100 font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-yellow-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 bg-purple-900/40 border border-purple-400/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-yellow-400 hover:text-yellow-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-yellow-400 hover:text-yellow-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-yellow-100 font-medium mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-yellow-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 bg-purple-900/40 border border-purple-400/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-yellow-400 hover:text-yellow-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-yellow-400 hover:text-yellow-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-purple-900 py-3 rounded-xl font-bold shadow-lg golden-glow transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Terms and Conditions */}
            <p className="text-center text-yellow-100/70 text-sm">
              By signing up, you agree to our{" "}
              <Link href="#" className="text-yellow-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-yellow-400 hover:underline">
                Privacy Policy
              </Link>
            </p>

            {/* Sign In Link */}
            <p className="text-center text-yellow-100/70">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-yellow-400 font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </InteractiveCard>
      </motion.div>
    </section>
  );
}
