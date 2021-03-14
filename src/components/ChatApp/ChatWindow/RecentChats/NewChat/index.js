import React, { Component } from "react";
import Axios from "axios";
import { apiUrl } from "../../../../../config";
import "./index.scss";
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      email: "",
    };
  }
  showError = () => {
    this.setState({
      error: true,
    });
  };
  hideError = () => {
    this.setState({
      error: false,
    });
  };
  handleChange = (evt) => {
    this.setState({
      error: false,
      email: evt.target.value,
    });
  };
  searchUser = () => {
    Axios.get(apiUrl + "user/fetch_details_by_email/" + this.state.email, {
      headers: {
        authorization: this.props.token,
      },
    })
      .then((res) => {
        if (res.status === 200) this.props.addChat(res.data);
        else this.showError();
      })
      .catch((err) => {
        this.showError();
      });
  };
  render() {
    return (
      <div className="searchuser__container">
        <div className="searchuser__header">Add User</div>
        <div className="searchuser__form">
          <div
            className={
              "searchuser__form-textfield-container" +
              (this.state.error
                ? " searchuser__form-textfield-container-error"
                : "")
            }
          >
            <input
              type="text"
              placeholder="Enter Email of User"
              className="searchuser__form-textfield"
              onChange={this.handleChange}
            />
          </div>
          <button className="searchuser__btn" onClick={this.searchUser}>
            Search
          </button>
        </div>
      </div>
    );
  }
}
