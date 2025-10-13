# 🐸 FoodieFrog - Food Delivery Platform ( Team 3 )

A modern, full-stack food delivery platform built with Next.js 15, featuring real-time order tracking, secure payments, and comprehensive restaurant management.

 # Live Link :  https://foodie-frog.vercel.app/ 


## 🚀 Features

### 🍕 For Customers
- **Restaurant & Food Discovery** - Browse through restaurants with filtering
- **Smart Shopping Cart** - Add items from  restaurants with real-time calculations
- **Real-time Order Tracking** - Live updates from kitchen to doorstep
- **Secure Payments** - Stripe integration with multiple payment methods
- **User Profiles** - Order history,Track  recent food orders

### 🏪 For Restaurants
- **Restaurant Dashboard** - Manage menu, orders, and business information
- **Order Management** - Update order status (pending → preparing → delivered)
- **Performance Analytics** - Sales data and customer insights
- **Menu Management** - Add, edit, and organize food items with categories



## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **JavaScript** - Type-safe development

### Backend
- **Next.js API Routes** - Full-stack capabilities
- **MongoDB with Mongoose** - Database and ODM
- **NextAuth.js** - Authentication system
- **Stripe** - Payment processing
- **Cloudinary** - Image and media management

### Additional Libraries
- **React Fast Marquee** - Smooth scrolling animations
- **Swiper** - Touch slider components
- **Lottie React** - Animation integration
- **Google Maps API** - Location services
- **SweetAlert2** - Beautiful alert dialogs

## 📁 Project Structure

```
foodie-frog/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── restaurant/    # Restaurant management
│   │   │   ├── orders/        # Order processing
│   │   │   ├── checkout/      # Payment handling
│   │   │   └── webhooks/      # Stripe webhooks
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── restaurant-dashboard/ # Restaurant owner portal
│   │   ├── orders/            # Order pages
│   │   └── restaurants/       # Restaurant listings
│   ├── components/            # Reusable components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   ├── sections/          # Page sections
│   │   ├── cart/              # Shopping cart
│   │   └── map/               # Map components
│   ├── lib/                   # Utility libraries
│   │   ├── authOptions.js     # NextAuth configuration
│   │   ├── dbconnect.js       # Database connection
│   │   ├── stripe.js          # Stripe configuration
│   │   └── utils.js           # Helper functions
│   ├── models/                # MongoDB models
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   └── providers/             # React context providers
│       └── NextAuthProvider.jsx
├── public/                    # Static assets
└── configuration files        # ESLint, Tailwind, etc.
```


## 📱 Key Pages & Features

### Customer Experience
- **Homepage** (`/`) - Featured restaurants, categories, and promotions
- **Restaurant Listings** (`/restaurants`) - Browse all restaurants
- **Restaurant Details** (`/restaurants/[id]`) - Menu and ordering
- **Cart & Checkout** (`/checkout`) - Secure payment process
- **Order Tracking** (`/orders/[id]`) - Real-time status updates
- **User Profile** (`/profile`) - Account management

### Restaurant Portal
- **Dashboard** (`/restaurant-dashboard`) - Business overview
- **Menu Management** (`/restaurant-dashboard/menu`) - Add/edit menu items
- **Order Management** (`/restaurant-dashboard/orders`) - Process orders
- **Restaurant Setup** (`/restaurant-dashboard/add-restaurant`) - Onboarding

### Authentication
- **User Registration** (`/auth/register`) - Customer accounts
- **Restaurant Registration** (`/auth/restaurant-register`) - Partner onboarding
- **Login** (`/auth/login`) - Secure authentication

## 💳 Payment Integration

FoodieFrog uses **Stripe** for secure payment processing:
- Credit/Debit card payments
- Secure tokenization
- Webhook handling for payment confirmation
- Refund and dispute management

## 🗃 Database Models

### User
- Authentication credentials
- Personal information
- Order history
- Favorite restaurants

### Restaurant
- Business information
- Location data
- Menu categories
 

### MenuItem
- Food details (name, description, price)
- Dietary information
- Availability status
- Image references

### Order
- Customer information
- Restaurant details
- Order items and quantities
- Payment status
- Delivery tracking

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Dark Mode Support** - Theme switching
- **Loading States** - Smooth user experience
- **Error Handling** - User-friendly error messages

## 🔒 Security Features

- **Password Hashing** - bcrypt for secure storage
- **CSRF Protection** - NextAuth built-in security
- **API Route Protection** - Server-side validation
- **Payment Security** - PCI compliant Stripe integration
- **Input Validation** - Client and server-side checks

## 📈 Performance Optimizations

- **Next.js 15** - Latest performance improvements
- **Turbopack** - Fast development builds
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic bundle optimization
- **SSR/SSG** - Hybrid rendering strategies


## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting solutions
- Stripe for payment infrastructure
- MongoDB for database services
- The open-source community

---

**Built with ❤️ using Next.js 15 and modern web technologies**