# 📱 EcoResQ Mobile App (React Native + Expo)

EcoResQ Mobile brings smart food rescue to smartphones with real-time GPS tracking, camera-driven AI food freshness inspection, QR verification handshakes, and multilingual AI assistance.

---

## 🌟 Key Mobile Features

1. **Splash & Onboarding Screen** — Animated branding with immediate connectivity checking.
2. **Role-Based Auth & Switching** — Instant access for **Restaurants/Donors**, **NGOs/Shelters**, **Volunteers**, and **Admins**.
3. **Smart Food Donation Form** — Submit surplus listings with temperature monitoring, category selection, and instant AI Freshness analysis.
4. **AI Freshness & HACCP Assessment** — Powered by Gemini 3.6 Flash to inspect thermal decay, safety window, and remaining shelf life.
5. **Live GPS Radar & Routes** — Map showing donor pickups, active volunteer transit, and shelter drop-offs with optimal travel estimation.
6. **QR Handshake Scanner** — Secure contactless pickup confirmation and chain-of-custody verification.
7. **Multilingual AI Food Assistant** — Chatbot supporting English and Tamil (தமிழ்) for food safety regulations (FSSAI/HACCP).
8. **Real-time Carbon & Impact Analytics** — Track CO₂e emissions prevented, water conserved, and meals served.

---

## 🚀 Quick Start Instructions

### 1. Ensure Backend is Running
In the root directory of the project:
```bash
npm install
npm run dev
```
Backend API will run on `http://localhost:3000`.

---

### 2. Launch Mobile App with Expo
In a separate terminal, navigate to the `mobile` folder:
```bash
cd mobile
npm install
npx expo start
```

### Running on Devices:
- **Mobile Web Preview:** Press `w` in the terminal to view in browser.
- **Android Device / Emulator:** Press `a` or scan the Expo QR code using the **Expo Go** app on Android.
- **iOS Device / Simulator:** Press `i` or scan using Camera app on iPhone with **Expo Go** installed.
