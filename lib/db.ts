import mysql from 'mysql2/promise';

// Database configuration for XAMPP
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP MySQL password is empty
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool without specifying database initially
const pool = mysql.createPool(dbConfig);

// Test connection function
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Initialize database and tables
export async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    await pool.execute('CREATE DATABASE IF NOT EXISTS operaja_db');
    
    // Create a new pool with the database specified
    const dbPool = mysql.createPool({
      ...dbConfig,
      database: 'operaja_db'
    });

    // Create users table
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) DEFAULT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(60) NOT NULL,
        full_name VARCHAR(255) DEFAULT NULL,
        address TEXT DEFAULT NULL,
        phone_number TEXT DEFAULT NULL,
        id_number TEXT DEFAULT NULL,
        ktp_photo LONGTEXT DEFAULT NULL,
        bank_name TEXT DEFAULT NULL,
        account_number TEXT DEFAULT NULL,
        avatar LONGTEXT DEFAULT NULL,
        rating DECIMAL(3,1) DEFAULT 0.0,
        reviews_count INT(11) DEFAULT 0,
        total_savings DECIMAL(10,2) DEFAULT 0.00,
        total_waste_saved INT(11) DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        is_verified TINYINT(1) DEFAULT 0,
        is_business_donor BOOLEAN DEFAULT FALSE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Create food_items table
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS food_items (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating DECIMAL(3,1) DEFAULT 0.0,
        distance VARCHAR(50) DEFAULT NULL,
        availability VARCHAR(255) DEFAULT NULL,
        image_url VARCHAR(500) DEFAULT NULL,
        location_address VARCHAR(255) DEFAULT NULL,
        location_details TEXT DEFAULT NULL,
        provider_id INT(11) NOT NULL,
        description_title VARCHAR(255) DEFAULT NULL,
        description_content TEXT DEFAULT NULL,
        price_patungan TEXT DEFAULT NULL,
        weight INT(11) NOT NULL,
        status ENUM('available','ordered') DEFAULT 'available',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        KEY for_key_user (provider_id),
        CONSTRAINT for_key_user FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Create orders table
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        food_item_id INT(11) DEFAULT NULL,
        user_id INT(11) DEFAULT NULL,
        order_amount DECIMAL(10,2) DEFAULT NULL,
        status ENUM('pending','approved','confirmed','completed','cancelled') DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        KEY food_item_id (food_item_id),
        KEY user_id (user_id),
        CONSTRAINT orders_ibfk_1 FOREIGN KEY (food_item_id) REFERENCES food_items(id),
        CONSTRAINT orders_ibfk_2 FOREIGN KEY (user_id) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Buat tabel info_bisnis jika belum ada
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS info_bisnis (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT(11) NOT NULL,
        nama VARCHAR(255) NOT NULL,
        kategori VARCHAR(255) NOT NULL,
        alamat TEXT NOT NULL,
        rata_rata_pendapatan VARCHAR(255) NOT NULL,
        nama_narahubung VARCHAR(255) NOT NULL,
        nomor_telepon VARCHAR(50) NOT NULL,
        email_narahubung VARCHAR(255) NOT NULL,
        nib VARCHAR(100),
        sertifikat_halal VARCHAR(100),
        pirt VARCHAR(100),
        npwp VARCHAR(100),
        status VARCHAR(50) DEFAULT 'approved',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database and tables initialized successfully!');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

// Create a pool with the database specified for regular operations
const dbPool = mysql.createPool({
  ...dbConfig,
  database: 'operaja_db'
});

export default dbPool; 