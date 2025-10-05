# DAY - 2
FoodieFrog - Food Delivery Platform ZiGNsj8EXxz8xOhj  FoodieFrog_DB
42533334121-cc7nem9bgig28os3coevh5issbd4s9s1.apps.googleusercontent.com id
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 secret

🐸 Project Overview
FoodieFrog is a modern food delivery platform built with Next.js, featuring restaurant listings, cart functionality, order tracking, payment integration, and admin dashboard capabilities.

🚀 What's Been Implemented So Far
✅ Project Setup & Configuration
Next.js 14 project with App Router

JavaScript configuration

Tailwind CSS for styling

shadcn/ui component library integration

Dark/Light Theme System with next-themes

Responsive design setup

✅ Installed shadcn/ui Components
Button - Various button variants (default, secondary, destructive, outline, ghost)

Card - Container components with header, title, and content

Input - Form input fields

Label - Form labels for accessibility

DropdownMenu - For theme toggle and navigation menus

✅ Theme System Implementation

✅ Page Structure
Homepage (/) - Landing page with platform overview

Test Page (/test) - Component demonstration and testing

Layout - Consistent navigation with theme toggle

Navbar Component - Reusable navigation with theme controls

✅ Features Implemented
Basic Testing with test routes 

foodie-frog/
├── 📁 app/
│   ├── 📁 (auth)/
│   │   ├── 📁 login/
│   │   │   └── 📄 page.jsx
│   │   ├── 📁 register/
│   │   │   └── 📄 page.jsx
│   │   └── 📁 restaurant-register/
│   │       └── 📄 page.jsx
│   │
│   ├── 📁 dashboard/
│   │   ├── 📁 admindashboard/
│   │   │   ├── 📁 analytics/
│   │   │   │   └── 📄 page.jsx
│   │   │   ├── 📁 manage-restaurants/
│   │   │   │   ├── 📄 page.jsx
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── 📄 page.jsx
│   │   │   ├── 📁 manage-orders/
│   │   │   │   ├── 📄 page.jsx
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── 📄 page.jsx
│   │   │   └── 📁 manage-users/
│   │   │       └── 📄 page.jsx
│   │   │
│   │   ├── 📁 userdashboard/
│   │   │   ├── 📁 orders/
│   │   │   │   ├── 📄 page.jsx
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── 📄 page.jsx
│   │   │   ├── 📁 profile/
│   │   │   │   └── 📄 page.jsx
│   │   │   ├── 📁 addresses/
│   │   │   │   └── 📄 page.jsx
│   │   │   └── 📄 layout.jsx
│   │   │
│   │   └── 📁 restaurantdashboard/
│   │       ├── 📁 menu/
│   │       │   ├── 📄 page.jsx
│   │       │   └── 📁 [id]/
│   │       │       └── 📄 page.jsx
│   │       ├── 📁 orders/
│   │       │   ├── 📄 page.jsx
│   │       │   └── 📁 [id]/
│   │       │       └── 📄 page.jsx
│   │       ├── 📁 analytics/
│   │       │   └── 📄 page.jsx
│   │       ├── 📁 settings/
│   │       │   └── 📄 page.jsx
│   │       └── 📄 layout.jsx
│   │
│   ├── 📁 restaurants/
│   │   ├── 📄 page.jsx
│   │   ├── 📁 [id]/
│   │   │   └── 📄 page.jsx
│   │   └── 📁 search/
│   │       └── 📄 page.jsx
│   │
│   ├── 📁 cart/
│   │   ├── 📄 page.jsx
│   │   └── 📁 checkout/
│   │       └── 📁 [id]/
│   │           └── 📄 page.jsx
│   │
│   ├── 📁 orders/
│   │   ├── 📁 tracking/
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 page.jsx
│   │   └── 📁 history/
│   │       └── 📄 page.jsx
│   │
│   ├── 📁 api/
│   │   ├── 📁 auth/
│   │   │   └── 📁 [...nextauth]/
│   │   │       └── 📄 route.js
│   │   ├── 📁 admin/
│   │   │   ├── 📁 restaurants/
│   │   │   │   └── 📄 route.js
│   │   │   ├── 📁 orders/
│   │   │   │   └── 📄 route.js
│   │   │   └── 📁 users/
│   │   │       └── 📄 route.js
│   │   ├── 📁 restaurants/
│   │   │   ├── 📄 route.js
│   │   │   └── 📁 [id]/
│   │   │       ├── 📄 route.js
│   │   │       └── 📁 menu/
│   │   │           └── 📄 route.js
│   │   ├── 📁 menu/
│   │   │   ├── 📄 route.js
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 route.js
│   │   ├── 📁 orders/
│   │   │   ├── 📄 route.js
│   │   │   └── 📁 [id]/
│   │   │       ├── 📄 route.js
│   │   │       └── 📁 status/
│   │   │           └── 📄 route.js
│   │   ├── 📁 cart/
│   │   │   └── 📄 route.js
│   │   ├── 📁 payments/
│   │   │   ├── 📄 route.js
│   │   │   ├── 📁 stripe/
│   │   │   │   └── 📄 route.js
│   │   │   └── 📁 sslcommerz/
│   │   │       └── 📄 route.js
│   │   ├── 📁 upload/
│   │   │   └── 📄 route.js
│   │   └── 📁 reviews/
│   │       └── 📄 route.js
│   │
│   ├── 📄 layout.js
│   ├── 📄 page.js
│   ├── 📄 loading.jsx
│   ├── 📄 error.js
│   ├── 📄 ClientLayout.js
│   └── 📄 globals.css
│
├── 📁 actions/
│   ├── 📁 auth/
│   │   ├── 📄 loginUser.js
│   │   ├── 📄 RegisterUser.js
│   │   └── 📄 RegisterRestaurant.js
│   ├── 📁 orders/
│   │   ├── 📄 createOrder.js
│   │   ├── 📄 updateStatus.js
│   │   └── 📄 cancelOrder.js
│   ├── 📁 cart/
│   │   ├── 📄 addToCart.js
│   │   ├── 📄 updateCart.js
│   │   └── 📄 clearCart.js
│   └── 📁 payments/
│       ├── 📄 createPayment.js
│       └── 📄 verifyPayment.js
│
├── 📁 components/
│   ├── 📁 ui/
│   │   ├── 📄 Navbar.jsx
│   │   ├── 📄 Footer.jsx
│   │   ├── 📄 AdminNav.jsx
│   │   ├── 📄 RestaurantNav.jsx
│   │   ├── 📄 UserNav.jsx
│   │   ├── 📄 ThemeToggle.jsx
│   │   ├── 📄 SearchBar.jsx
│   │   └── 📄 LoadingSpinner.jsx
│   │
│   ├── 📁 restaurant/
│   │   ├── 📄 RestaurantCard.jsx
│   │   ├── 📄 RestaurantList.jsx
│   │   ├── 📄 RestaurantDetail.jsx
│   │   └── 📄 SearchFilters.jsx
│   │
│   ├── 📁 menu/
│   │   ├── 📄 FoodCard.jsx
│   │   ├── 📄 MenuCategory.jsx
│   │   ├── 📄 MenuList.jsx
│   │   └── 📄 FoodModal.jsx
│   │
│   ├── 📁 cart/
│   │   ├── 📄 CartItem.jsx
│   │   ├── 📄 CartSidebar.jsx
│   │   ├── 📄 CartSummary.jsx
│   │   └── 📄 CartBadge.jsx
│   │
│   ├── 📁 orders/
│   │   ├── 📄 OrderCard.jsx
│   │   ├── 📄 OrderList.jsx
│   │   ├── 📄 OrderDetail.jsx
│   │   ├── 📄 OrderTracking.jsx
│   │   └── 📄 StatusBadge.jsx
│   │
│   ├── 📁 checkout/
│   │   ├── 📄 CheckoutForm.jsx
│   │   ├── 📄 PaymentMethod.jsx
│   │   ├── 📄 AddressForm.jsx
│   │   └── 📄 OrderSummary.jsx
│   │
│   ├── 📁 forms/
│   │   ├── 📄 RestaurantForm.jsx
│   │   ├── 📄 MenuItemForm.jsx
│   │   ├── 📄 AddressForm.jsx
│   │   └── 📄 ReviewForm.jsx
│   │
│   └── 📄 VideoPlayer.jsx (for restaurant promos)
│
├── 📁 hooks/
│   ├── 📄 use-cart.js
│   ├── 📄 use-orders.js
│   ├── 📄 use-restaurants.js
│   ├── 📄 use-auth.js
│   └── 📄 use-mobile.js
│
├── 📁 lib/
│   ├── 📄 authOptions.js
│   ├── 📄 dbconnect.js
│   ├── 📄 utils.js
│   ├── 📄 stripe.js
│   ├── 📄 sslcommerz.js
│   └── 📄 validations.js
│
├── 📁 store/ (Zustand stores)
│   ├── 📄 cart-store.js
│   ├── 📄 auth-store.js
│   ├── 📄 restaurant-store.js
│   └── 📄 ui-store.js
│
├── 📁 providers/
│   └── 📄 NextAuthProvider.jsx
│
├── 📁 assets/
│   ├── 📁 images/
│   │   ├── 📁 restaurants/
│   │   ├── 📁 foods/
│   │   └── 📁 icons/
│   └── 📁 promos/
│
├── 📁 middleware/
│   └── 📄 auth.js
│
├── 📄 components.json
├── 📄 next.config.mjs
├── 📄 postcss.config.mjs
├── 📄 eslint.config.mjs
├── 📄 jsconfig.json
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 README.md
└── 📄 .env.local










# Install authentication and database packages
npm install next-auth bcrypt mongodb
npm install -D @types/bcrypt

# Install shadcn/ui components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add separator
npx shadcn@latest add spinner
npx shadcn@latest add dropdown-menu

# Install additional useful packages
npm install lucide-react sweetalert2
npm install -D @types/sweetalert2