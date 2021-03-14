import React, { Component } from "react";
import ChatBoxButton from "../../../../Common/ChatBoxButton";
import "./index.scss";
export default class index extends Component {
  render() {
    return (
      <div className="chatboxwelcome__container">
        <div className="chatboxwelcome__btn">
          <ChatBoxButton type="menu" style="dark" />
        </div>
        <div className="chatboxwelcome__text-header">Welcome</div>
        <div className="chatboxwelcome__text-subtext">
          Open a chat to message and stay connected with your loved ones.
        </div>
      </div>
    );
  }
}
