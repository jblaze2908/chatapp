import React, { Component } from "react";
import Header from "./Header";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import WelcomeMsg from "./WelcomeMsg";
import socketManager from "../../../../socketManager";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  sendMessage,
  newMessageReceived,
  messagesRead,
  messagesReadClient,
} from "../../../../actions/chats";
import "./index.scss";
import Axios from "axios";
import { apiUrl } from "../../../../config";
class index extends Component {
  socket;
  constructor(props) {
    super(props);
    this.state = {
      img: "",
      dragging: false,
      imgLink: "",
      imgBtnStatus: "Send",
    };
  }
  manageSocket = async () => {
    this.socket = await socketManager.getInstance();
    this.socket.on("newMessage", (message, senderDetails) => {
      this.props.newMessageReceived({
        message,
        senderDetails,
      });
    });
    this.socket.on("messagesRead", (by, time) => {
      this.props.messagesRead({ by, time });
    });
  };
  componentDidMount = async () => {
    this.dragCounter = 0;
    this.manageSocket();
  };
  componentDidUpdate = (prevProps) => {
    if (this.props.userInfo.socketId !== prevProps.userInfo.socketId) {
      this.manageSocket();
    }
  };
  sendMessage = (message, imgLink) => {
    let chatWith =
      this.props.chats[this.props.activeChatIndex].participant1._id === "" ||
      this.props.chats[this.props.activeChatIndex].participant1._id ===
        this.props.userInfo._id
        ? this.props.chats[this.props.activeChatIndex].participant2
        : this.props.chats[this.props.activeChatIndex].participant1;

    let messageDetails = {
      text: message,
      imgLink: imgLink,
      to: chatWith._id,
    };
    this.socket.emit("sendMessage", messageDetails, (response) => {
      if (response.status === 200) {
        this.props.sendMessage(response);
      }
    });
  };
  sendAttachment = () => {
    if (this.state.imgBtnStatus === "Sending") return;
    if (!this.state.imgLink) return;
    if (this.state.imgLink && !this.state.img) {
      this.sendMessage(null, this.state.imgLink);
      this.setState({ imgLink: "" });
      return;
    }
    this.setState({ imgBtnStatus: "Sending" });
    let chatWith =
      this.props.chats[this.props.activeChatIndex].participant1._id === "" ||
      this.props.chats[this.props.activeChatIndex].participant1._id ===
        this.props.userInfo._id
        ? this.props.chats[this.props.activeChatIndex].participant2
        : this.props.chats[this.props.activeChatIndex].participant1;
    let data = new FormData();
    data.append("img", this.state.img);
    data.append("to", chatWith._id);
    Axios.post(apiUrl + "chat/upload_attachment", data, {
      headers: { authorization: this.props.userInfo.token },
    }).then((res) => {
      if (res.status === 200) {
        this.props.sendMessage(res.data);
        this.setState({ img: "", imgLink: "", imgBtnStatus: "Send" });
      }
    });
  };
  setMessagesAsRead = (client) => {
    if (!this.socket) return;
    let chatWith =
      this.props.chats[this.props.activeChatIndex].participant1._id === "" ||
      this.props.chats[this.props.activeChatIndex].participant1._id ===
        this.props.userInfo._id
        ? this.props.chats[this.props.activeChatIndex].participant2
        : this.props.chats[this.props.activeChatIndex].participant1;
    this.props.messagesReadClient({
      by: chatWith._id,
      userId: this.props.userInfo._id,
      time: new Date(),
    });
    this.socket.emit("setMessagesAsRead", chatWith._id, (response) => {
      if (response.status === 200) {
      }
    });
  };
  attachImg = (data) => {
    let { img, imgLink } = data;
    this.setState({
      img,
      imgLink,
    });
  };
  removeAttachment = (data) => {
    this.setState({
      img: "",
      imgLink: "",
    });
  };
  handleDrag = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  };
  handleDragIn = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragCounter++;
    if (evt.dataTransfer.items && evt.dataTransfer.items.length > 0) {
      this.setState({ dragging: true });
    }
  };
  handleDragOut = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter > 0) return;
    this.setState({ dragging: false });
  };
  handleDrop = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.setState({ dragging: false });
    if (evt.dataTransfer.files && evt.dataTransfer.files.length > 0) {
      let files = evt.dataTransfer.files;
      let img = files[0];

      if (img.type.includes("image")) {
        let imgLink = await this.toBase64(img);
        this.attachImg({ img, imgLink });
      }
      evt.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };
  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  render() {
    return (
      <div
        className={
          "chatbox__container" +
          (this.props.open ? " chatbox__container-opensm" : "")
        }
        ref={(ref) => {
          this.dropRef = ref;
        }}
        onDragEnter={this.handleDragIn}
        onDragLeave={this.handleDragOut}
        onDragOver={this.handleDrag}
        onDrop={this.handleDrop}
      >
        {this.props.activeChatIndex !== -1 ? (
          <React.Fragment>
            {this.state.dragging ? (
              <div className="chatbox__dragoverlay">Drop image</div>
            ) : (
              ""
            )}
            <Header
              startCall={this.props.startCall}
              chatThread={this.props.chats[this.props.activeChatIndex]}
              userId={this.props.userInfo._id}
              showRecents={this.props.showRecents}
            />
            <Messages
              chatThread={this.props.chats[this.props.activeChatIndex]}
              userId={this.props.userInfo._id}
              userPfp={this.props.userInfo.pfpLink}
              imgLink={this.state.imgLink}
              removeAttachment={this.removeAttachment}
              sendAttachment={this.sendAttachment}
              imgBtnStatus={this.state.imgBtnStatus}
              setMessagesAsRead={this.setMessagesAsRead}
            />
            <ChatInput
              sendMessage={this.sendMessage}
              attachImg={this.attachImg}
            />
          </React.Fragment>
        ) : (
          <WelcomeMsg />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    chats: state.chats,
    activeChatIndex: state.activeChatIndex,
    userInfo: state.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { sendMessage, newMessageReceived, messagesRead, messagesReadClient },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
