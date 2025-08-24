# 🚀 BidPreacher  
*A zero-cost connector e-commerce storefront hosted on GitHub Pages*

---

## 🌐 Overview  
**BidPreacher** is not a traditional e-commerce site. It doesn’t process payments or hold inventory.  
Instead, it acts as a **connector**: when a buyer clicks **Buy Now**, their request is instantly forwarded to the owner via **WhatsApp** or **Email**. The owner then connects the buyer with the seller offline.  

This approach keeps the platform **100% free**, **static**, and **privacy-first** — built entirely with **HTML + CSS + vanilla JavaScript**, deployable on **GitHub Pages** with no backend.  

---

## ✨ Key Features  

- 🛍️ **Product Showcase**  
  - Product cards with image, title, description, price, rating  
  - Responsive grid layout with search & filters  
  - Like ❤️ toggle with persistence in `localStorage`  

- 🛒 **Cart & Checkout**  
  - Add to Cart, adjust quantities, remove items  
  - Slide-in cart drawer with subtotal  
  - Persisted in `localStorage`  

- ⚡ **Buy Flow**  
  - Buy Now opens a secure buyer form modal  
  - Collects name, phone, email, address, city, state, pincode, and notes  
  - Validation for email, phone, and required fields  
  - Generates:
    - **WhatsApp deeplink** → `https://wa.me/<phone>?text=<encodedPayload>`  
    - **mailto link** → Pre-filled with structured request  
  - Confirmation screen with **Send via WhatsApp**, **Send via Email**, and **Copy Details**  

- 🔍 **Discovery & Engagement**  
  - Search bar + category filter  
  - Sorting: Popular (likes), New, Price ↑/↓  
  - Featured categories section  
  - “How It Works” explainer (Discover → Request → Connect)  

- 📦 **Seller Onboarding CTA**  
  - Mini form for sellers to submit product leads  
  - Uses same WhatsApp/Email bridge  

- 📱 **Experience & Accessibility**  
  - Mobile-first, fully responsive  
  - Keyboard-navigable modals and drawers  
  - Accessible labels, roles, and focus states  
  - Respects `prefers-reduced-motion`  

- 🔒 **Privacy & Legal**  
  - Clear note: “No online payments. We only connect you with sellers.”  
  - Static Privacy Policy and Terms pages  

- 🌱 **Free & Lightweight**  
  - Hosted on GitHub Pages  
  - No server, no paid APIs  
  - Assets from Unsplash / Picsum (credited)  

---

## 🗂 Project Structure
