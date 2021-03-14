import React, { Component } from "react";
import MenuBtn from "./MenuBtn";
import "./index.scss";
export default class index extends Component {
  getIconName = (type) => {
    if (type === "search") return "search";
    if (type === "add") return "plus";
    if (type === "phone") return "phone-alt";
    if (type === "video") return "video";
    if (type === "screenshare") return "desktop";
    if (type === "menu") return "ellipsis-v";
    if (type === "call") return "mobile-alt";
    if (type === "back") return "arrow-left";
  };
  render() {
    let iconName = this.getIconName(this.props.type);
    if (this.props.type === "menu")
      return (
        <MenuBtn
          style={this.props.style}
          additionalStyle={{ ...this.props.additionalStyle }}
        />
      );
    else
      return (
        <button
          className={
            "chatboxbtn" +
            (this.props.style === "dark" ? " chatboxbtn-dark" : "")
          }
          style={{ ...this.props.additionalStyle }}
          onClick={this.props.onClick}
        >
          <i className={"fas fa-" + iconName} />
        </button>
      );
  }
}
