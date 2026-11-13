
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'

dotenv.config()

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with clear sound and deep bass.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock: 25
  },
  {
    name: 'Smart Watch',
    description: 'Smart watch with fitness tracking and heart rate monitoring.',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    stock: 15
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable lightweight shoes for everyday running.',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Fashion',
    stock: 30
  },
  {
    name: 'Travel Backpack',
    description: 'Spacious backpack suitable for travel and everyday use.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Accessories',
    stock: 20
  }
]

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    await Product.deleteMany({})
    await Product.insertMany(products)

    console.log('Products added successfully!')
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error.message)
    await mongoose.disconnect()
    process.exit(1)
  }
}

seedProducts()
