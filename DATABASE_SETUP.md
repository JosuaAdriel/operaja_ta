# Database Setup Guide

This guide will help you connect your OperAja project to MySQL using XAMPP.

## Prerequisites

1. **XAMPP** installed on your system
2. **Node.js** and **npm** installed
3. **Next.js** project set up

## Step 1: Start XAMPP Services

1. Open XAMPP Control Panel
2. Start the **Apache** and **MySQL** services
3. Make sure both services show a green status

## Step 2: Access phpMyAdmin

1. Open your web browser
2. Go to `http://localhost/phpmyadmin`
3. You should see the phpMyAdmin interface
4. The default credentials are:
   - Username: `root`
   - Password: `` (empty)

## Step 3: Database Configuration

The project is configured to automatically:
- Create a database named `operaja_db`
- Create necessary tables (`food_items`, `users`, `orders`)
- Use the default XAMPP MySQL settings:
  - Host: `localhost`
  - Port: `3306`
  - Username: `root`
  - Password: `` (empty)

## Step 4: Test the Connection

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to:
   ```
   http://localhost:3000/test-db
   ```

3. Click "Test Connection" to verify the database connection
4. Click "Seed Database" to add sample food items

## Step 5: Verify Everything Works

1. Go back to the home page (`http://localhost:3000`)
2. You should see the food items loaded from the database
3. The swipe functionality should work with real data

## Database Schema

### food_items Table
- `id` - Primary key
- `name` - Food item name
- `price` - Price in Indonesian Rupiah
- `rating` - Average rating (0.0 - 5.0)
- `distance` - Distance from user
- `availability` - Availability status
- `image_url` - URL to food image
- `location_address` - Pickup address
- `location_details` - Detailed address
- `provider_name` - Name of the person sharing
- `provider_rating` - Provider's rating
- `provider_reviews` - Number of reviews
- `provider_avatar` - Provider's avatar URL
- `description_title` - Description title
- `description_content` - Main description
- `description_recommendations` - Recommendations
- `description_sides` - Side dishes info
- `description_notes` - Additional notes
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### users Table
- `id` - Primary key
- `name` - User's name
- `email` - User's email (unique)
- `avatar` - Avatar URL
- `rating` - User's rating
- `reviews_count` - Number of reviews
- `created_at` - Creation timestamp

### orders Table
- `id` - Primary key
- `food_item_id` - Foreign key to food_items
- `user_id` - Foreign key to users
- `status` - Order status (pending, confirmed, completed, cancelled)
- `created_at` - Creation timestamp

## API Endpoints

- `GET /api/test-db` - Test database connection
- `POST /api/seed` - Seed database with sample data
- `GET /api/food-items` - Get all food items
- `POST /api/food-items` - Create new food item
- `GET /api/food-items/[id]` - Get specific food item
- `PUT /api/food-items/[id]` - Update food item
- `DELETE /api/food-items/[id]` - Delete food item

## Troubleshooting

### Connection Issues
1. Make sure XAMPP MySQL service is running
2. Check if port 3306 is not blocked
3. Verify the database credentials in `lib/db.ts`

### Database Not Found
1. The application will automatically create the database
2. If it fails, manually create `operaja_db` in phpMyAdmin

### Permission Issues
1. Make sure the MySQL user has proper permissions
2. Try creating a new user with full privileges

### Data Not Loading
1. Check the browser console for errors
2. Verify the API endpoints are working
3. Make sure sample data was seeded successfully

## Next Steps

Once the database is connected:
1. Add more food items through the API
2. Implement user authentication
3. Add order management functionality
4. Implement real-time updates
5. Add image upload functionality

## Security Notes

- This setup uses default XAMPP credentials for development
- For production, change the database password
- Use environment variables for sensitive configuration
- Implement proper authentication and authorization 
- Supabase Pass: 6bj%5&nqbHrwh$J