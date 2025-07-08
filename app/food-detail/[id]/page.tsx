"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"

export default function FoodDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [food, setFood] = useState<any>(null)
  const [negotiations, setNegotiations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingAction, setProcessingAction] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.id) return
      setLoading(true)
      setError(null)
      try {
        // Fetch food data
        const foodRes = await fetch(`/api/food-items/${params.id}`)
        const foodData = await foodRes.json()
        if (foodData.status === "success") {
          setFood(foodData.data)
          
          // Check if current user is the provider and fetch negotiations
          if (user && foodData.data.provider_id === user.id) {
            const negotiationsRes = await fetch(`/api/orders/negotiations?food_item_id=${params.id}`)
            const negotiationsData = await negotiationsRes.json()
            if (negotiationsData.status === "success") {
              setNegotiations(negotiationsData.data)
            }
          }
        } else {
          setError("Makanan tidak ditemukan")
        }
      } catch {
        setError("Gagal mengambil data makanan")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params?.id, user])

  const handleApprove = async (orderId: number) => {
    if (!params?.id) return
    setProcessingAction(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}/approve`, {
        method: 'PUT'
      })
      const data = await res.json()
      if (res.ok) {
        // Refresh negotiations list
        const negotiationsRes = await fetch(`/api/orders/negotiations?food_item_id=${params.id}`)
        const negotiationsData = await negotiationsRes.json()
        if (negotiationsData.status === "success") {
          setNegotiations(negotiationsData.data)
        }
        // Refresh food data to update status
        const foodRes = await fetch(`/api/food-items/${params.id}`)
        const foodData = await foodRes.json()
        if (foodData.status === "success") {
          setFood(foodData.data)
        }
      }
    } catch (error) {
      console.error('Error approving negotiation:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  const handleReject = async (orderId: number) => {
    if (!params?.id) return
    setProcessingAction(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}/reject`, {
        method: 'PUT'
      })
      const data = await res.json()
      if (res.ok) {
        // Refresh negotiations list
        const negotiationsRes = await fetch(`/api/orders/negotiations?food_item_id=${params.id}`)
        const negotiationsData = await negotiationsRes.json()
        if (negotiationsData.status === "success") {
          setNegotiations(negotiationsData.data)
        }
      }
    } catch (error) {
      console.error('Error rejecting negotiation:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
        <div className="w-full h-full bg-[#FDF6D2] rounded-[32px] overflow-hidden relative flex flex-col items-center justify-center">
          <div className="text-center text-[#01563A] text-lg font-bold">Loading...</div>
        </div>
      </div>
    </div>
  )
  if (error || !food) return <div className="text-center p-8 text-[#A30100]">{error || "Data tidak ditemukan"}</div>

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
        <div className="w-full h-full bg-[#FDF6D2] rounded-[32px] overflow-hidden relative flex flex-col">
          <div className="px-6 pt-6 pb-4 flex-shrink-0">
            <Button variant="ghost" className="p-0 text-[#01563A] hover:bg-white/10 mb-4" onClick={() => router.back()}>
              &lt; Kembali
            </Button>
            <h2 className="text-xl font-bold text-[#01563A] text-center mb-1">{food.name}</h2>
            <p className="text-center text-xs text-[#01563A]/80 mb-4">ID Makanan: {food.id}</p>
            <Card className={`${food.status === 'ordered' ? 'bg-[#01563A]' : 'bg-[#FF5601]'} rounded-xl p-4 mb-6`}>
              <div className="flex items-center gap-3 mb-2">
                <Image src={food.image_url || "/placeholder.svg"} alt={food.name} width={48} height={48} className="rounded-full w-12 h-12 object-cover" />
                <div>
                  <div className="font-bold text-white">{food.name}</div>
                  <div className="text-white text-sm">Rp{food.price_patungan || '-'}</div>
                </div>
                <div className="ml-auto text-white text-xs">{food.status === 'ordered' ? 'Sudah Dipesan' : 'Tersedia'}</div>
              </div>
              <div className="text-white text-xs mb-1">
                <div className="mb-1">
                  <span className="font-bold">Lokasi Pengambilan</span><br />
                  {food.location_address}<br />
                  {food.location_details}
                </div>
                <div className="mb-1">
                  <span className="font-bold">Waktu Pengambilan</span><br />
                  {food.availability}
                </div>
              </div>
            </Card>
            {user && food.provider_id === user.id && negotiations.length > 0 && (
              <>
                <div className="mb-2 text-[#01563A] font-bold">Ajuan Donasi</div>
                <div className="space-y-3">
                  {negotiations.map((negotiation) => {
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
                        case 'confirmed': return 'Disetujui'
                        case 'completed': return 'Selesai'
                        case 'cancelled': return 'Ditolak'
                        default: return status
                      }
                    }

                    return (
                      <Card key={negotiation.id} className={`${getStatusColor(negotiation.status)} rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-2`}>
                        <div className="flex items-center gap-3">
                          <Image 
                            src={negotiation.user_avatar || "/placeholder.svg"} 
                            alt={negotiation.user_name} 
                            width={40} 
                            height={40} 
                            className="rounded-full w-10 h-10 object-cover" 
                          />
                          <div>
                            <div className="font-bold text-white">{negotiation.user_name}</div>
                            <div className="flex items-center gap-1 text-white text-xs">
                              <span>★</span> {negotiation.user_rating || 0} / 5
                            </div>
                          </div>
                        </div>
                        <div className="ml-auto flex flex-col items-end">
                          <div className="text-white text-xs mb-1">Ajuan Donasi</div>
                          <div className="text-white font-bold text-lg mb-2">Rp{negotiation.order_amount?.toLocaleString() || 0}</div>
                          <div className="text-white text-xs mb-2">{getStatusText(negotiation.status)}</div>
                          {negotiation.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                className="bg-white text-[#01563A] font-bold"
                                onClick={() => handleApprove(negotiation.id)}
                                disabled={processingAction === negotiation.id}
                              >
                                {processingAction === negotiation.id ? 'Memproses...' : 'Setuju'}
                              </Button>
                              <Button 
                                className="bg-red-600 text-white font-bold"
                                onClick={() => handleReject(negotiation.id)}
                                disabled={processingAction === negotiation.id}
                              >
                                {processingAction === negotiation.id ? 'Memproses...' : 'Tolak'}
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </>
            )}
            
            {user && food.provider_id === user.id && negotiations.length === 0 && (
              <div className="text-center text-[#01563A] text-sm py-4">
                Belum ada ajuan donasi untuk makanan ini.
              </div>
            )}
          </div>
          {/* Tombol Order untuk user (bukan provider) */}
          {user && food.provider_id !== user.id && food.status !== 'ordered' && (
            food.type === 'jualan' ? (
              <div className="px-6 pb-4">
                <Button
                  className="w-full bg-[#FF5601] hover:bg-[#E64A00] text-[#FDF6D2] font-bold py-4 rounded-lg text-lg"
                  onClick={() => router.push(`/order?id=${food.id}`)}
                >
                  Beli Sekarang
                </Button>
              </div>
            ) : (
              <div className="px-6 pb-4">
                <Button
                  className="w-full bg-[#FF5601] hover:bg-[#E64A00] text-[#FDF6D2] font-bold py-4 rounded-lg text-lg"
                  onClick={() => router.push(`/order?id=${food.id}`)}
                >
                  Ajukan Donasi
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
} 