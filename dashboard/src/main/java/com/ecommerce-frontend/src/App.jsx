import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed: npm install axios

// --- Tailwind CSS CDN (Included in index.html for simplicity) ---
// This code assumes Tailwind CSS is loaded via CDN in your public/index.html
// <script src="https://cdn.tailwindcss.com"></script>
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
// Add this to your index.html <head> for Inter font and Tailwind.

// --- Global Context for Cart ---
const CartContext = createContext();

// --- Demo Product Data (Hardcoded for frontend-only demo) ---
const demoProducts = [
  {
    id: 'prod1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-fidelity sound with noise cancellation and comfortable earcups. Perfect for music lovers and professionals.',
    price: 99.99,
    imageUrl: 'https://placehold.co/400x300/A78BFA/FFFFFF?text=Headphones',
    stock: 50,
  },
  {
    id: 'prod2',
    name: 'Smartwatch Series 7',
    description: 'Track your fitness, receive notifications, and make calls right from your wrist. Sleek design and long battery life.',
    price: 249.00,
    imageUrl: 'https://placehold.co/400x300/F87171/FFFFFF?text=Smartwatch',
    stock: 30,
  },
  {
    id: 'prod3',
    name: 'Portable Bluetooth Speaker',
    description: 'Compact and powerful speaker with rich bass and clear highs. Ideal for outdoor adventures and parties.',
    price: 59.95,
    imageUrl: 'https://placehold.co/400x300/34D399/FFFFFF?text=Speaker',
    stock: 120,
  },
  {
    id: 'prod4',
    name: '4K Ultra HD Smart TV 55"',
    description: 'Immersive viewing experience with vibrant colors and smart features. Stream your favorite content in stunning clarity.',
    price: 699.99,
    imageUrl: 'https://placehold.co/400x300/60A5FA/FFFFFF?text=Smart+TV',
    stock: 15,
  },
  {
    id: 'prod5',
    name: 'Gaming Laptop RTX 4080',
    description: 'Unleash ultimate gaming performance with the latest RTX graphics and a high-refresh-rate display. For serious gamers.',
    price: 1899.00,
    imageUrl: 'https://placehold.co/400x300/FBBF24/000000?text=Gaming+Laptop',
    stock: 10,
  },
  {
    id: 'prod6',
    name: 'Wireless Charging Pad',
    description: 'Fast and convenient wireless charging for your compatible devices. Sleek design, anti-slip surface.',
    price: 29.99,
    imageUrl: 'https://placehold.co/400x300/9CA3AF/FFFFFF?text=Charger',
    stock: 200,
  },
];

// --- API Service for Authentication (from previous conversation) ---
const API_URL = "http://localhost:8080/api/auth/"; // Your Spring Boot backend URL

const AuthService = {
  register: (username, email, password) => {
    return axios.post(API_URL + "signup", { username, email, password });
  },
  login: (username, password) => {
    return axios.post(API_URL + "signin", { username, password })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  },
  logout: () => {
    localStorage.removeItem("user");
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },
};

// --- Utility for JWT Header (from previous conversation) ---
function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
}

// --- API Service for Products (from previous conversation, modified for demo) ---
// In a real app, this would fetch from backend. For this demo, it uses local data.
const PRODUCT_API_URL = "http://localhost:8080/api/products/";

const ProductService = {
  // This function would typically fetch from the backend.
  // For this demo, we return the hardcoded products.
  getAllProducts: () => {
    return Promise.resolve({ data: demoProducts }); // Simulate API response
    // return axios.get(PRODUCT_API_URL, { headers: authHeader() }); // For actual backend
  },
  getProductById: (id) => {
    const product = demoProducts.find(p => p.id === id);
    return Promise.resolve({ data: product }); // Simulate API response
  },
  // These would interact with your backend's protected endpoints
  createProduct: (productData) => {
      return axios.post(PRODUCT_API_URL, productData, { headers: authHeader() });
  },
  updateProduct: (id, productData) => {
      return axios.put(PRODUCT_API_URL + id, productData, { headers: authHeader() });
  },
  deleteProduct: (id) => {
      return axios.delete(PRODUCT_API_URL + id, { headers: authHeader() });
  },
};


// --- Components ---

// Header Component
const Header = () => {
  const { cartItems } = useContext(CartContext);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.roles && user.roles.includes('ROLE_ADMIN'));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    setIsAdmin(false);
    window.location.href = '/login'; // Redirect after logout
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 shadow-lg rounded-b-xl">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold tracking-tight">E-Shop</Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-purple-200 transition duration-300">Home</Link>
          <Link to="/products" className="hover:text-purple-200 transition duration-300">Products</Link>
          {currentUser ? (
            <>
              <Link to="/dashboard" className="hover:text-purple-200 transition duration-300">Dashboard</Link>
              {isAdmin && <Link to="/admin" className="hover:text-purple-200 transition duration-300">Admin</Link>}
              <button onClick={logOut} className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg shadow-md transition duration-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-purple-200 transition duration-300">Login</Link>
              <Link to="/register" className="hover:text-purple-200 transition duration-300">Register</Link>
            </>
          )}
          <Link to="/cart" className="relative hover:text-purple-200 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out border border-gray-200">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover object-center"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/E0E7FF/000000?text=Image+Not+Found"; }}
        />
      </Link>
      <div className="p-5">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
          {product.stock > 0 ? (
            <span className="text-sm text-green-600 font-medium">In Stock ({product.stock})</span>
          ) : (
            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
          )}
        </div>
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className={`w-full py-3 rounded-lg font-semibold transition duration-300
            ${product.stock > 0
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
};

// --- Pages ---

// Home Page
const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Welcome to <span className="text-indigo-600">E-Shop</span>
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Your one-stop destination for the latest electronics and gadgets.
          Explore our wide range of products and find exactly what you need.
        </p>
        <Link
          to="/products"
          className="inline-block bg-indigo-600 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Start Shopping Now!
        </Link>
      </div>
    </div>
  );
};

// Product List Page
const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ProductService.getAllProducts()
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load products. Please try again later.");
        setLoading(false);
        console.error("Error fetching products:", err);
      });
  }, []);

  if (loading) return <div className="text-center p-8 text-xl text-gray-600">Loading products...</div>;
  if (error) return <div className="text-center p-8 text-xl text-red-600">{error}</div>;
  if (products.length === 0) return <div className="text-center p-8 text-xl text-gray-600">No products found.</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Product Detail Page
const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    ProductService.getProductById(id)
      .then(response => {
        if (response.data) {
          setProduct(response.data);
        } else {
          setError("Product not found.");
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load product details. Please try again later.");
        setLoading(false);
        console.error("Error fetching product details:", err);
      });
  }, [id]);

  if (loading) return <div className="text-center p-8 text-xl text-gray-600">Loading product details...</div>;
  if (error) return <div className="text-center p-8 text-xl text-red-600">{error}</div>;
  if (!product) return <div className="text-center p-8 text-xl text-gray-600">Product not found.</div>;

  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row max-w-4xl w-full border border-gray-200">
        <div className="lg:w-1/2 p-6 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto max-h-96 object-contain rounded-lg"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/E0E7FF/000000?text=Image+Not+Found"; }}
          />
        </div>
        <div className="lg:w-1/2 p-6 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-700 text-lg mb-6">{product.description}</p>
          <div className="flex items-baseline mb-6">
            <span className="text-5xl font-extrabold text-indigo-600 mr-4">${product.price.toFixed(2)}</span>
            {product.stock > 0 ? (
              <span className="text-lg text-green-600 font-semibold">In Stock ({product.stock})</span>
            ) : (
              <span className="text-lg text-red-600 font-semibold">Out of Stock</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className={`w-full py-4 rounded-lg font-semibold text-xl transition duration-300
              ${product.stock > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Cart Page
const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-lg text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/products"
          className="inline-block bg-indigo-600 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Your Shopping Cart</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-gray-200 py-4 last:border-b-0">
            <div className="flex items-center space-x-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg shadow-sm"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/E0E7FF/000000?text=Image"; }}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-indigo-600 font-bold">${item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="px-3 py-1 text-gray-800 font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-800 transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-end items-center pt-6">
          <span className="text-2xl font-bold text-gray-900 mr-4">Total: ${calculateTotal().toFixed(2)}</span>
          <button className="bg-green-600 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

// Login Page (from previous conversation)
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('');

    AuthService.login(username, password)
      .then(() => {
        navigate('/dashboard');
        window.location.reload(); // To refresh user context
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
      });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
          {message && <p className="mt-4 text-red-600 text-center text-sm">{message}</p>}
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline font-semibold">Register here</Link>
        </p>
      </div>
    </div>
  );
};

// Register Page (from previous conversation)
const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage('');

    AuthService.register(username, email, password)
      .then((response) => {
        setMessage(response.data.message);
        // Optionally redirect to login after successful registration
        navigate('/login');
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
      });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Register</h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="reg-username">Username:</label>
            <input
              type="text"
              id="reg-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="reg-email">Email:</label>
            <input
              type="email"
              id="reg-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="reg-password">Password:</label>
            <input
              type="password"
              id="reg-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Register
          </button>
          {message && <p className="mt-4 text-green-600 text-center text-sm">{message}</p>}
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:underline font-semibold">Login here</Link>
        </p>
      </div>
    </div>
  );
};

// Dashboard Page (from previous conversation)
const DashboardPage = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [products, setProducts] = useState([]); // This would fetch from backend in a real app
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // In a real app, this would fetch user-specific data or admin data from backend
      // For this demo, we'll just show the user info.
      // ProductService.getAllProducts() // Uncomment and adjust if you want to fetch from backend
      //   .then(response => {
      //     setProducts(response.data);
      //   })
      //   .catch(error => {
      //     console.error("Error fetching products:", error);
      //     setMessage("Error fetching products: " + (error.response?.data?.message || error.message));
      //   });
    } else {
      setMessage("Please log in to view the dashboard.");
    }
  }, []);

  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-80px)]">
      <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Your Dashboard</h2>
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {currentUser ? (
          <>
            <p className="text-xl text-gray-700 mb-4">Welcome, <span className="font-semibold text-indigo-600">{currentUser.username}</span>!</p>
            <p className="text-lg text-gray-600 mb-6">Email: {currentUser.email}</p>
            <p className="text-lg text-gray-600 mb-6">Your roles: <span className="font-medium">{currentUser.roles ? currentUser.roles.join(', ') : 'N/A'}</span></p>

            <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/products" className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center justify-center text-blue-800 font-semibold text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Browse Products
              </Link>
              <Link to="/cart" className="bg-green-100 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center justify-center text-green-800 font-semibold text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                View Cart
              </Link>
              {/* Add more dashboard elements here, e.g., "My Orders" */}
              <div className="bg-yellow-100 p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-yellow-800 font-semibold text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                My Orders (Coming Soon)
              </div>
            </div>
          </>
        ) : (
          <p className="text-xl text-red-600 text-center">{message}</p>
        )}
      </div>
    </div>
  );
};

// Admin Panel Page (Simple placeholder)
const AdminPanelPage = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
      setCurrentUser(user);
    } else {
      navigate('/login'); // Redirect if not admin
    }
  }, [navigate]);

  if (!currentUser) return null; // Or a loading spinner

  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-80px)]">
      <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Admin Panel</h2>
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <p className="text-xl text-gray-700 mb-4">Welcome, Admin <span className="font-semibold text-indigo-600">{currentUser.username}</span>!</p>
        <p className="text-lg text-gray-600 mb-6">Here you can manage:</p>
        <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
          <li>Products (Add, Edit, Delete)</li>
          <li>User Accounts</li>
          <li>Orders and Shipments</li>
          <li>Website Settings</li>
        </ul>
        <p className="mt-8 text-gray-600">
          (This is a placeholder. You would implement the actual management interfaces here.)
        </p>
      </div>
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize cart from localStorage
    try {
      const savedCart = localStorage.getItem('ecommerce_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    // Optional: Show a small confirmation message
    console.log(`${product.name} added to cart!`);
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.id !== productId);
      }
      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  return (
    <Router>
      <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart }}>
        <div className="font-['Inter'] bg-gray-100 min-h-screen">
          <Header />
          <main className="py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPanelPage />} />
              {/* Fallback for unknown routes */}
              <Route path="*" element={<div className="text-center p-8 text-xl text-gray-600">404 - Page Not Found</div>} />
            </Routes>
          </main>
        </div>
      </CartContext.Provider>
    </Router>
  );
}
