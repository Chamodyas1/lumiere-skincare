
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LumiChatbot from './components/LumiChatbot';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';

import Login from './pages/Login';
import UserLogin from './pages/UserLogin';
import Register from './pages/Register';

import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';

import PrivateRoute from './components/PrivateRoute';
import SkinTypeQuiz from './pages/SkinTypeQuiz';
import RoutineFinder from './pages/RoutineFinder';
import ProductComparison from './pages/ProductComparison';
import MyAccount from './pages/MyAccount';
const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/login" element={<Login />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/skin-quiz" element={<SkinTypeQuiz />} />
          <Route path="/routine-finder" element={<RoutineFinder />} />
          <Route path="/compare" element={<ProductComparison />} />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
  path="/my-account"
  element={
    <PrivateRoute>
      <MyAccount />
    </PrivateRoute>
  }
/>
          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly={true}>
                <Admin />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />

      <LumiChatbot />
    </BrowserRouter>
  );
};

export default App;
