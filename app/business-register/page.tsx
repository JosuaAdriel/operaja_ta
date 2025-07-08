"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function BusinessRegisterPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    alamat: "",
    rata_rata_pendapatan: "",
    nama_narahubung: "",
    nomor_telepon: "",
    email_narahubung: "",
    nib: "",
    sertifikat_halal: "",
    pirt: "",
    npwp: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/business-donor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      
      if (res.ok) {
        setSuccess('Pendaftaran bisnis berhasil!')
        setTimeout(() => {
          router.push('/history?tab=food')
        }, 2000)
      } else {
        setError(data.message || 'Gagal mendaftar bisnis')
      }
    } catch (e) {
      setError('Gagal mendaftar bisnis')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl">
        <div className="w-full h-full bg-[#FDF6D2] rounded-[32px] overflow-hidden relative flex flex-col">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex-shrink-0">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                className="p-0 text-[#01563A] hover:bg-white/10" 
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-xl font-bold text-[#01563A]">Daftar Donatur Layanan Makanan</h1>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 pb-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Info Bisnis */}
              <div className="bg-white rounded-lg p-4 border border-[#01563A]">
                <h2 className="text-lg font-bold text-[#01563A] mb-4">Informasi Bisnis</h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#01563A] mb-1">Nama Bisnis *</label>
                    <Input
                      value={formData.nama}
                      onChange={(e) => handleInputChange('nama', e.target.value)}
                      className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      placeholder="Masukkan nama bisnis"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#01563A] mb-1">Kategori *</label>
                    <Input
                      value={formData.kategori}
                      onChange={(e) => handleInputChange('kategori', e.target.value)}
                      className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      placeholder="Contoh: Makanan, Minuman, dll"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#01563A] mb-1">Alamat *</label>
                    <Textarea
                      value={formData.alamat}
                      onChange={(e) => handleInputChange('alamat', e.target.value)}
                      className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      placeholder="Alamat lengkap bisnis"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#01563A] mb-1">Rata-rata Pendapatan *</label>
                    <Input
                      value={formData.rata_rata_pendapatan}
                      onChange={(e) => handleInputChange('rata_rata_pendapatan', e.target.value)}
                      className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      placeholder="Contoh: 10000000 (10 juta per bulan)"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Info Kontak */}
              <div className="bg-white rounded-lg p-4 border border-[#01563A]">
                <h2 className="text-lg font-bold text-[#01563A] mb-4">Informasi Kontak</h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#01563A] mb-1">Nama Narahubung *</label>
                    <Input
                      value={formData.nama_narahubung}
                      onChange={(e) => handleInputChange('nama_narahubung', e.target.value)}
                      className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      placeholder="Nama lengkap narahubung"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#01563A] mb-1">Nomor Telepon *</label>
                    <Input
                      value={formData.nomor_telepon}
                      onChange={(e) => handleInputChange('nomor_telepon', e.target.value)}
                      className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      placeholder="08123456789"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#01563A] mb-1">Email Narahubung *</label>
                    <Input
                      type="email"
                      value={formData.email_narahubung}
                      onChange={(e) => handleInputChange('email_narahubung', e.target.value)}
                      className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Dokumen Legal */}
              <div className="bg-white rounded-lg p-4 border border-[#01563A]">
                <h2 className="text-lg font-bold text-[#01563A] mb-4">Dokumen Legal</h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#01563A] mb-1">NIB</label>
                    <Input
                      value={formData.nib}
                      onChange={(e) => handleInputChange('nib', e.target.value)}
                      className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      placeholder="Nomor Induk Berusaha"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#01563A] mb-1">Sertifikat Halal</label>
                    <Input
                      value={formData.sertifikat_halal}
                      onChange={(e) => handleInputChange('sertifikat_halal', e.target.value)}
                      className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      placeholder="Nomor sertifikat halal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#01563A] mb-1">PIRT</label>
                    <Input
                      value={formData.pirt}
                      onChange={(e) => handleInputChange('pirt', e.target.value)}
                      className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      placeholder="Nomor PIRT"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#01563A] mb-1">NPWP</label>
                    <Input
                      value={formData.npwp}
                      onChange={(e) => handleInputChange('npwp', e.target.value)}
                      className="bg-white border-2 border-[#01563A] text-[#01563A] placeholder:text-[#01563A]/60 focus:border-[#01563A] focus:ring-[#01563A]"
                      placeholder="Nomor Pokok Wajib Pajak"
                    />
                  </div>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#01563A] hover:bg-[#014A30] text-[#FDF6D2] font-bold py-4 rounded-lg text-lg"
                disabled={loading}
              >
                {loading ? "Mendaftar..." : "Daftar Bisnis"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 