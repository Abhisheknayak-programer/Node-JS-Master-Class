import React from "react";

const Signup = () => {
  return (
    <div className="login-form">
      <h2 className="heading-secondary ma-bt-lg">Create your account!</h2>
      <form className="form form--signup">
        <div className="form__group">
          <label className="form__label" for="name">
            Your name
          </label>
          <input
            className="form__input"
            id="name"
            type="text"
            placeholder=""
            required=""
          />
        </div>
        <div className="form__group">
          <label className="form__label" for="email">
            Email address
          </label>
          <input
            className="form__input"
            id="email"
            type="email"
            placeholder="you@example.com"
            required=""
          />
        </div>
        <div className="form__group ma-bt-md">
          <label className="form__label" for="password">
            Password
          </label>
          <input
            className="form__input"
            id="password"
            type="password"
            placeholder="••••••••"
            required=""
            minlength="8"
          />
        </div>
        <div className="form__group ma-bt-md">
          <label className="form__label" for="passwordConfirm">
            Confirm password
          </label>
          <input
            className="form__input"
            id="passwordConfirm"
            type="password"
            placeholder="••••••••"
            required=""
            minlength="8"
          />
        </div>
        <div className="form__group">
          <button className="btn btn--green">Sign up</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
