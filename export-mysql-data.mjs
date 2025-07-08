import mysql from 'mysql2/promise';
import fs from 'fs';

// MySQL connection config
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'operaja_db',
  port: 3306
};

async function exportData() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');

    // Export users
    const [users] = await connection.execute('SELECT * FROM users');
    fs.writeFileSync('exported-users.json', JSON.stringify(users, null, 2));
    console.log(`Exported ${users.length} users`);

    // Export food_items
    const [foodItems] = await connection.execute('SELECT * FROM food_items');
    fs.writeFileSync('exported-food-items.json', JSON.stringify(foodItems, null, 2));
    console.log(`Exported ${foodItems.length} food items`);

    // Export orders
    const [orders] = await connection.execute('SELECT * FROM orders');
    fs.writeFileSync('exported-orders.json', JSON.stringify(orders, null, 2));
    console.log(`Exported ${orders.length} orders`);

    // Export info_bisnis
    const [infoBisnis] = await connection.execute('SELECT * FROM info_bisnis');
    fs.writeFileSync('exported-info-bisnis.json', JSON.stringify(infoBisnis, null, 2));
    console.log(`Exported ${infoBisnis.length} business info records`);

    await connection.end();
    console.log('Data export completed successfully!');
    console.log('Files created:');
    console.log('- exported-users.json');
    console.log('- exported-food-items.json');
    console.log('- exported-orders.json');
    console.log('- exported-info-bisnis.json');

  } catch (error) {
    console.error('Export failed:', error);
  }
}

exportData(); 