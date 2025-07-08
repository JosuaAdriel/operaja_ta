"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, User, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NegotiationSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
        <div className="w-full h-full bg-[#01563A] rounded-[32px] overflow-hidden relative">
          {/* Header */}
          <div className="px-6 pt-4">
            <Button variant="ghost" className="p-0 text-white hover:bg-white/10" onClick={() => router.push("/")}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </div>

          {/* Success Content */}
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-[#FF5601] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#FDF6D2] mb-4">
                Ajuan Donasi Terkirim!
              </h1>
              <p className="text-[#FDF6D2] text-sm leading-relaxed">
                Ajuan donasi Anda telah berhasil dikirim ke donatur. 
                Donatur akan meninjau ajuan Anda dan memberikan keputusan.
                Anda akan diberitahu ketika ada update status.
              </p>
            </div>

            <div className="w-full space-y-4">
              <Button
                onClick={() => router.push("/history")}
                className="w-full bg-[#FF5601] hover:bg-[#E64A00] text-[#FDF6D2] font-bold py-4 rounded-lg text-lg"
              >
                Lihat Status Pesanan
              </Button>
              
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full border-[#FDF6D2] text-[#FDF6D2] hover:bg-[#FDF6D2] hover:text-[#01563A] font-bold py-4 rounded-lg text-lg"
              >
                Kembali ke Beranda
              </Button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#01563A] border-t border-gray-200">
            <div className="flex items-center justify-around py-3">
              <Button variant="ghost" size="icon" className="h-auto py-2" onClick={() => router.push("/")}>
                <Home className="w-6 h-6 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon" className="h-auto py-2" onClick={() => router.push("/upload")}>
                <Upload className="w-6 h-6 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon" className="h-auto py-2" onClick={() => router.push("/history")}>
                <User className="w-6 h-6 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 