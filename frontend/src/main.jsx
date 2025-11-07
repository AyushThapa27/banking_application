import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./landingPage/Navbar.jsx";
import Footer from "./landingPage/Footer.jsx";

import Home from "./landingPage/home/Home.jsx";
import About from "./landingPage/about/About.jsx";
import Transaction from "./landingPage/transaction/Transaction.jsx";
import Login from "./landingPage/login/Login.jsx";
import UserForm from "./landingPage/createUser/UserForm.jsx";
import NotFound from "./landingPage/NotFound.jsx";
import AccountForm from "./landingPage/createUser/AccountForm.jsx";
import ShowUser from "./landingPage/home/ShowUser.jsx";
import Profile from "./landingPage/home/Profile.jsx";
import ShowTransaction from "./landingPage/home/ShowTransaction.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createUser" element={<UserForm />} />
        <Route path="/create/accForm" element={<AccountForm />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/show-user" element={<ShowUser />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/transactions/:accountId" element={<ShowTransaction />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
);
