# 🌙 Saf - Mosque Community PWA

**Saf** is a premium, utilitarian Progressive Web App (PWA) designed to bridge the gap between mosques and their communities. Built with a focus on visual excellence and functional reliability, it provides essential spiritual tools and community utilities in one seamless interface.

![Saf Banner](https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop)

## 🚀 Key Features

### 🕌 Spiritual Utilities
- **Real-time Prayer Times**: Accurate timings based on the Aladhan API with automated "Next Prayer" countdowns.
- **Daily Inspirational**: A deterministic daily selection of Hadiths and quotes, ensuring every user sees the same inspiration each day.
- **Pustaka Doa**: A comprehensive library of situational prayers (harian, solat, Ramadan) with favoriting capabilities.
- **Qiyamullail Timer**: Dynamic countdown to the last third of the night for tahajjud.

### 👥 Community Hub
- **Lost & Found System**: A robust utility for reporting lost and found items within the mosque vicinity, featuring real-time Firebase Storage image uploads.
- **Mosque Activities**: A centralized calendar for lectures, classes, and special events.
- **Zakat Calculator**: Interactive drawer for calculating various types of Zakat with modern UI feedback.

### 📱 Premium PWA Experience
- **Safe Area UX**: Full support for iOS/Android physical safe areas (notch/dynamic island).
- **Offline Ready**: Optimized for quick loading and PWA installation.
- **Push Notifications**: Integrated with OneSignal for daily updates and activity reminders.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & DB**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Storage)
- **Notifications**: [OneSignal SDK](https://onesignal.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: Radix UI & Shadcn/ui

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/IrfanNG/Saf.git
   cd Saf
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file with your Firebase and OneSignal credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   ONESIGNAL_APP_ID=your_onesignal_id
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

Designed to be deployed on **Vercel**. Ensure all Environment Variables are mirrored in the Vercel Dashboard, especially `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` to avoid bucket initialization errors.

---

Built with 💚 by **KrackedDevs**
