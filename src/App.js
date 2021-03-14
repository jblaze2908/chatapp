import React, { Component } from "react";
import ChatApp from "./components/ChatApp";
import Login from "./components/Login";
import NewAcStep from "./components/NewAcStep";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { logout } from "./actions/userInfo";
import { fetchChats } from "./actions/chats";
import socketManager from "./socketManager";
import peerManager from "./peerManager";
import Axios from "axios";
import { apiUrl } from "./config";
import "./App.scss";
class App extends Component {
  socket;
  initSocket = async () => {
    this.socket = await socketManager.getInstance();

    this.socket.on("sessionExpired", () => {
      peerManager.destroy();
      socketManager.destroy();
      this.props.logout();
      alert("Session Expired");
    });
  };
  componentDidMount = async () => {
    if (this.props.userInfo.token && !socketManager.getInstanceAsync()) {
      await socketManager.connect(this.props.userInfo.token);
      this.initSocket();
    }
    if (this.props.userInfo.token && !peerManager.getInstanceAsync()) {
      await peerManager.connect(this.props.userInfo._id);
    }
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.userInfo.socketId !== this.props.userInfo.socketId) {
      if (this.props.userInfo.socketId === "") this.socket = null;
      else this.initSocket();
    }
  };
  fetchChats = (token) => {
    Axios.get(apiUrl + "user/fetch_chats", {
      headers: {
        authorization: token,
      },
    }).then((res) => {
      this.props.fetchChats(res.data.chats);
    });
  };
  render() {
    if (!this.props.userInfo.token) {
      return <Login fetchChats={this.fetchChats} />;
    } else if (!this.props.userInfo.name) {
      return <NewAcStep />;
    } else return <ChatApp />;
  }
}
const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchChats, logout }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
