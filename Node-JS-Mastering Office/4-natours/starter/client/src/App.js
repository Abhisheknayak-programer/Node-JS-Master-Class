import React from "react";
import { Routes, Route } from "react-router-dom";
import "./style.css";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import AllTours from "./Components/AllTours/AllTours";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import Tour from "./Components/Tour/Tour";
import Profile from "./Components/Profile/Profile";

const App = () => {
  window.API_URL = "http://127.0.0.1:5000";

  return (
    <React.Fragment>
      <Header />

      <main className="main">
        <Routes>
          <Route element={<AllTours />} path="/" />
          <Route element={<Tour />} path="/tour/:id" />
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
          <Route element={<Profile />} path="/me" />
        </Routes>
      </main>

      <Footer />
    </React.Fragment>
  );
};

export default App;
