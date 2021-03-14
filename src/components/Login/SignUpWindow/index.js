import React, { Component } from "react";
import Axios from "axios";
import { apiUrl } from "../../../config";

import "./index.scss";
export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassword: false,
      email: "",
      password: "",
      passwordre: "",
      errorMsg: "",
      btnText: "Sign Up",
    };
  }

  handleFormInput = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };
  signUp = () => {
    let { email, password, passwordre } = this.state;
    if (email === "" || password === "" || passwordre === "") return;
    if (password !== passwordre) {
      this.setState({
        errorMsg: "Passwords do not match.",
      });
      return;
    }
    this.setState({
      errorMsg: "",
      btnText: "Signing Up...",
    });
    Axios.post(apiUrl + "user/register", { email, password })
      .then((res) => {
        if (res.status === 200) {
          this.props.login(res.data);
        }
        if (res.status !== 200)
          this.setState({ errorMsg: res.data.message, btnText: "Sign Up" });
      })
      .catch((err) => {
        this.setState({
          errorMsg: err.response.data.message,
          btnText: "Sign Up",
        });
      });
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.open !== this.props.open) {
      this.setState({
        showPassword: false,
        email: "",
        password: "",
        passwordre: "",
        errorMsg: "",
        btnText: "Sign Up",
      });
    }
  };
  toggleShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };
  render() {
    return (
      <div
        className={
          "signup__container" +
          (this.props.open
            ? " signup__container-open"
            : " signup__container-closed")
        }
      >
        <div className="signup__content">
          <div className="signup__subtitle">WELCOME</div>
          <div className="signup__title">Register your Account</div>
          <div className="signup__form">
            <label className="signup__form-label">E-mail</label>
            <div className="signup__form-textfield-container">
              <input
                type="text"
                className="signup__form-textfield"
                placeholder="Enter your E-mail"
                name="email"
                onChange={this.handleFormInput}
                value={this.state.email}
              />
            </div>
            <label className="signup__form-label">Password</label>
            <div className="signup__form-textfield-container">
              <input
                type={this.state.showPassword ? "text" : "password"}
                className="signup__form-textfield"
                placeholder="Enter your password"
                name="password"
                onChange={this.handleFormInput}
                value={this.state.password}
              />
              <div
                className="signup__form-textfield-btn"
                onClick={this.toggleShowPassword}
              >
                <i
                  className={
                    "far fa-eye" + (this.state.showPassword ? " " : "-slash")
                  }
                />
              </div>
            </div>
            <label className="signup__form-label">Confirm Password</label>
            <div className="signup__form-textfield-container">
              <input
                type="password"
                className="signup__form-textfield"
                placeholder="Reenter your password"
                name="passwordre"
                onChange={this.handleFormInput}
                value={this.state.passwordre}
              />
            </div>
          </div>
          <button className="signup__btn" onClick={this.signUp}>
            {this.state.btnText}
          </button>
          <div className="signup__subtext" onClick={this.props.toggleLogin}>
            Already registered? Login →
          </div>{" "}
          {this.state.errorMsg ? (
            <div className="signup__status">{this.state.errorMsg}</div>
          ) : null}
        </div>
      </div>
    );
  }
}
