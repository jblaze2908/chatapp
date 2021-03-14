import React, { Component } from "react";
import RecentChats from "./RecentChats";
import ChatBox from "./ChatBox";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setChatAsActive } from "../../../actions/chats";
import MyAccountDialog from "../../Common/MyAccountDialog";
import "./index.scss";
class index extends Component {
  showRecents = () => {
    this.props.setChatAsActive(-1);
  };
  render() {
    return (
      <div
        className={
          "chatapp__container" +
          (this.props.mode === "chat" || this.props.mode === "default"
            ? " chatapp__container-open"
            : " chatapp__container-close")
        }
      >
        <RecentChats
          closed={this.props.mode === "call"}
          open={this.props.activeChatIndex === -1}
        />
        <ChatBox
          startCall={this.props.startCall}
          showRecents={this.showRecents}
          open={this.props.activeChatIndex !== -1}
        />
        <MyAccountDialog />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    activeChatIndex: state.activeChatIndex,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setChatAsActive }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
