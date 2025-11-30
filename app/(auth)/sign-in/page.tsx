"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { setAuthCookie } from "@/lib/auth";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const SignIn: () => React.JSX.Element = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Attempting login with:", formData.email);

    try {
      const response = await authApi.login(formData);
      console.log("Login response:", response);
      const { user, token } = response.data;

      setAuth(user, token);
      setAuthCookie(token);
      console.log("Redirecting to dashboard...");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error ? err.message : "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-dvh py-4 mx-2">
      <Card className="w-full max-w-md glassmorphism-card backdrop-blur-sm gap-0">
        <CardHeader>
          <Link href="/" className="auth-logo p-6 flex justify-center">
            <Image
              src="/assets/logo_big.svg"
              alt="LetsPlay logo"
              width={140}
              height={32}
              className="h-24 w-auto"
            />
          </Link>
        </CardHeader>
        <form onSubmit={handleSubmit} className="max-w-lg p-6">
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="mb-4">
              <Label htmlFor="email" className="mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm text-gray-400 mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-blue-600 hover:underline">
                Create one
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
