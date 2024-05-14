import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link className="nav__el" to="/">
          ALL TOURS
        </Link>
      </nav>
      <div className="header__logo">
        <img src="../img/logo-white.png" alt="logo" />
      </div>
      <nav className="nav nav--user">
        <Link className="nav__el" to="/login">
          LOGIN
        </Link>
        <Link className="nav__el nav__el--cta" to="/signup">
          SIGN UP
        </Link>
      </nav>
    </header>
  );
};

export default Header;
