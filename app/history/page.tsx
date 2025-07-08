"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Star, Trash2, DollarSign, Home, Upload, User, LogOut } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "food">("orders")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading, logout, isBusinessDonor } = useAuth()
  const [myFoods, setMyFoods] = useState<any[]>([])
  const [myFoodsLoading, setMyFoodsLoading] = useState(false)
  const [myFoodsError, setMyFoodsError] = useState<string | null>(null)
  const [myOrders, setMyOrders] = useState<any[]>([])
  const [myOrdersLoading, setMyOrdersLoading] = useState(false)
  const [myOrdersError, setMyOrdersError] = useState<string | null>(null)

  // Check for tab parameter from URL
  useEffect(() => {
    const tab = searchParams?.get("tab")
    if (tab === "food") {
      setActiveTab("food")
    }
  }, [searchParams])

  // Fetch my uploaded foods when tab is 'food' and user is available
  useEffect(() => {
    if (activeTab === 'food' && user) {
      setMyFoodsLoading(true)
      setMyFoodsError(null)
      fetch(`/api/food-items/mine?provider_id=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') setMyFoods(data.data)
          else setMyFoodsError('Gagal mengambil data makanan')
        })
        .catch(() => setMyFoodsError('Gagal mengambil data makanan'))
        .finally(() => setMyFoodsLoading(false))
    }
  }, [activeTab, user])

  // Fetch my orders when tab is 'orders' and user is available
  useEffect(() => {
    if (activeTab === 'orders' && user) {
      setMyOrdersLoading(true)
      setMyOrdersError(null)
      fetch(`/api/orders/my-orders?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') setMyOrders(data.data)
          else setMyOrdersError('Gagal mengambil data pesanan')
        })
        .catch(() => setMyOrdersError('Gagal mengambil data pesanan'))
        .finally(() => setMyOrdersLoading(false))
    }
  }, [activeTab, user])

  // Use total waste saved from user data instead of calculating from food items
  const totalWeight = user?.totalWasteSaved || 0

  // Use total savings from user data instead of calculating from orders
  const totalSavings = user?.totalSavings || 0

  const currentData = activeTab === "orders" ? myOrders : myFoods

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
        <div className="w-full h-full bg-[#FDF6D2] rounded-[32px] overflow-hidden relative flex flex-col">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex-shrink-0 mt-6">

            {/* User Profile (dynamic) */}
            {user && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-[#01563A]">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-[#01563A] text-white">
                      {user.name?.[0] || user.email[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-lg font-bold text-[#01563A]">{user.name}</h1>
                    <p className="text-sm text-[#01563A] opacity-80">
                      {isBusinessDonor ? "Donatur Bisnis" : "Donatur Umum"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 h-8 px-2 text-red-600 font-semibold"
                  onClick={handleLogout}
                >
                  Logout
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Tabs */}
            <div className="flex bg-white rounded-lg p-1">
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                className={`flex-1 text-sm ${
                  activeTab === "orders"
                    ? "bg-[#FF5601] text-white hover:bg-[#E64A00]"
                    : "text-[#01563A] hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                Pesanan Saya
              </Button>
              <Button
                variant={activeTab === "food" ? "default" : "ghost"}
                className={`flex-1 text-sm ${
                  activeTab === "food"
                    ? "bg-[#FF5601] text-white hover:bg-[#E64A00]"
                    : "text-[#01563A] hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("food")}
              >
                Makanan Saya
              </Button>
            </div>
          </div>

          {/* Content - Updated structure here */}
          <div className="flex-1 px-6 pb-20 overflow-y-auto">
            {/* Tombol Daftar Donatur Bisnis */}
            {activeTab === 'food' && user && !isBusinessDonor && (
              <div className="mb-4">
                <Button 
                  className="w-full bg-[#01563A] text-[#FDF6D2] font-bold" 
                  onClick={() => router.push('/business-register')}
                >
                  Daftar Donatur Berjualan
                </Button>
              </div>
            )}
            {/* Transaction List */}
            {activeTab === 'food' && myFoodsLoading && (
              <div className="text-center text-[#01563A] py-8">Loading...</div>
            )}
            {activeTab === 'food' && myFoodsError && (
              <div className="text-center text-red-500 py-8">{myFoodsError}</div>
            )}
            {activeTab === 'food' && !myFoodsLoading && !myFoodsError && myFoods.length === 0 && (
              <div className="text-center text-[#01563A] py-8">Belum ada makanan yang kamu upload.</div>
            )}
            {activeTab === 'food' && myFoods.map((item) => (
              <Link key={item.id} href={`/food-detail/${item.id}`}>
                <Card
                  className={`p-4 border-0 ${
                    item.status === "ordered" ? "bg-[#01563A]" : 
                    item.has_pending_negotiations ? "bg-yellow-500" : "bg-[#FF5601]"
                  } text-white mb-3 cursor-pointer`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm opacity-90">ID: {item.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === "ordered" ? "bg-[#01563A]" : 
                        item.has_pending_negotiations ? "bg-yellow-600" : "bg-[#FF5601]"
                      }`}></div>
                      <span className="text-xs">
                        {item.status === "ordered" ? "Sudah Dipesan" : 
                         item.has_pending_negotiations ? "Perlu Tindak Lanjut" : "Tersedia"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm opacity-90">Ajuan Donasi</p>
                      <p className="font-bold text-lg">{item.price_patungan ? `Rp${item.price_patungan}` : '-'}</p>
                    </div>
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarImage src={item.image_url || "/placeholder.svg"} />
                      <AvatarFallback>{item.name?.charAt(0) || 'M'}</AvatarFallback>
                    </Avatar>
                  </div>
                </Card>
              </Link>
            ))}
            {activeTab === 'orders' && myOrdersLoading && (
              <div className="text-center text-[#01563A] py-8">Loading...</div>
            )}
            {activeTab === 'orders' && myOrdersError && (
              <div className="text-center text-red-500 py-8">{myOrdersError}</div>
            )}
            {activeTab === 'orders' && !myOrdersLoading && !myOrdersError && myOrders.length === 0 && (
              <div className="text-center text-[#01563A] py-8">Belum ada pesanan yang kamu buat.</div>
            )}
            {activeTab === 'orders' && myOrders.map((item) => (
              <Card
                key={item.id}
                className={`p-4 border-0 mb-3 cursor-pointer ${
                  item.status === "confirmed" ? "bg-[#01563A]" : 
                  item.status === "pending" ? "bg-[#FF5601]" : 
                  item.status === "cancelled" ? "bg-[#A30100]" : 
                  item.status === "completed" ? "bg-[#01563A]" : "bg-gray-500"
                } text-white`}
                onClick={() => router.push(`/order-detail/${item.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.food_name}</h3>
                    <p className="text-sm opacity-90">Order ID: {item.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === "confirmed" ? "bg-[#01563A]" : 
                      item.status === "pending" ? "bg-[#FF5601]" : 
                      item.status === "cancelled" ? "bg-[#A30100]" : "bg-gray-400"
                    }`}></div>
                    <span className="text-xs">
                      {item.status === "confirmed" ? "Pesanan Diproses" : 
                       item.status === "pending" ? "Menunggu Persetujuan" : 
                       item.status === "cancelled" ? "Pesanan Ditolak" : 
                       item.status === "approved" ? "Ajuan Disetujui" : 
                       item.status === "completed" ? "Pesanan Selesai" : item.status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Ajuan Donasi</p>
                    <p className="font-bold text-lg">Rp{item.order_amount?.toLocaleString() || 0}</p>
                    <p className="text-xs opacity-90">Min: Rp{item.price_patungan?.toLocaleString() || 0}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarImage src={item.provider_avatar || "/placeholder.svg"} />
                      <AvatarFallback>{item.provider_name?.charAt(0) || 'P'}</AvatarFallback>
                    </Avatar>
                    <div className="text-xl">→</div>
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{item.customer_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </Card>
            ))}

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-white border border-[#01563A]">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-[#01563A] mb-2">
                    {activeTab === "orders" ? "Total\nPenghematan" : "Rating\nProfil Saya"}
                  </h3>
                  {activeTab === "orders" ? (
                    <>
                      <DollarSign className="w-8 h-8 text-[#01563A] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-[#01563A]">{totalSavings.toLocaleString()}</p>
                      <p className="text-xs text-[#01563A]">Rupiah</p>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-current text-[#01563A]" />
                        ))}
                      </div>
                      <p className="text-2xl font-bold text-[#01563A]">{user?.rating ? `${user.rating}/5` : '-'}</p>
                    </>
                  )}
                </div>
              </Card>

              <Card className="p-4 bg-white border border-[#01563A]">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-[#01563A] mb-2">
                    Total
                    <br />
                    Sampah Berkurang
                  </h3>
                  <Trash2 className="w-8 h-8 text-[#01563A] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#01563A]">{totalWeight}</p>
                  <p className="text-xs text-[#01563A]">Gram</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#FDF6D2] border-t border-gray-200">
            <div className="flex items-center justify-around py-3">
              <Button variant="ghost" size="icon" className="h-auto py-2" onClick={() => router.push("/")}>
                <Home className="w-6 h-6 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon" className="h-auto py-2" onClick={() => router.push("/upload")}>
                <Upload className="w-6 h-6 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon" className="h-auto py-2" onClick={() => router.push("/history")}>
                <User className="w-6 h-6 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
