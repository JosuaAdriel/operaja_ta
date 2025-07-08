"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { ChevronDown, SlidersHorizontal, MapPin, Star, Upload, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Home } from "lucide-react"
import "../app/card-styles.css"
import { useAuth } from "@/contexts/AuthContext"

interface FoodItem {
  id: number
  name: string
  price: string
  rating: number
  distance: string
  availability: string
  image_url: string
  location_address: string
  location_details: string
  provider_name: string
  provider_rating: number
  provider_reviews: number
  provider_avatar: string
  description_title: string
  description_content: string
  price_patungan: string
  created_at: string
  updated_at: string
  type: 'jualan' | 'donasi'
}

interface DragState {
  isDragging: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
  startTime: number
}

const AREA_OPTIONS = [
  { value: 'Dago', label: 'Dago' },
  { value: 'Sudirman', label: 'Sudirman' },
  { value: 'Thamrin', label: 'Thamrin' },
  { value: 'Gatot Subroto', label: 'Gatot Subroto' },
  { value: 'Hayam Wuruk', label: 'Hayam Wuruk' },
  { value: 'Rasuna Said', label: 'Rasuna Said' },
];

// Helper function to validate URL
const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || url === "/placeholder.svg") return true;
  
  // Handle relative paths (start with /)
  if (url.startsWith('/')) return true;
  
  // Handle absolute URLs
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to get safe image URL
const getSafeImageUrl = (url: string | null | undefined): string => {
  if (!url || !isValidImageUrl(url)) {
    return "/placeholder.svg";
  }
  
  // If it's a relative path, return as is (Next.js will handle it)
  if (url.startsWith('/')) {
    return url;
  }
  
  return url;
};

export default function HomePage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [selectedArea, setSelectedArea] = useState('Dago')
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startTime: 0,
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, loading: authLoading, logout } = useAuth()

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Fetch food items from database
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/food-items')
        const result = await response.json()
        
        if (result.status === 'success') {
          setFoodItems(result.data)
        } else {
          setError('Failed to fetch food items')
        }
      } catch (err) {
        setError('Error connecting to database')
        console.error('Error fetching food items:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchFoodItems()
    }
  }, [user])
  
  const filteredFoodItems = selectedArea
    ? foodItems.filter(item => item.location_address === selectedArea)
    : foodItems;

  const currentCard = filteredFoodItems[currentCardIndex]
  const nextCard = filteredFoodItems[(currentCardIndex + 1) % filteredFoodItems.length]

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      if (isAnimating) return

      setDragState({
        isDragging: true,
        startX: clientX,
        startY: clientY,
        currentX: 0,
        currentY: 0,
        startTime: Date.now(),
      })
    },
    [isAnimating],
  )

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragState.isDragging || isAnimating) return

      const deltaX = clientX - dragState.startX
      const deltaY = clientY - dragState.startY

      setDragState((prev) => ({
        ...prev,
        currentX: deltaX,
        currentY: deltaY,
      }))
    },
    [dragState.isDragging, dragState.startX, dragState.startY, isAnimating],
  )

  const handleEnd = useCallback(() => {
    if (!dragState.isDragging || isAnimating) return

    const threshold = 80
    const velocity = (Math.abs(dragState.currentX) / (Date.now() - dragState.startTime)) * 1000
    const distance = Math.abs(dragState.currentX)

    if (distance > threshold || velocity > 300) {
      // Swipe detected - animate card off screen with physics
      setIsAnimating(true)
      const direction = dragState.currentX > 0 ? 1 : -1
      const finalX = direction * (window.innerWidth + 100)
      const finalY = dragState.currentY + Math.abs(dragState.currentX) * 0.2 + velocity * 0.1
      const finalRotation = direction * (30 + Math.min(velocity * 0.05, 20))

      // Clear drag state immediately for swipe out
      setDragState({
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        startTime: 0,
      })

      if (cardRef.current) {
        cardRef.current.style.transition = "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        cardRef.current.style.transform = `translate(${finalX}px, ${finalY}px) rotate(${finalRotation}deg) scale(0.8)`
        cardRef.current.style.opacity = "0"
      }

      setTimeout(() => {
        // Handle swipe right (go to order page)
        if (direction > 0) {
          router.push(`/order?id=${currentCard.id}`);
          return;
        }

        // Handle swipe left (next card)
        setCurrentCardIndex((prev) => (prev + 1) % filteredFoodItems.length)
        setIsAnimating(false)

        if (cardRef.current) {
          cardRef.current.style.transition = "none"
          cardRef.current.style.transform = "scale(0.9)"
          cardRef.current.style.opacity = "0"

          // Animate in the new card
          setTimeout(() => {
            if (cardRef.current) {
              cardRef.current.style.transition = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
              cardRef.current.style.transform = ""
              cardRef.current.style.opacity = "1"
            }
          }, 50)
        }
      }, 600)
    } else {
      // Snap back to center with spring animation
      setDragState({
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        startTime: 0,
      })

      if (cardRef.current) {
        cardRef.current.style.transition = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
        cardRef.current.style.transform = ""
      }
    }
  }, [dragState, isAnimating, router])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  // Calculate rotation and scale based on drag
  const rotation = dragState.isDragging ? dragState.currentX / 8 : 0
  const scale = dragState.isDragging ? Math.max(0.95, 1 - Math.abs(dragState.currentX) / 1000) : 1
  const opacity = dragState.isDragging ? Math.max(0.8, 1 - Math.abs(dragState.currentX) / 400) : 1

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
          <div className="w-full h-full bg-[#FDF6D2] rounded-[32px] overflow-hidden relative flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01563A] mx-auto mb-4"></div>
              <p className="text-[#01563A] font-medium">
                {authLoading ? "Checking authentication..." : "Loading food items..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
          <div className="w-full h-full bg-[#FDF6D2] rounded-[32px] overflow-hidden relative flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-[#A30100] font-medium mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-[#01563A] hover:bg-[#014a30]"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentCard || filteredFoodItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
          <div className="w-full h-full bg-[#FDF6D2] rounded-[32px] overflow-hidden relative flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-[#01563A] font-medium mb-4">No food items available</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-[#01563A] hover:bg-[#014a30]"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
        <div className="w-full h-full bg-[#FDF6D2] rounded-[32px] overflow-hidden relative">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#FDF6D2] pb-2">
            <div className="px-4 pt-6 pb-2">
              <div className="flex justify-center -mb-4">
                <Image src="/operaja-logo-new.png" alt="OperAja" width={360} height={120} className="h-24 w-auto" />
              </div>

              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 justify-between bg-transparent border-[#01563A] hover:bg-white text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-[#01563A]" />
                        <span className="text-xs text-[#01563A]">Area Layanan: {selectedArea}</span>
                      </div>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-[#FDF6D2]">
                    {AREA_OPTIONS.map((area) => (
                      <DropdownMenuItem key={area.value} onClick={() => setSelectedArea(area.value)}> 
                        <MapPin className="w-4 h-4 mr-2 text-[#01563A]" />
                        {area.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="icon"
                  className="bg-transparent border-[#01563A] w-8 h-8 text-[#01563A]"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Swipeable Card Container */}
          <div className="px-4 pb-8 relative">
            <div className="relative h-[560px]">
              {/* Next Card Preview (Background) */}
              <Card className="absolute inset-0 transform scale-95 opacity-40 shadow-lg border-0 bg-white">
                <div className="h-full overflow-hidden">
                  <Image
                    src={getSafeImageUrl(nextCard.image_url)}
                    alt={nextCard.name}
                    width={400}
                    height={560}
                    className="w-full h-[560px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <h2 className="text-xl font-bold mb-1">{nextCard.name}</h2>
                    <p className="text-lg font-semibold mb-1">Rp{nextCard.price_patungan}</p>
                    <p className="text-sm opacity-90">
                      {nextCard.availability} | {nextCard.distance}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Current Card */}
              <Card
                ref={cardRef}
                className="absolute inset-0 overflow-hidden shadow-xl border-0 bg-white cursor-grab active:cursor-grabbing select-none"
                style={{
                  transform: dragState.isDragging
                    ? `translate(${dragState.currentX}px, ${dragState.currentY}px) rotate(${rotation}deg) scale(${scale})`
                    : "",
                  opacity: opacity,
                  transition: dragState.isDragging
                    ? "none"
                    : "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={dragState.isDragging ? handleMouseMove : undefined}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Swipe Indicators */}
                {dragState.isDragging && (
                  <>
                    {dragState.currentX > 30 && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#01563A] text-white px-4 py-2 rounded-lg font-bold text-lg rotate-12 opacity-90 shadow-lg z-20">
                        PESAN
                      </div>
                    )}
                    {dragState.currentX < -30 && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#A30100] text-white px-4 py-2 rounded-lg font-bold text-lg -rotate-12 opacity-90 shadow-lg z-20">
                        LEWATI
                      </div>
                    )}
                  </>
                )}

                <div className="h-[560px] overflow-y-auto">
                  {/* Main Image Section */}
                  <div className="relative">
                    <Image
                      src={getSafeImageUrl(currentCard.image_url)}
                      alt={currentCard.name}
                      width={400}
                      height={560}
                      className="w-full h-[560px] object-cover pointer-events-none"
                      draggable={false}
                    />

                    {/* Rating Badge */}
                    <Badge className="absolute top-4 right-4 bg-white/90 text-[#01563A] hover:bg-white/90">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {currentCard.provider_rating}
                    </Badge>

                    {/* Food Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                      <h2 className="text-xl font-bold mb-1">{currentCard.name}</h2>
                      <p className="text-lg font-semibold mb-1">Rp{currentCard.price_patungan}</p>
                      <p className="text-sm opacity-90">
                        {currentCard.availability} | {currentCard.distance}
                      </p>
                    </div>
                  </div>

                  {/* Scrollable Content Below */}
                  {/* Location Section */}
                  <div className="bg-yellow-400 p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 mt-0.5 text-black" />
                      <div>
                        <h3 className="font-semibold text-black mb-1 text-sm">{currentCard.location_address}</h3>
                        <p className="text-xs text-black/80">{currentCard.location_details}</p>
                      </div>
                    </div>
                  </div>

                  {/* Provider Section */}
                  <div className="bg-blue-600 p-4 text-white">
                    <h3 className="font-semibold mb-3 text-sm">Dibagikan Oleh</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-10 h-10 border-2 border-white">
                        <AvatarImage src={getSafeImageUrl(currentCard.provider_avatar)} />
                        <AvatarFallback>{currentCard.provider_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-sm">{currentCard.provider_name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs">
                            {currentCard.provider_rating} / 5 ({currentCard.provider_reviews})
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs mb-4">Apa yang orang lain katakan tentang {currentCard.provider_name}?</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💰</span>
                        <span className="text-xs">Produk Worth It</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">⚡</span>
                        <span className="text-xs">Porsi Besar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">⏰</span>
                        <span className="text-xs">Proses cepat</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="bg-[#FDF6D2] p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm">Deskripsi Makanan</h3>

                    <div className="space-y-3 text-xs text-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1 text-sm">{currentCard.description_title}</h4>
                        <p className="text-justify">{currentCard.description_content}</p>
                      </div>

                      <h4 className="font-medium text-gray-800 mb-2 text-sm">
                        {currentCard.type === 'jualan'
                          ? `Harga: Rp${currentCard.price_patungan}`
                          : `Ajuan Donasi: Rp${currentCard.price_patungan}`}
                      </h4>
                      
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#FDF6D2] border-t border-gray-200">
            <div className="flex items-center justify-around py-3">
              <Button variant="ghost" size="icon" className="h-auto py-2" onClick={() => router.push("/")}>
                <Home className="w-6 h-6 text-[#A30100]" />
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
