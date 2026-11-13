
import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/products'

const getProductIcon = (category) => {
  const icons = {
    Electronics: '🎧',
    Fashion: '👟',
    Accessories: '🎒'
  }

  return icons[category] || '🛍️'
}

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shopsphere-cart')) || []
    } catch {
      return []
    }
  })

  const [showCart, setShowCart] = useState(false)

  // Fetch products from MongoDB through Express API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()

        const formattedProducts = data.products.map((product) => ({
          ...product,
          id: product._id,
          icon: getProductIcon(product.category)
        }))

        setProducts(formattedProducts)
        setError('')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem('shopsphere-cart', JSON.stringify(cart))
  }, [cart])

  // Add product
  const addToCart = (product) => {
    setCart((previousCart) => {
      const existing = previousCart.find(
        (item) => item.id === product.id
      )

      if (existing) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...previousCart, { ...product, quantity: 1 }]
    })
  }

  // Increase quantity
  const increaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  // Remove product
  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    )
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity, 0
  )

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity, 0
  )

  const formatPrice = (price) =>
    `₹${price.toLocaleString('en-IN')}`

  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <h2 className="logo">ShopSphere.</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <button>Login</button>

          <button
            className="cart"
            onClick={() => setShowCart(!showCart)}
          >
            Cart ({cartCount})
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="tagline">
            YOUR ONE-STOP SHOPPING DESTINATION
          </p>

          <h1>Discover Products You'll Love.</h1>

          <p>
            Explore quality products, great deals and a
            seamless shopping experience.
          </p>

          <a href="#products" className="shop-btn">
            Explore Products →
          </a>
        </div>
      </section>

      {/* Shopping Cart */}
      {showCart && (
        <section className="cart-section">
          <h2>Your Shopping Cart</h2>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <h3>Your cart is empty!</h3>
              <p>Add some products to get started.</p>

              <button onClick={() => setShowCart(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-container">

              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>

                    <div className="cart-product-icon">
                      {item.icon || '🛍️'}
                    </div>

                    <div className="cart-product-info">
                      <h3>{item.name}</h3>
                      <p>{formatPrice(item.price)}</p>
                    </div>

                    <div className="quantity-controls">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>

                    <strong>
                      {formatPrice(item.price * item.quantity)}
                    </strong>

                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h3>Order Summary</h3>

                <p>
                  Total Items: <strong>{cartCount}</strong>
                </p>

                <h2>Subtotal: {formatPrice(subtotal)}</h2>

                <button className="checkout-btn">
                  Proceed to Checkout
                </button>
              </div>

            </div>
          )}
        </section>
      )}

      {/* Products */}
      <section className="products" id="products">
        <p className="tagline">OUR COLLECTION</p>
        <h2>Featured Products</h2>

        {loading && <p>Loading products...</p>}

        {error && (
          <p className="error-message">
            {error}. Please check whether the backend is running.
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p>No products available.</p>
        )}

        {!loading && !error && (
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center'
                    }}
                  />
                </div>

                <h3>{product.name}</h3>

                <p>{formatPrice(product.price)}</p>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer id="about">
        <h2>ShopSphere.</h2>
        <p>Shopping made simple.</p>
        <p>© 2026 ShopSphere. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default App
