# 💬 Realtime Chat App

A **production-ready real-time chat application** built with:
- **Node.js, Express** (Backend)
- **PostgreSQL** (Relational database)
- **Redis** (Caching & Presence & Socket Scaling)
- **Socket.IO** (Realtime messaging)
- **Google OAuth2 Login** (Secure authentication)
- **React + Tailwind** (Frontend)
- 

This project demonstrates **system design principles**, starting as a **Monolithic app** and evolving toward **Microservices**.

---

## 🚀 Features

- 🔐 **Authentication**: JWT & Google OAuth2 login
- 💬 **Realtime Messaging**: 1:1 chat with Socket.IO
- 👀 **User Presence**: Online/offline indicators
- 🗄️ **PostgreSQL**: Structured storage for users, messages, sessions
- ⚡ **Redis**: For caching and presence tracking
- 📱 **Responsive UI** with React & Tailwind
- 🧩 **Monolith → Microservices** migration plan
- 🔔 **Notifications** (Future: push + in-app)
- 🎥 **Video/Voice Calling** (Future: WebRTC)

---

## 🏗️ Tech Stack

| Layer        | Tech                                   |
|-------------|--------------------------------------|
| **Frontend** | React, TailwindCSS, ShadCN UI        |
| **Backend**  | Node.js, Express                     |
| **Database** | PostgreSQL (Prisma/Sequelize ORM)    |
| **Cache**    | Redis                                |
| **Auth**     | JWT + Google OAuth2 (Passport.js)    |
| **Realtime** | Socket.IO (WebSockets)               |
| **Deploy**   | Docker, Render/Vercel                |

---

## 📂 Project Structure

realtime-chat-app/
├── backend/
│ ├── src/
│ │ ├── config/ # DB & OAuth configs
│ │ ├── controllers/ # Route handlers
│ │ ├── middleware/ # Auth middleware
│ │ ├── models/ # Prisma/Sequelize models
│ │ ├── routes/ # Express routes
│ │ ├── services/ # Google OAuth services
│ │ └── sockets/ # Socket.IO events
├── frontend/ # React frontend
└── docs/ # Documentation