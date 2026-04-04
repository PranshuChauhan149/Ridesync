# 🚗 RideSync

A full-stack **Vehicle Booking Platform** with real-time live tracking, secure Video KYC, and seamless partner onboarding built using Next.js and MongoDB.

---

## ✨ Features

### 👤 User Side

* User authentication (Login / Signup)
* Book rides easily
* Real-time vehicle tracking
* Ride history

### 🚕 Partner (Driver) Side

* Multi-step onboarding system:

  * Vehicle details
  * Document upload (Aadhar, RC, License)
  * Bank & payout setup
* Go online/offline
* Accept ride requests
* Earnings tracking

### 🧑‍💼 Admin Panel

* Verify driver documents
* Approve / reject onboarding
* Monitor rides and users

---

## ⚡ Tech Stack

### Frontend

* Next.js (App Router)
* React.js
* Tailwind CSS
* Framer Motion

### Backend

* Node.js (via Next.js API routes)
* MongoDB + Mongoose

### Realtime

* Socket.IO (for live tracking)

### Cloud & Integrations

* Cloudinary (image uploads)
* ZEGOCLOUD (Video KYC)

---

## 🏗️ Project Structure

```
ridesync/
│
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── models/              # Mongoose models
├── lib/                 # DB & utility functions
├── api/                 # API routes
├── public/              # Static assets
└── styles/              # Global styles
```

---



## 🔄 Core Flow

```
User → Book Ride → Find Driver → Ride Start → Live Tracking → Ride Complete
```

```
Driver → Onboarding → Document Upload → Admin Approval → Go Online → Accept Ride
```

---

## 📸 Screenshots (Add Later)

* Onboarding UI
* Live tracking map
* Booking screen
* Admin dashboard

---

## 🧠 Future Enhancements

* 💳 Payment integration (Stripe / Razorpay)
* 📍 Advanced map routing
* ⭐ Rating & review system
* 📊 Analytics dashboard
* 🔔 Push notifications

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a PR

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Pranshu Chauhan**

---

## 🌟 Show Your Support

If you like this project, give it a ⭐ on GitHub!
