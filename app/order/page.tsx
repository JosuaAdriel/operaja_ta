"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ChevronDown, Upload, Home, User } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"

export default function OrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [totalDonasi, setTotalDonasi] = useState("")

  const [food, setFood] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [ordering, setOrdering] = useState(false)

  const orderId = searchParams?.get("orderId")
  const [order, setOrder] = useState<any>(null)

  // Fetch food data by ID
  useEffect(() => {
    const fetchFood = async () => {
      const foodId = searchParams?.get("id")
      if (!foodId) {
        setError("Food ID not found")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/food-items/${foodId}`)
        const result = await response.json()
        
        if (result.status === 'success') {
          setFood(result.data)
        } else {
          setError('Failed to fetch food item')
        }
      } catch (err) {
        setError('Error connecting to database')
        console.error('Error fetching food item:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFood()
  }, [searchParams])

  useEffect(() => {
    if (orderId) {
      // Fetch order detail jika orderId ada
      const fetchOrder = async () => {
        try {
          const res = await fetch(`/api/orders/${orderId}`)
          const data = await res.json()
          if (data.status === 'success') {
            setOrder(data.data)
            setTotalDonasi(data.data.order_amount)
          }
        } catch {}
      }
      fetchOrder()
    }
  }, [orderId])

  const handleCheckout = async () => {
    if (!totalDonasi || !user) return
    setOrdering(true)
    setOrderError(null)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food_item_id: food.id,
          user_id: user.id,
          pickup_time: food.availability, // or use a real value if available
          pickup_location: food.location_address, // or use a real value if available
          order_amount: parseFloat(totalDonasi)
        })
      })
      const data = await res.json()
      if (!res.ok) {
        setOrderError(data.error || 'Gagal membuat pesanan')
        setOrdering(false)
        return
      }
      
      // Check if this was a negotiation or direct order
      const isNegotiation = parseFloat(totalDonasi) < food.price_patungan
      
      if (isNegotiation) {
        // Redirect to negotiation success page
        router.push('/negotiation-success')
      } else {
        // Direct order success
        router.push(`/success?orderId=${data.data.id}`)
      }
    } catch (err) {
      setOrderError('Gagal membuat pesanan. Coba lagi.')
      setOrdering(false)
    }
  }

  const handleConfirmPayment = async () => {
    if (!orderId) return
    setOrdering(true)
    setOrderError(null)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'POST'
      })
      const data = await res.json()
      if (!res.ok) {
        setOrderError(data.error || 'Gagal konfirmasi pembayaran')
        setOrdering(false)
        return
      }
      router.push(`/success?orderId=${orderId}`)
    } catch (err) {
      setOrderError('Gagal konfirmasi pembayaran. Coba lagi.')
      setOrdering(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
          <div className="w-full h-full bg-[#01563A] rounded-[32px] overflow-hidden relative flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDF6D2] mx-auto mb-4"></div>
              <p className="text-[#FDF6D2] font-medium">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !food || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
          <div className="w-full h-full bg-[#01563A] rounded-[32px] overflow-hidden relative flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-[#FDF6D2] font-medium mb-4">
                {error || "Data tidak ditemukan."}
              </p>
              <Button 
                onClick={() => router.back()} 
                className="bg-[#FF5601] hover:bg-[#E64A00] text-[#FDF6D2]"
              >
                Kembali
              </Button>
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
          {/* Status Bar */}

          {/* Header */}
          <div className="px-6 pt-4">
            <Button variant="ghost" className="p-0 text-white hover:bg-white/10" onClick={() => router.back()}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </div>

          {/* User Avatars */}
          <div className="flex items-center justify-center gap-4 px-6 pt-6">
            {/* Provider Avatar (left) */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[#FF5601] overflow-hidden">
                <Image
                  src={food.provider_avatar || "/placeholder.svg"}
                  alt="Provider Avatar"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <ArrowLeft className="w-12 h-12 text-[#FDF6D2] rotate-180" />
            {/* User Avatar (right) */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[#FF5601] overflow-hidden">
                <Image
                  src={user.avatar || "/placeholder.svg"}
                  alt="Your Avatar"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Food Title */}
          <div className="text-center px-6 pt-4 text-[#FDF6D2]">
            <h1 className="text-xl font-bold">{food.name}</h1>
            <p className="text-sm">Diambil Pada Pukul {food.availability}</p>
            <p className="text-sm">Di {food.location_address}, hanya berjarak {food.distance} dari lokasi anda.</p>
          </div>

          {/* Divider */}
          <div className="w-200 h-px bg-[#FDF6D2] mt-6 mx-3"></div>

          {/* Payment Info (Provider's Account) */}
          <div className="px-6 pt-6 text-[#FDF6D2]">
            <h3 className="text-sm font-medium">Informasi Rekening Pembayaran</h3>
            <div className="border-[#FDF6D2] border rounded-xl border-2 p-2 flex flex-col gap-1">
              <span className="text-[#FDF6D2] font-medium">{food.provider_bank_name || "-"}</span>
              <span className="text-[#FDF6D2] font-medium">{food.provider_account_number || "-"}</span>
              <span className="text-[#FDF6D2] font-medium">a.n. {food.provider_name || "-"}</span>
            </div>
          </div>

          {/* Donation Request / Harga Jualan */}
          <div className="px-6 pt-4">
            <p className="text-[#FDF6D2] text-xs">
              {food.type === 'jualan' ? (
                <>Harga: <span className="font-bold">Rp{food.price_patungan}</span></>
              ) : (
                <>Permintaan Donasi: Rp{food.price_patungan}</>
              )}
            </p>
          </div>

          {/* Total Donasi Input atau Tombol Bayar */}
          {orderId && order ? (
            <div className="px-6 mt-6">
              <div className="bg-[#FDF6D2] text-[#01563A] rounded-lg py-1 px-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">Nominal Donasi</h3>
                <div className="flex items-center">
                  <span className="text-[#01563A] mr-1">Rp</span>
                  <span className="text-right text-[#01563A] font-bold">{order.order_amount?.toLocaleString()}</span>
                </div>
              </div>
              <Button
                className="w-full mt-6 bg-[#FF5601] hover:bg-[#E64A00] text-[#FDF6D2] font-bold py-4 rounded-lg text-lg"
                onClick={handleConfirmPayment}
                disabled={ordering}
              >
                {ordering ? 'Memproses...' : 'Bayar'}
              </Button>
              {orderError && <div className="text-red-500 text-xs mt-2">{orderError}</div>}
            </div>
          ) : (
            food.type === 'jualan' ? (
              <div className="px-6">
                <div className="bg-[#FDF6D2] text-[#01563A] rounded-lg py-1 px-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Harga</h3>
                  <div className="flex items-center">
                    <span className="text-[#01563A] mr-1">Rp</span>
                    <span className="text-right text-[#01563A] font-bold">{food.price_patungan}</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-[#FF5601] hover:bg-[#E64A00] text-[#FDF6D2] font-bold py-4 rounded-lg text-lg"
                  onClick={() => { setTotalDonasi(food.price_patungan); handleCheckout(); }}
                  disabled={ordering}
                >
                  {ordering ? 'Memproses...' : 'Beli Sekarang'}
                </Button>
                {orderError && <div className="text-red-500 text-xs mt-2">{orderError}</div>}
              </div>
            ) : (
              <div className="px-6">
                <div className="bg-[#FDF6D2] text-[#01563A] rounded-lg py-1 px-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Nominal Donasi</h3>
                  <div className="flex items-center">
                    <span className="text-[#01563A] mr-1">Rp</span>
                    <Input
                      type="number"
                      min={0}
                      value={totalDonasi}
                      onChange={e => setTotalDonasi(e.target.value)}
                      className="w-24 bg-transparent border-0 text-right text-[#01563A] focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-[#FF5601] hover:bg-[#E64A00] text-[#FDF6D2] font-bold py-4 rounded-lg text-lg"
                  onClick={handleCheckout}
                  disabled={ordering}
                >
                  {ordering ? 'Memproses...' : 'Pesan'}
                </Button>
                {orderError && <div className="text-red-500 text-xs mt-2">{orderError}</div>}
              </div>
            )
          )}

          {/* Terms */}
          <div className="px-6 pt-4">
            <p className="text-[#FDF6D2] text-xs text-center">
              Dengan bertransaksi disini, Anda telah menyetujui syarat dan ketentuan yang berlaku.
            </p>
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
