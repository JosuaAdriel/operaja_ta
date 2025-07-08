"use client"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Upload, Home, User } from "lucide-react"
import { useEffect, useState } from "react"

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderData, setOrderData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderData = async () => {
      const orderId = searchParams?.get('orderId')
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/orders/${orderId}`)
        const data = await res.json()
        if (data.status === "success") {
          setOrderData(data.data)
          
          // Fetch user data to get total savings and waste saved
          const userRes = await fetch('/api/auth/me')
          const userData = await userRes.json()
          if (userData.status === 'success') {
            setUserData(userData.user)
          }
        }
      } catch (error) {
        console.error('Error fetching order data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [searchParams])

  // Calculate savings and waste prevention
  const savings = orderData ? (parseFloat(orderData.order_amount) * 2) : 0
  const wastePrevention = orderData?.food_weight || 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
          <div className="w-full h-full bg-[#01563A] rounded-[32px] overflow-hidden relative flex items-center justify-center">
            <div className="text-center text-[#FDF6D2]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDF6D2] mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
        <div className="w-full h-full bg-[#01563A] rounded-[32px] overflow-hidden relative">
          {/* Main scrollable content area */}
          <div className="h-full pb-16 overflow-y-auto">
            {/* Success Title */}
            <div className="text-center px-6 pt-12">
              <h1 className="text-[#FDF6D2] text-3xl font-bold">Berhasil Berbagi!</h1>
            </div>

            {/* User Avatars with Handshake */}
            <div className="flex items-center justify-center gap-4 px-6 pt-2">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[#FF5601] overflow-hidden">
                  <Image
                    src={orderData?.customer_avatar || "/placeholder.svg?height=80&width=80"}
                    alt="Your Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image src="/handshake-icon.png" alt="Handshake" width={80} height={80} />
              </div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[#FF5601] overflow-hidden">
                  <Image
                    src={orderData?.provider_avatar || "/placeholder.svg?height=80&width=80"}
                    alt="Provider Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Contribution Stats */}
            <div className="px-6 pt-6">
              <h2 className="text-[#FDF6D2] text-xl font-bold text-center mb-2">Kontribusi Anda</h2>
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center text-center">
                  <div className="justify-center mb-2">
                    <Image src="/dollar-icon.png" alt="Money" className="w-10 h-10" width={40} height={40} />
                  </div>
                  <div className="text-[#FDF6D2] pl-2">
                    <div className="text-lg">Menghemat</div>
                    <div className="text-2xl font-bold">{savings.toLocaleString()}</div>
                    <div className="text-lg">Rupiah</div>
                  </div>
                </div>
                <div className="w-px h-16 bg-[#FDF6D2]"></div>
                <div className=" flex items-center text-center">
                  <div className="justify-center mb-2">
                    <Image src="/trash-icon.png" alt="Waste" className="w-10 h-10" width={40} height={40} />
                  </div>
                  <div className="text-[#FDF6D2] pl-2">
                    <div className="text-lg">Mencegah</div>
                    <div className="text-2xl font-bold">{wastePrevention}</div>
                    <div className="text-lg">Gram</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-100 h-px bg-[#FDF6D2] mt-4 mx-4"></div>

            {/* Tips Section */}
            <div className="text-[#FDF6D2] px-6 pt-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold">Untuk setiap pesanan,</h3>
                <h3 className="text-lg font-bold">jangan lupa selalu</h3>
              </div>

              <div className="flex flex-col items-center space-y-4 max-w-xs mx-auto">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <Image src="/eye-icon.png" alt="Eye" width={32} height={32} className="w-8 h-8 object-contain" />
                  </div>
                  <span className=" font-medium">Lihat tampilannya</span>
                </div>
                <div className="flex items-center gap-4 pr-2">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <Image src="/bell-icon.png" alt="Smell" width={32} height={32} className="w-8 h-8 object-contain" />
                  </div>
                  <span className="font-medium">Kenali Aromanya</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/shield-icon.png"
                      alt="Taste"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="font-medium">Bedakan Rasanya</span>
                </div>
              </div>
            </div>

            {/* Bottom Message */}
            <div className="px-6 pt-6 text-[#FDF6D2]">
              <p className="text-center text-sm">
                <span className="font-bold">agar makan tenang</span>
                <br />
                <span className="font-bold">dan perut kenyang~</span>
              </p>
              <p className="text-xs text-center mt-4">
                Terima kasih telah menjadi pejuawan makanan hari ini!
                <br />
                Setiap makanan yang tersalmatkan menjadikan bumi yang lebih baik.
              </p>
            </div>

            {/* Transaction History Button */}
            <div className="px-6 pt-6 pb-8">
              <Button
                onClick={() => router.push("/history")}
                className="w-full bg-[#FF5601] hover:bg-[#E64A00] text-white font-bold py-4 rounded-lg text-lg"
              >
                Lihat Riwayat Transaksi
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
