import axios from "axios";
import React, { useRef, useState } from "react";

const Login = () => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const emailRef = useRef();
  const passwordRef = useRef();

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      console.log(emailRef.current.value, passwordRef.current.value);
      const res = await axios.post(`${window.API_URL}/api/v1/users/login`, {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      // console.log(res.data.data);
      // console.log(res.data.token);
      setUser(res.data.data);
      setUserToken(res.data.token);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <div className="login-form">
      <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
      <form className="form form--login">
        <div className="form__group">
          <label className="form__label" htmlFor="email">
            Email address
          </label>
          <input
            className="form__input"
            id="email"
            type="email"
            placeholder="you@example.com"
            required=""
            ref={emailRef}
          />
        </div>
        <div className="form__group ma-bt-md">
          <label className="form__label" htmlFor="password">
            Password
          </label>
          <input
            className="form__input"
            id="password"
            type="password"
            placeholder="••••••••"
            required=""
            minLength="8"
            ref={passwordRef}
          />
        </div>
        <div className="form__group">
          <button className="btn btn--green" onClick={loginHandler}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
