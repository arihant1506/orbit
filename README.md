# 🔄 Orbit 2.0: Real-Time Condition Monitoring & Data Analytics PWA

[![Live Demo](https://img.shields.io/badge/Live%20Demo-orbit--nine--woad.vercel.app-00E5FF?style=for-the-badge&logo=vercel)](https://orbit-nine-woad.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](#)
[![Framework](https://img.shields.io/badge/React_18-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](#)
[![Backend](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](#)
[![State Sync](https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](#)

**Orbit 2.0** is a high-performance Progressive Web App (PWA) engineered to demonstrate standardized software architecture and near-instantaneous state synchronization. By leveraging real-time WebSockets and a scalable cloud database, Orbit resolves data fragmentation and provides continuous condition monitoring across distributed client devices.

---

## 🔬 Abstract & Academic Relevance

While consumer-facing productivity applications rely on polling or local storage, Orbit 2.0 is built on a robust event-driven architecture. The system instantly synchronizes dynamic activity states across client interfaces with near-zero latency. 

This architecture acts as a foundational framework suitable for advanced engineering applications, specifically aligning with research in:
* **Standardised Software Architecture**
* **Digital Twin & Real-Time Condition Monitoring**
* **Distributed Data Analytics & High-Volume Data Visualization**
* **Secure State Management in Concurrent Systems**

---

## ⚙️ System Architecture

> *"EVENT-DRIVEN SYNCHRONIZATION: The client does not poll for data. PostgreSQL database mutations instantly broadcast via Supabase Real-Time channels, ensuring all connected clients reflect the exact same state synchronously."*

### The Execution Trace Pipeline

1.  **Client Mutation:** User interacts with the fluid UI to update a continuous data stream (e.g., activity toggle, throughput metric).
2.  **API Dispatch:** React state manages optimistic UI updates while simultaneously dispatching a secure RESTful payload to the backend.
3.  **Database Transaction:** PostgreSQL handles the transaction securely, validated against strict Row Level Security (RLS) policies based on the user's JWT.
4.  **WebSocket Broadcast:** The Supabase Real-Time engine detects the database mutation and broadcasts the payload via WebSockets to all subscribed clients.
5.  **State Reconciliation:** Distributed clients receive the WebSocket event and immediately reconcile their local React state, achieving near-instantaneous synchronization.

---

## 🛠️ Technical Stack

### **Frontend Interface (Fluid Visualization)**
* **Framework:** React.js, TypeScript, Vite
* **Styling:** Tailwind CSS (Custom "Liquid Glass" Visual Aesthetic)
* **Architecture:** Progressive Web App (PWA), Component-Based Rendering
* **Deployment:** Vercel (CI/CD Pipeline Integration)

### **Backend & State Orchestration**
* **Database:** PostgreSQL (Supabase)
* **Real-Time Sync:** WebSockets (Supabase Real-Time API)
* **Authentication:** Secure Email/Password & OAuth 2.0
* **Security:** Row Level Security (RLS), JWT Session Management

---

## 🔒 Security & Data Privacy

Orbit 2.0 enforces strict data isolation protocols suitable for enterprise-grade applications.
* **JWT Session Management:** All concurrent sessions are validated via JSON Web Tokens, mitigating cross-site scripting (XSS) and request forgery (CSRF).
* **Row Level Security (RLS):** Database tables are heavily gated. A user's throughput data and schedules are strictly isolated and mathematically impossible to query without their unique cryptographic token.

---

## 🚀 Local Installation & Setup

To run Orbit 2.0 locally to test its WebSocket synchronization:

### 1. Clone the Repository
```bash
git clone [https://github.com/arihant1506/Orbit-2.0.git](https://github.com/arihant1506/Orbit-2.0.git)
cd Orbit-2.0
