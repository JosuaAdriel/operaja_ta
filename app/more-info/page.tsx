"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Upload, MapPin, Phone, CreditCard, Building, Hash } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"

export default function MoreInfoPage() {
  const [formData, setFormData] = useState({
    profileName: "",
    fullName: "",
    address: "",
    phoneNumber: "",
    idNumber: "",
    bankName: "",
    accountNumber: "",
  })
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [ktpPhoto, setKtpPhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const profilePhotoRef = useRef<HTMLInputElement>(null)
  const ktpPhotoRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { updateProfile } = useAuth()

  // Tambahkan state untuk preview
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const [ktpPhotoPreview, setKtpPhotoPreview] = useState<string | null>(null)

  // Check if user came from signup
  useEffect(() => {
    const tempUserId = sessionStorage.getItem('tempUserId')
    if (!tempUserId) {
      router.push('/signup')
    }
  }, [router])

  // Ubah handler upload avatar
  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/food-items/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setProfilePhoto(data.url); // simpan nama file ke DB
        setProfilePhotoPreview(URL.createObjectURL(file)); // preview
      }
    }
  };

  // Ubah handler upload KTP
  const handleKtpPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/food-items/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setKtpPhoto(data.url); // simpan nama file ke DB
        setKtpPhotoPreview(URL.createObjectURL(file)); // preview
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const profileData = {
        name: formData.profileName,
        fullName: formData.fullName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        idNumber: formData.idNumber,
        ktpPhoto: ktpPhoto,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        avatar: profilePhoto
      }

      const result = await updateProfile(profileData)
      
      if (result.success) {
        // Clear temporary user ID
        sessionStorage.removeItem('tempUserId')
        router.push("/")
      } else {
        setError(result.error || "Failed to update profile")
      }
    } catch (err) {
      setError("An error occurred while updating profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
        <div className="w-full h-full bg-[#FDF6D2] rounded-[32px] overflow-hidden relative">
          {/* Content */}
          <div className="px-8 py-8 h-full flex flex-col">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#01563A] mb-2">Daftar Pengguna</h1>
              <p className="text-[#01563A] text-sm">Informasi Dasar Pengguna</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-[#A30100]/10 border border-[#A30100] text-[#A30100] rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="space-y-4 pb-8">
                {/* Profile Name */}
                <div className="flex items-center border-b-2 border-[#01563A] pb-2">
                  <User className="w-5 h-5 text-[#01563A] mr-3" />
                  <Input
                    type="text"
                    placeholder="Nama Profil"
                    value={formData.profileName}
                    onChange={(e) => setFormData({ ...formData, profileName: e.target.value })}
                    className="border-0 bg-transparent text-[#01563A] placeholder:text-[#01563A]/60 focus:ring-0 focus:outline-none p-0"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Profile Photo Upload */}
                <div className="flex items-center border-b-2 border-[#01563A] pb-2">
                  <Upload className="w-5 h-5 text-[#01563A] mr-3" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-[#01563A]/60 cursor-pointer" onClick={() => profilePhotoRef.current?.click()}>
                      {profilePhotoPreview ? "Foto Profil Dipilih" : profilePhoto ? "Foto Profil Dipilih" : "Unggah Foto Profil"}
                    </span>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
                      <Image
                        src={profilePhotoPreview || profilePhoto || "/placeholder-user.jpg"}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <input
                    ref={profilePhotoRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </div>

                {/* Full Name */}
                <div className="flex items-center border-b-2 border-[#01563A] pb-2">
                  <User className="w-5 h-5 text-[#01563A] mr-3" />
                  <Input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="border-0 bg-transparent text-[#01563A] placeholder:text-[#01563A]/60 focus:ring-0 focus:outline-none p-0"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Address */}
                <div className="flex items-center border-b-2 border-[#01563A] pb-2">
                  <MapPin className="w-5 h-5 text-[#01563A] mr-3" />
                  <Input
                    type="text"
                    placeholder="Alamat"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="border-0 bg-transparent text-[#01563A] placeholder:text-[#01563A]/60 focus:ring-0 focus:outline-none p-0"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Phone Number */}
                <div className="flex items-center border-b-2 border-[#01563A] pb-2">
                  <Phone className="w-5 h-5 text-[#01563A] mr-3" />
                  <Input
                    type="tel"
                    placeholder="Nomor Telepon"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="border-0 bg-transparent text-[#01563A] placeholder:text-[#01563A]/60 focus:ring-0 focus:outline-none p-0"
                    required
                    disabled={loading}
                  />
                </div>

                {/* ID Number */}
                <div className="flex items-center border-b-2 border-[#01563A] pb-2">
                  <CreditCard className="w-5 h-5 text-[#01563A] mr-3" />
                  <Input
                    type="text"
                    placeholder="Nomor Induk Kependudukan"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className="border-0 bg-transparent text-[#01563A] placeholder:text-[#01563A]/60 focus:ring-0 focus:outline-none p-0"
                    required
                    disabled={loading}
                  />
                </div>

                {/* KTP Photo Upload */}
                <div className="flex items-center border-b-2 border-[#01563A] pb-2">
                  <Upload className="w-5 h-5 text-[#01563A] mr-3" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-[#01563A]/60 cursor-pointer" onClick={() => ktpPhotoRef.current?.click()}>
                      {ktpPhotoPreview ? "Foto KTP Dipilih" : ktpPhoto ? "Foto KTP Dipilih" : "Unggah Foto KTP"}
                    </span>
                    <div className="w-10 h-10 rounded overflow-hidden border border-gray-300 flex items-center justify-center">
                      <Image
                        src={ktpPhotoPreview || ktpPhoto || "/placeholder-user.jpg"}
                        alt="KTP"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <input
                    ref={ktpPhotoRef}
                    type="file"
                    accept="image/*"
                    onChange={handleKtpPhotoUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </div>

                {/* Bank Name */}
                <div className="flex items-center border-b-2 border-[#01563A] pb-2">
                  <Building className="w-5 h-5 text-[#01563A] mr-3" />
                  <Input
                    type="text"
                    placeholder="Nama Bank"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="border-0 bg-transparent text-[#01563A] placeholder:text-[#01563A]/60 focus:ring-0 focus:outline-none p-0"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Account Number */}
                <div className="flex items-center border-b-2 border-[#01563A] pb-2">
                  <Hash className="w-5 h-5 text-[#01563A] mr-3" />
                  <Input
                    type="text"
                    placeholder="Nomor Rekening"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="border-0 bg-transparent text-[#01563A] placeholder:text-[#01563A]/60 focus:ring-0 focus:outline-none p-0"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <Button
                  type="submit"
                  className="w-full bg-[#01563A] hover:bg-[#01563A]/90 text-white font-bold py-4 rounded-lg text-lg"
                  disabled={loading}
                >
                  {loading ? "MENYIMPAN..." : "SIMPAN & LANJUT"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
