"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        router.push("/")
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
        <div className="w-full h-full bg-gradient-to-b from-[#A30100] to-[#8B0000] rounded-[32px] overflow-hidden relative">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-6 pt-4 text-white text-sm">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-white rounded-full"></div>
                <div className="w-1 h-3 bg-white rounded-full"></div>
                <div className="w-1 h-3 bg-white rounded-full"></div>
                <div className="w-1 h-3 bg-white/50 rounded-full"></div>
              </div>
              <div className="ml-2 w-6 h-3 border border-white rounded-sm">
                <div className="w-4 h-2 bg-white rounded-sm m-0.5"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-12 h-full flex flex-col">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="p-4">
                <Image src="/operaja-logo-cream-wo-tag (1).png" alt="OperAja" width={240} height={120} className="h-50 w-auto" />
              </div>
            </div>

            {/* Title */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-[#FDF6D2]">Login</h1>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-pink-100 border border-pink-400 text-pink-700 rounded-lg text-sm shadow-sm flex items-center gap-2 animate-fade-in">
                <svg className="w-5 h-5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="space-y-8 text-[#FDF6D2]">
                {/* Email Field */}
                <div className="relative">
                  <div className="flex items-center border-b-2 border-[#FDF6D2] pb-2">
                    <Mail className="w-5 h-5 mr-3" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-0 bg-transparent text-white placeholder:text-[#FDF6D2]/70 focus:ring-0 focus:outline-none p-0"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative">
                  <div className="flex items-center border-b-2 border-[#FDF6D2] pb-2">
                    <Lock className="w-5 h-5 text-[#FDF6D2] mr-3" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="border-0 bg-transparent text-white placeholder:text-white/70 focus:ring-0 focus:outline-none p-0 flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-white" />
                      ) : (
                        <Eye className="w-5 h-5 text-white" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-16 mb-4">
                <Button
                  type="submit"
                  className="w-full bg-[#FF5601] hover:bg-[#E64A00] text-white font-bold py-4 rounded-lg text-lg"
                >
                  LOGIN
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-white text-sm">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-[#FF5601] font-semibold underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
