# Lumière Skincare 🌿

A modern skincare e-commerce web application designed to help users explore skincare products, manage their shopping experience, and receive AI-powered skincare guidance.

## ✨ Features

- **User Authentication** – User registration and login.
- **Product Catalogue** – Browse skincare products and view product details.
- **Product Filtering** – Filter products by category and explore available items.
- **Shopping Cart** – Add products to the cart and manage quantities.
- **Wishlist** – Save favourite skincare products.
- **Checkout** – Complete the checkout process.
- **Order Management** – View customer orders.
- **Admin Dashboard** – Manage products and administrative tasks.
- **AI Skincare Chatbot** – Receive skincare information and general product guidance.
- **Responsive User Interface** – A clean and elegant design for a better shopping experience.

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- React Router
- Axios
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer

### AI Integration
- Google Gemini API

## 📁 Project Structure

```text
lumiere-skincare/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB
- Git

A Google Gemini API key is required for AI features that use Gemini.

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Chamodyas1/lumiere-skincare.git
cd lumiere-skincare
```

### 2. Install Dependencies

Install the root project dependencies if applicable:

```bash
npm install
```

Install the frontend dependencies:

```bash
cd frontend
npm install
```

Install the backend dependencies:

```bash
cd ../backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Add the environment variables required by your backend configuration. For example:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/lumiere_skincare
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Use the exact variable names expected by your existing backend code. Never upload real API keys, database credentials, or secrets to GitHub.

### 4. Start MongoDB

Make sure your MongoDB service is running and the database connection details match your backend configuration.

### 5. Start the Backend

From the `backend` directory, run:

```bash
npm run dev
```

If your backend does not have a `dev` script, use the start command defined in its `package.json`.

### 6. Start the Frontend

Open a separate terminal and run:

```bash
cd frontend
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔐 Security Notes

- Keep `.env` files out of version control.
- Never expose API keys or JWT secrets in frontend code.
- Use secure passwords and appropriate authentication practices.
- Configure production environment variables before deployment.

## 🎯 Project Objective

Lumière Skincare aims to provide a convenient online skincare shopping experience by combining product discovery, e-commerce functionality, and AI-powered skincare assistance in one platform.

## 👩‍💻 Author

Developed as a web application project.

## 📄 License

This project is intended for educational and development purposes unless otherwise specified.
