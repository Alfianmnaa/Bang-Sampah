import React, { useContext, useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Navbar } from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext";
import Layanan from "./pages/Layanan";
import Jual from "./pages/Jual";
import { FaArrowUp } from "react-icons/fa6";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Beli from "./pages/Beli";
import Tentang from "./pages/Tentang";
import Detail from "./pages/Detail";
import { ScrollToTop } from "react-router-scroll-to-top";
import ProfileSettings from "./pages/ProfileSettings";
import Status from "./pages/Status";
import History from "./pages/History";

export default function App() {
  const { currentUser } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        if (window.scrollY > 580) {
          scrollRef.current.style.display = "flex";
        } else {
          scrollRef.current.style.display = "none";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/masuk" />;
  };

  return (
    <>
      <BrowserRouter>
        <ScrollToTop>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="masuk" element={<Login />} />
            <Route path="daftar" element={<Register />} />
            <Route path="layanan" element={<Layanan />} />
            <Route
              path="jual-sampah"
              element={
                <RequireAuth>
                  <Jual />
                </RequireAuth>
              }
            />
            <Route
              path="status"
              element={
                <RequireAuth>
                  <Status />
                </RequireAuth>
              }
            />
            <Route
              path="history"
              element={
                <RequireAuth>
                  <History />
                </RequireAuth>
              }
            />
            <Route
              path="profile-settings"
              element={
                <RequireAuth>
                  <ProfileSettings />
                </RequireAuth>
              }
            />
            <Route path="beli-sampah" element={<Beli />} />
            <Route
              path="dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route path="detail/:id" element={<Detail />} />
            <Route path="about" element={<Tentang />} />
          </Routes>
          <Footer />
        </ScrollToTop>
      </BrowserRouter>
      <a
        href="#header"
        id="scroll-up"
        onClick={scrollToTop}
        ref={scrollRef}
        className="scrollup w-12 h-12 justify-center items-center border border-white"
        style={{
          position: "fixed",
          bottom: "80px",
          right: "30px",
          zIndex: "9999",
          backgroundColor: "#318335",
          color: "#fff",
          borderRadius: "50%",
          textAlign: "center",
          lineHeight: "40px",
          cursor: "pointer",
          display: "none", // Initially hide the button
        }}
      >
        <FaArrowUp className="scrollup__icon text-2xl" />
      </a>
    </>
  );
}
