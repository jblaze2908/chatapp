import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setChatAsActive, addNewChat } from "../../../../actions/chats";
import ReactModal from "react-modal";
import ChatBoxBtn from "../../../Common/ChatBoxButton";
import NewChat from "./NewChat";
import dateFunctions from "../../../../helperFunctions/date";
import "./index.scss";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openNewChat: false,
      chats: [],
    };
    this.dateFunctions = new dateFunctions();
  }
  openNewChat = () => {
    this.setState({ openNewChat: true });
  };
  closeNewChat = () => {
    this.setState({ openNewChat: false });
  };
  formatDate = (date) => {
    let displayDate = this.dateFunctions.getDisplayDate(date);
    if (displayDate === "today")
      return this.dateFunctions.getFormattedTime(date);
    else if (displayDate === "yesterday") return "Yesterday";
    else return displayDate;
  };
  addChat = (data) => {
    this.setState({ openNewChat: false });
    this.props.addNewChat(data);
  };
  getNumOfUnreadMsg = (chats, userId) => {
    let count = 0;
    for (let i = chats.length; i--; i >= 0) {
      if (!chats[i].readAt && chats[i].to === userId) {
        count++;
      } else break;
    }
    return count;
  };
  componentDidMount() {
    this.sortChatsAccordingToMostRecent();
  }
  sortChatsAccordingToMostRecent = () => {
    let array = [...this.props.chats];
    array.sort((a, b) => {
      if (a.messages.length === 0) return -1;
      else if (b.messages.length === 0) return 1;
      let lastMsgA = a.messages[a.messages.length - 1];
      let lastMsgB = b.messages[b.messages.length - 1];

      return (
        new Date(lastMsgB.sentAt).getTime() -
        new Date(lastMsgA.sentAt).getTime()
      );
    });

    this.setState({
      chats: array,
    });
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.chats !== this.props.chats) {
      this.sortChatsAccordingToMostRecent();
    }
  };
  render() {
    return (
      <div
        className={
          "recentchats__container" +
          (this.props.open ? " recentchats__container-opensm" : "")
        }
      >
        <div className="recentchats__header">
          <div
            className={
              "recentchats__header-text" +
              (this.props.closed ? " recentchats__header-text-shifted" : "")
            }
          >
            Recent
          </div>
          <div className="recentchats__header-btns">
            {/* <ChatBoxBtn type="search" /> */}
            <ChatBoxBtn
              type="add"
              onClick={this.openNewChat}
              additionalStyle={{ marginLeft: ".75rem" }}
            />
          </div>
        </div>
        <div
          className={
            "recentchats__chats" +
            (this.props.closed ? " recentchats__chats-closed" : "")
          }
        >
          {this.state.chats.map((chat, index) => {
            let chatWith =
              chat.participant1._id === "" ||
              chat.participant1._id === this.props.userInfo._id
                ? chat.participant2
                : chat.participant1;
            let lastMsg =
              chat.messages.length !== 0
                ? chat.messages[chat.messages.length - 1]
                : { text: "" };
            let unreadMsgCount = this.getNumOfUnreadMsg(
              chat.messages,
              this.props.userInfo._id
            );
            return (
              <div
                className="recentchats__chat"
                key={chat._id}
                onClick={() => {
                  let index = this.props.chats.findIndex(
                    (a) => a._id === chat._id
                  );
                  this.props.setChatAsActive(index);
                }}
              >
                <div className="recentchats__chat-img">
                  <img
                    src={
                      chatWith.pfpLink
                        ? chatWith.pfpLink
                        : "https://res.cloudinary.com/jblaze2908/image/upload/v1614540131/default.png"
                    }
                    alt=""
                  />
                </div>
                <div
                  className={
                    "recentchats__chat-data" +
                    (this.props.closed ? " recentchats__chat-data-closed" : "")
                  }
                >
                  <div className="recentchats__chat-data-name">
                    {chatWith.name}
                    {unreadMsgCount > 0 && (
                      <div className="recentchats__chat-data-unreadmsg">
                        {unreadMsgCount}
                      </div>
                    )}
                  </div>
                  {!lastMsg.text && !lastMsg.imgLink ? null : (
                    <div className="recentchats__chat-data-msg">
                      <div className="recentchats__chat-data-msg-text">
                        {lastMsg.text
                          ? lastMsg.text
                          : lastMsg.imgLink
                          ? "Image"
                          : ""}
                      </div>
                      <div className="recentchats__chat-data-msg-time">
                        {lastMsg.sentAt &&
                          this.formatDate(new Date(lastMsg.sentAt))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <ReactModal
          isOpen={this.state.openNewChat}
          onRequestClose={this.closeNewChat}
          overlayClassName="searchuser__overlay"
          className="searchuser__modal"
          ariaHideApp={false}
        >
          <NewChat token={this.props.userInfo.token} addChat={this.addChat} />
        </ReactModal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    chats: state.chats,
    userInfo: state.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setChatAsActive, addNewChat }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
