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

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signup, login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)
    
    try {
      const result = await signup(formData.email, formData.password)
      
      if (result.success) {
        sessionStorage.setItem('tempUserId', String(result.userId))
        // Auto-login after signup
        const loginResult = await login(formData.email, formData.password)
        if (loginResult.success) {
          router.push("/more-info")
        } else {
          setError("Signup succeeded but auto-login failed. Please login manually.")
          router.push("/login")
        }
      } else {
        setError(result.error || "Signup failed")
      }
    } catch (err) {
      setError("An error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
        <div className="w-full h-full bg-[#FDF6D2] rounded-[32px] overflow-hidden relative">
          {/* Content */}
          <div className="px-8 py-12 h-full flex flex-col">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image src="/operaja-logo-green-wo-tag.png" alt="OperAja" width={240} height={120} className="h-50 w-auto" />
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-black text-[#A30100] leading-tight">
                MAKE THE
                <br />
                FIRST MOVE
              </h1>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="space-y-6 flex-1">
                {/* Email Field */}
                <div className="relative">
                  <div className="flex items-center border-b-2 border-[#01563A] pb-2">
                    <Mail className="w-5 h-5 text-[#01563A] mr-3" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-0 bg-transparent text-[#01563A] placeholder:text-[#01563A]/60 focus:ring-0 focus:outline-none p-0"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative">
                  <div className="flex items-center border-b-2 border-[#01563A] pb-2">
                    <Lock className="w-5 h-5 text-[#01563A] mr-3" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="border-0 bg-transparent text-[#01563A] placeholder:text-[#01563A]/60 focus:ring-0 focus:outline-none p-0 flex-1"
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-[#01563A]" />
                      ) : (
                        <Eye className="w-5 h-5 text-[#01563A]" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <div className="flex items-center border-b-2 border-[#01563A] pb-2">
                    <Lock className="w-5 h-5 text-[#01563A] mr-3" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Konfirmasi Password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="border-0 bg-transparent text-[#01563A] placeholder:text-[#01563A]/60 focus:ring-0 focus:outline-none p-0 flex-1"
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-[#01563A]" />
                      ) : (
                        <Eye className="w-5 h-5 text-[#01563A]" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-12 mb-4">
                <Button
                  type="submit"
                  className="w-full bg-[#01563A] hover:bg-[#01563A]/90 text-white font-bold py-4 rounded-lg text-lg"
                  disabled={loading}
                >
                  {loading ? "SIGNING UP..." : "SIGN UP"}
                </Button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-[#01563A] text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#A30100] font-semibold underline">
                    Login
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
