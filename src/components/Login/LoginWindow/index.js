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
      errorMsg: "",
      btnText: "Login",
    };
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.open !== this.props.open) {
      this.setState({
        showPassword: false,
        email: "",
        password: "",
        errorMsg: "",
        btnText: "Login",
      });
    }
  };
  toggleShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };
  handleFormInput = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };
  login = () => {
    if (this.state.email === "" || this.state.password === "") return;
    this.setState({
      errorMsg: "",
      btnText: "Logging In...",
    });
    let { email, password } = this.state;
    Axios.post(apiUrl + "user/login", { email, password })
      .then((res) => {
        if (res.status === 200) {
          this.props.login(res.data);
        }
        if (res.status !== 200)
          this.setState({ errorMsg: res.data.message, btnText: "Login" });
      })
      .catch((err) => {
        this.setState({
          errorMsg: err.response.data.message,
          btnText: "Login",
        });
      });
  };
  render() {
    return (
      <div
        className={
          "login__container" +
          (this.props.open
            ? " login__container-open"
            : " login__container-closed")
        }
      >
        <div className="login__content">
          <div className="login__subtitle">WELCOME BACK</div>
          <div className="login__title">Log into your Account</div>
          <div className="login__form">
            <label className="login__form-label">E-mail</label>
            <div className="login__form-textfield-container">
              <input
                type="text"
                className="login__form-textfield"
                placeholder="Enter your E-mail"
                name="email"
                onChange={this.handleFormInput}
                value={this.state.email}
              />
            </div>
            <label className="login__form-label">Password</label>
            <div className="login__form-textfield-container">
              <input
                type={this.state.showPassword ? "text" : "password"}
                className="login__form-textfield"
                placeholder="Enter your password"
                name="password"
                onChange={this.handleFormInput}
                value={this.state.password}
              />
              <div
                className="login__form-textfield-btn"
                onClick={this.toggleShowPassword}
              >
                <i
                  className={
                    "far fa-eye" + (this.state.showPassword ? " " : "-slash")
                  }
                />
              </div>
            </div>
          </div>
          <button className="login__btn" onClick={this.login}>
            {this.state.btnText}
          </button>
          <div className="login__subtext" onClick={this.props.toggleLogin}>
            Not registered yet? Register →
          </div>
          {this.state.errorMsg ? (
            <div className="login__status">{this.state.errorMsg}</div>
          ) : null}
        </div>
      </div>
    );
  }
}
