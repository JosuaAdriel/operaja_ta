"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Camera, Home, Upload, User } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { error } from "node:console"

const AREA_OPTIONS = [
  { value: 'Dago', label: 'Dago' },
  { value: 'Sudirman', label: 'Sudirman' },
  { value: 'Thamrin', label: 'Thamrin' },
  { value: 'Gatot Subroto', label: 'Gatot Subroto' },
  { value: 'Hayam Wuruk', label: 'Hayam Wuruk' },
  { value: 'Rasuna Said', label: 'Rasuna Said' },
];

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [shareType, setShareType] = useState<"donasi" | "jualan" | "">("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    descriptionTitle: "",
    contribution: "",
    serviceArea: "",
    location: "",
    pickupTime: "",
    weight: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { user, isBusinessDonor, infoBisnis } = useAuth()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (!user) return // Must be logged in
    if (!selectedFile) {
      alert("Pilih gambar dulu!")
      return
    }
    if (shareType === "jualan" && !isBusinessDonor) {
      alert("Kamu harus daftar donatur layanan makanan dulu!")
      return
    }
    
    setUploading(true)
    // 1. Upload image
    const formDataImg = new FormData()
    formDataImg.append('file', selectedFile)
    const resImg = await fetch('/api/food-items/upload', {
      method: 'POST',
      body: formDataImg,
    })
    let imageUrl = null
    if (!resImg.ok) {
      let errorMsg = 'Gagal upload gambar.'
      try {
        const errData = await resImg.json()
        if (errData.error) errorMsg = errData.error + (errData.details ? (': ' + errData.details) : '')
      } catch {}
      alert(errorMsg)
      setUploading(false)
      return
    }
    const dataImg = await resImg.json()
    imageUrl = dataImg.url
    
    // 2. Submit form with imageUrl
    const randomDistance = `${Math.floor(Math.random() * 3) + 1} km`
    const payload = {
      name: formData.name ?? "",
      distance: randomDistance,
      availability: formData.pickupTime ?? "",
      image_url: imageUrl,
      location_address: formData.serviceArea ?? "",
      location_details: formData.location ?? "",
      provider_id: user.id,
      description_title: formData.descriptionTitle ?? "",
      description_content: formData.description ?? "",
      price_donation: formData.contribution ?? "",
      weight: formData.weight ? parseInt(formData.weight) : null,
      type: shareType // tambahkan type untuk membedakan donasi/jualan
    }
    
    const res = await fetch("/api/food-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    setUploading(false)
    if (res.ok) {
      router.push("/history?tab=food")
    } else {
      alert("Gagal mengunggah makanan. Coba lagi.")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      descriptionTitle: "",
      contribution: "",
      serviceArea: "",
      location: "",
      pickupTime: "",
      weight: "",
    })
  }

  const handleShareTypeChange = (value: "donasi" | "jualan") => {
    setShareType(value)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
        <div className="w-full h-full bg-[#FDF6D2] rounded-[32px] overflow-hidden relative">
          {/* Header - Fixed at top */}
          <div className="px-6 pt-6 pb-4">
            <div className="mt-6 mb-2">
              <h1 className="text-xl font-bold text-[#01563A] text-center">Unggah Makanan</h1>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div
            className="px-6 overflow-y-auto"
            style={{
              height: "calc(100% - 140px)",
              paddingBottom: "100px",
            }}
          >
            {/* Show business registration prompt if user selects jualan but not business donor */}
            {shareType === "jualan" && !isBusinessDonor ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-[#01563A] rounded-full flex items-center justify-center mb-6">
                  <span className="text-[#FDF6D2] text-3xl">🏪</span>
                </div>
                <h2 className="text-2xl font-bold text-[#01563A] mb-4">Daftar Donatur Layanan Makanan Dulu</h2>
                <p className="text-[#01563A] opacity-80 mb-8 max-w-sm">
                  Kamu harus mendaftar sebagai donatur berjualan sebelum bisa upload makanan jualan.
                </p>
                <div className="space-y-3 w-full">
                  <Button 
                    className="w-full bg-[#01563A] hover:bg-[#014A30] text-[#FDF6D2] font-bold py-4 rounded-lg text-lg" 
                    onClick={() => router.push('/business-register')}
                  >
                    Daftar Sekarang
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-[#01563A] text-[#01563A] hover:bg-[#01563A] hover:text-[#FDF6D2] font-bold py-3 rounded-lg" 
                    onClick={() => setShareType("")}
                  >
                    Kembali
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Share Type Selection - Moved above photo upload */}
                <div className="mb-6">
                  <Select value={shareType} onValueChange={handleShareTypeChange}>
                    <SelectTrigger className="bg-white border-2 border-[#01563A] text-[#01563A] focus:border-[#01563A] focus:ring-[#01563A]">
                      <SelectValue placeholder="Jenis Pembagian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="donasi">Donasi</SelectItem>
                      <SelectItem value="jualan">Jualan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload Section */}
                <div className="mb-6">
                  <div
                    className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-[#01563A] hover:border-[#01563A]/70 transition-colors"
                    onClick={handleImageClick}
                  >
                    {previewUrl ? (
                      <Image src={previewUrl} alt="Uploaded food" fill className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-[#01563A]">
                        <Camera className="w-12 h-12 mb-2" />
                        <p className="text-sm font-medium">Tap untuk upload foto</p>
                        <p className="text-xs opacity-70">Pilih dari galeri</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Conditional Form Fields based on Share Type */}
                {shareType && (
                  <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <Input
                        placeholder={shareType === "donasi" ? "Nama Makanan" : "Nama Surprise Bag"}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      />
                    </div>
                    {/* Description Title Field */}
                    <div>
                      <Input
                        placeholder={shareType === "donasi" ? "Judul Deskripsi" : "Judul Deskripsi"}
                        value={formData.descriptionTitle}
                        onChange={(e) => setFormData({ ...formData, descriptionTitle: e.target.value })}
                        className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      />
                    </div>
                    {/* Description Field */}
                    <div>
                      <Textarea
                        placeholder={shareType === "donasi" ? "Deskripsi makanan" : "Deskripsi surprise bag"}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                        rows={3}
                      />
                    </div>
                    {/* Contribution Field */}
                    <div>
                      <Input
                        placeholder={shareType === "donasi" ? "Ajuan Donasi (Rp)" : "Harga (Rp)"}
                        value={formData.contribution}
                        onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
                        className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      />
                    </div>
                    {/* Service Area Field */}
                    <div>
                      <Select value={formData.serviceArea} onValueChange={(value) => setFormData({ ...formData, serviceArea: value })}>
                        <SelectTrigger className="bg-white border-2 border-[#01563A] text-[#01563A] focus:border-[#01563A] focus:ring-[#01563A]">
                          <SelectValue placeholder="Area Layanan" />
                        </SelectTrigger>
                        <SelectContent>
                          {AREA_OPTIONS.map((area) => (
                            <SelectItem key={area.value} value={area.value}>
                              {area.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Location Field */}
                    <div>
                      <Input
                        placeholder="Lokasi Detail"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      />
                    </div>
                    {/* Pickup Time Field */}
                    <div>
                      <Input
                        placeholder="Waktu Pengambilan (Contoh: 12:00)"
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      />
                    </div>
                    {/* Weight Field */}
                    <div>
                      <Input
                        placeholder="Berat (gram)"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-8 mb-12">
                  <Button
                    className="w-full mt-8 bg-[#01563A] text-[#FDF6D2] font-bold py-3 rounded-lg text-lg"
                    onClick={handleSubmit}
                    disabled={uploading || (shareType === "jualan" && !isBusinessDonor)}
                  >
                    {uploading ? "Mengunggah..." : "Unggah Makanan"}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Bottom Navigation - Fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#FDF6D2] border-t border-gray-200">
            <div className="flex items-center justify-around py-3">
              <Button variant="ghost" size="icon" className="h-auto py-2" onClick={() => router.push("/")}>
                <Home className="w-6 h-6 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon" className="h-auto py-2" onClick={() => router.push("/upload")}>
                <Upload className="w-6 h-6 text-red-500" />
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
