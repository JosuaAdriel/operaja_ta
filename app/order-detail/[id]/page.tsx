"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingAction, setProcessingAction] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.id) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/orders/${params.id}`)
        const data = await res.json()
        if (data.status === "success") {
          setOrder(data.data)
        } else {
          setError("Pesanan tidak ditemukan")
        }
      } catch {
        setError("Gagal mengambil data pesanan")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params?.id])

  const handleCompleteOrder = async () => {
    if (!params?.id) return
    setProcessingAction(true)
    try {
      const res = await fetch(`/api/orders/${params.id}/complete`, {
        method: 'PUT'
      })
      const data = await res.json()
      if (res.ok) {
        // Refresh order data
        const orderRes = await fetch(`/api/orders/${params.id}`)
        const orderData = await orderRes.json()
        if (orderData.status === "success") {
          setOrder(orderData.data)
        }
      } else {
        setError(data.error || 'Gagal menyelesaikan pesanan')
      }
    } catch (error) {
      console.error('Error completing order:', error)
      setError('Gagal menyelesaikan pesanan')
    } finally {
      setProcessingAction(false)
    }
  }

  if (loading) return <div className="text-center p-8">Loading...</div>
  if (error || !order) return <div className="text-center p-8 text-[#A30100]">{error || "Data tidak ditemukan"}</div>

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-[#FF5601]'
      case 'confirmed': return 'bg-[#01563A]'
      case 'completed': return 'bg-[#01563A]'
      case 'cancelled': return 'bg-[#A30100]'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Persetujuan'
      case 'approved': return 'Menunggu Pembayaran'
      case 'confirmed': return 'Diterima'
      case 'completed': return 'Selesai'
      case 'cancelled': return 'Ditolak'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
        <div className="w-full h-full bg-[#FDF6D2] rounded-[32px] overflow-hidden relative flex flex-col">
          <div className="px-6 pt-6 pb-4 flex-shrink-0">
            <Button variant="ghost" className="p-0 text-[#01563A] hover:bg-white/10 mb-4" onClick={() => router.back()}>
              &lt; Kembali
            </Button>
            <h2 className="text-xl font-bold text-[#01563A] text-center mb-1">Detail Pesanan</h2>
            <p className="text-center text-xs text-[#01563A]/80 mb-4">Order ID: {order.id}</p>
            
            {/* Order Status Card */}
            <Card className={`${getStatusColor(order.status)} rounded-xl p-4 mb-6`}>
              <div className="flex items-center gap-3 mb-2">
                <Image src={order.food_image || "/placeholder.svg"} alt={order.food_name} width={48} height={48} className="rounded-full w-12 h-12 object-cover" />
                <div>
                  <div className="font-bold text-white">{order.food_name}</div>
                  <div className="text-white text-sm">Rp{order.order_amount?.toLocaleString() || 0}</div>
                </div>
                <div className="ml-auto text-white text-xs">{getStatusText(order.status)}</div>
              </div>
              <div className="text-white text-xs mb-1">
                <div className="mb-1">
                  <span className="font-bold">Lokasi Pengambilan</span><br />
                  {order.location_address}<br />
                  {order.location_details}
                </div>
                <div className="mb-1">
                  <span className="font-bold">Waktu Pengambilan</span><br />
                  {order.availability}
                </div>
              </div>
            </Card>

            {/* Provider Info */}
            <div className="mb-4">
              <h3 className="text-[#01563A] font-bold mb-2">Informasi Donatur</h3>
              <Card className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Image 
                    src={order.provider_avatar || "/placeholder.svg"} 
                    alt={order.provider_name} 
                    width={40} 
                    height={40} 
                    className="rounded-full w-10 h-10 object-cover" 
                  />
                  <div>
                    <div className="font-bold text-[#01563A]">{order.provider_name}</div>
                    <div className="flex items-center gap-1 text-[#01563A] text-xs">
                      <span>★</span> {order.provider_rating || 0} / 5
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Complete Order Button - Only show for confirmed orders */}
            {order.status === 'confirmed' && (
              <div className="mt-4">
                <Button 
                  className="w-full bg-[#01563A] hover:bg-[#014a30] text-white font-bold"
                  onClick={handleCompleteOrder}
                  disabled={processingAction}
                >
                  {processingAction ? 'Memproses...' : 'Pesanan Diterima'}
                </Button>
              </div>
            )}

            {/* Order completed message */}
            {order.status === 'completed' && (
              <div className="mt-4">
                <Card className="bg-[#01563A] rounded-xl p-4">
                  <div className="text-center text-white">
                    <div className="font-bold">Pesanan Selesai!</div>
                    <div className="text-sm">Terima kasih telah menggunakan layanan kami.</div>
                  </div>
                </Card>
              </div>
            )}

            {/* Bayar Makanan Button - Only show for consumer, status approved */}
            {order.status === 'approved' && user && user.id === order.user_id && (
              <div className="mt-4">
                <Button 
                  className="w-full bg-[#FF5601] hover:bg-[#E64A00] text-white font-bold"
                  onClick={() => router.push(`/order?id=${order.food_item_id}&orderId=${order.id}`)}
                >
                  Bayar Makanan
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 