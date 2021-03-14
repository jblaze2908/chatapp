import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  showAccountDialog,
  showLogoutDialog,
} from "../../../actions/dialogFlags";
import { logout } from "../../../actions/userInfo";
import Axios from "axios";
import { apiUrl } from "../../../config";
import socketManager from "../../../socketManager";
import peerManager from "../../../peerManager";
class MenuBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: false,
    };
  }
  handleClickOutside = (evt) => {
    if (
      this.state.openMenu &&
      !this.menu.contains(evt.target) &&
      !this.btn.contains(evt.target)
    ) {
      this.closeMenu();
    }
  };
  componentDidMount = () => {
    document.addEventListener("click", this.handleClickOutside);
  };
  componentWillUnmount = () => {
    document.removeEventListener("click", this.handleClickOutside);
  };
  openMenu = () => {
    this.setState({ openMenu: true });
  };
  closeMenu = () => {
    this.setState({ openMenu: false });
  };
  logout = () => {
    Axios.get(apiUrl + "user/logout", {
      headers: {
        authorization: this.props.userInfo.token,
      },
    })
      .then((res) => {
        socketManager.destroy();
        peerManager.destroy();
        this.props.logout();
      })
      .catch((e) => {
        socketManager.destroy();

        this.props.logout();
      });
  };
  render() {
    return (
      <button
        className={
          "chatboxbtn" + (this.props.style === "dark" ? " chatboxbtn-dark" : "")
        }
        style={{ ...this.props.additionalStyle }}
        onClick={this.openMenu}
        ref={(ref) => {
          this.btn = ref;
        }}
      >
        <i className={"fas fa-ellipsis-v"} />

        <div
          className={
            "chatboxbtn__menu-container" +
            (this.state.openMenu ? " chatboxbtn__menu-container-open" : "")
          }
          ref={(ref) => {
            this.menu = ref;
          }}
        >
          <div className="chatboxbtn__menu-items">
            <div className="chatboxbtn__menu-triangle" />
            <div
              className="chatboxbtn__menu-item"
              onClick={() => {
                this.closeMenu();
                this.props.showAccountDialog();
              }}
            >
              My Profile
            </div>
            <div
              className="chatboxbtn__menu-item"
              onClick={() => {
                // this.closeMenu();
                this.logout();
              }}
            >
              Logout
            </div>
          </div>
        </div>
      </button>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      showAccountDialog,
      showLogoutDialog,
      logout,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(MenuBtn);
