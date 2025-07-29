# 🫖 TEA  
_No secret is safe — spill it all, anytime, anywhere._

![TEA Banner](./src/assets/logo_big.png) <!-- Replace with actual banner/logo path if needed -->

---

## 🚀 Overview  
**TEA** is a modern, secure, and real-time chat application designed for seamless conversations.  
Whether it's private messaging or casual chit-chat, TEA makes communication effortless and fun.  

- 💬 **Real-Time Messaging** – Instant, reliable chat powered by sockets.  
- 🔒 **OTP-Based Authentication** – Verify your email and keep your account secure.  
- 🖼️ **Media Support** – Share images, docs, and PDFs with ease.  
- 🟢 **Online Status Tracking** – Know who’s active in real-time.  
- 🎨 **Beautiful UI** – A sleek, responsive design with blur effects and dark mode vibes.  

---

## ✨ Features  
- 🔑 **Secure Login & Sign-Up with OTP Verification** (real Gmail integration)  
- 📜 **User Profiles** with bio customization  
- 🟢 **Online/Offline Indicators**  
- 🖼️ **Image & Document Sharing** (JPG, PNG, PDF, etc.)  
- 📨 **Instant Messaging with Read & Unseen Counts**  
- 🔔 **Real-Time Notifications for New Messages**  
- 📱 **Mobile-Friendly Responsive Design**  

---

## 🛠️ Tech Stack  
### **Frontend**  
- ⚛️ [React.js](https://react.dev/) with Hooks & Context API  
- 🎨 [Tailwind CSS](https://tailwindcss.com/) for styling  
- 🔥 React Hot Toast for notifications  

### **Backend**  
- 🟢 [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)  
- 📦 MongoDB with Mongoose for database  
- ✉️ Nodemailer for Gmail OTP verification  
- 🔗 Socket.IO for real-time communication  

---

## 📷 Screenshots  

### 💻 Login & OTP Verification  
![Login Page](./screenshots/login.png)

### 💬 Chat Interface  
![Chat Interface](./screenshots/chat.png)

---

## 🚦 Getting Started  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/your-username/tea.git
cd tea
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev
