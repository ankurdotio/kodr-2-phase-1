import { BrowserRouter, Routes, Route } from 'react-router-dom';

import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import SellerLogin from './pages/SellerLogin';
import SellerRegister from './pages/SellerRegister';
import Home from './pages/Home';
import SellerDashboard from './pages/SellerDashboard';
import SellerProductCreate from './pages/SellerProductCreate';
import ProductDetails from './pages/ProductDetails';
import AppLayout from './layouts/AppLayout';
import './App.css'

function App() {


  return (
   <BrowserRouter>
      <Routes>
        {/* Auth routes (outside layout if desired) */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/register" element={<SellerRegister />} />

        {/* App layout with role-based nav */}
        <Route element={<AppLayout />}> 
          <Route path="/home" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/products/create" element={<SellerProductCreate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
