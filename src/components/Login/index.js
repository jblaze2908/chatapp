import React, { Component } from "react";
import LoginWindow from "./LoginWindow";
import SignUpWindow from "./SignUpWindow";
import { login } from "../../actions/userInfo";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./index.scss";
import socketManager from "../../socketManager";
import peerManager from "../../peerManager";
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountPresent: true,
    };
  }
  toggleLogin = () => {
    this.setState({
      accountPresent: !this.state.accountPresent,
    });
  };
  login = async (data) => {
    let socket = await socketManager.connect(data.token);
    peerManager.connect(data.data._id);
    this.props.login({
      ...data.data,
      socketId: socket.id,
      token: data.token,
    });
    this.props.fetchChats(data.token);
  };
  render() {
    return (
      <div className="login__page">
        <LoginWindow
          open={this.state.accountPresent}
          toggleLogin={this.toggleLogin}
          login={this.login}
        />
        <SignUpWindow
          open={!this.state.accountPresent}
          toggleLogin={this.toggleLogin}
          login={this.login}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      login,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
