import pool from './db';

export async function seedFoodItems() {
  try {
    const sampleFoodItems = [
      {
        name: "Steak Kentang",
        price: "Rp 10.000",
        rating: 4.9,
        distance: "2.0 km",
        availability: "Tersedia sejak 16.30",
        image_url: "/steak-image.jpg",
        location_address: "Lokasi Pengambilan",
        location_details: "Jl. Ganesa No.10, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132",
        provider_name: "Lisa",
        provider_rating: 4.9,
        provider_reviews: 22,
        provider_avatar: "/placeholder.svg?height=40&width=40",
        description_title: "Steak Sirloin Sisa Acara Kantor",
        description_content: "Halo tetangga! Saya ada 2 porsi steak sirloin medium well yang ga rapi sama restorannya langsung. Dibungkus rapi sama restorannya langsung, belum dibuka sama sekali. Ini steak dari Resto Steak 88 daerah Dago, masih hangat baru aja dibungkus sekitar 1 jam yang lalu.",
        description_recommendations: "Rekomendasi patungan: Rp 10.000 (opsional, harga asli per porsi Rp 85.000)",
        description_sides: "Ada nasi, sayuran (brokoli dan wortel), dan saus mushroom terpisah. Sayang banget kalau dibuang, masih enak dan layak dimakan kok. Silakan langsung chat untuk koordinasi pengambilan.",
        description_notes: "Kalau mau datang sebelum jam 8 malam hari ini saya pasti ada di lokasi."
      },
      {
        name: "Nasi Gudeg",
        price: "Rp 8.000",
        rating: 4.7,
        distance: "1.5 km",
        availability: "Tersedia sejak 17.00",
        image_url: "/steak-image.jpg",
        location_address: "Lokasi Pengambilan",
        location_details: "Jl. Dipatiukur No.35, Lebak Gede, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132",
        provider_name: "Budi",
        provider_rating: 4.8,
        provider_reviews: 15,
        provider_avatar: "/placeholder.svg?height=40&width=40",
        description_title: "Gudeg Jogja Sisa Acara Keluarga",
        description_content: "Ada gudeg jogja sisa acara keluarga, masih banyak dan sayang kalau dibuang. Gudeg buatan sendiri dengan bumbu tradisional.",
        description_recommendations: "Rekomendasi patungan: Rp 8.000 per porsi",
        description_sides: "Lengkap dengan ayam, telur, dan sambal krecek",
        description_notes: "Pickup sebelum jam 9 malam ya!"
      },
      {
        name: "Pizza Margherita",
        price: "Rp 15.000",
        rating: 4.6,
        distance: "3.2 km",
        availability: "Tersedia sejak 18.00",
        image_url: "/steak-image.jpg",
        location_address: "Lokasi Pengambilan",
        location_details: "Jl. Setiabudi No.229, Isola, Kec. Sukasari, Kota Bandung, Jawa Barat 40154",
        provider_name: "Sarah",
        provider_rating: 4.7,
        provider_reviews: 31,
        provider_avatar: "/placeholder.svg?height=40&width=40",
        description_title: "Pizza Sisa Pesta Ulang Tahun",
        description_content: "Pizza margherita sisa pesta ulang tahun, masih utuh dan fresh. Sayang banget kalau dibuang.",
        description_recommendations: "Rekomendasi patungan: Rp 15.000 per pizza",
        description_sides: "Pizza utuh ukuran medium",
        description_notes: "Ambil sebelum jam 10 malam!"
      }
    ];

    // Check if data already exists to avoid duplicates
    const { rows: existingRows } = await pool.query('SELECT COUNT(*) as count FROM food_items');
    const count = (existingRows as any[])[0].count;
    
    if (count > 0) {
      console.log('Food items already exist, skipping seeding');
      return true;
    }

    for (const item of sampleFoodItems) {
      await pool.query(
        `INSERT INTO food_items (
          name, price, rating, distance, availability, image_url,
          location_address, location_details, provider_name, provider_rating,
          provider_reviews, provider_avatar, description_title, description_content,
          description_recommendations, description_sides, description_notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          item.name, item.price, item.rating, item.distance, item.availability, item.image_url,
          item.location_address, item.location_details, item.provider_name, item.provider_rating,
          item.provider_reviews, item.provider_avatar, item.description_title, item.description_content,
          item.description_recommendations, item.description_sides, item.description_notes
        ]
      );
    }

    console.log('Sample food items seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding food items:', error);
    return false;
  }
} 