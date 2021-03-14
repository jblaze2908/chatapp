import React, { Component } from "react";
import ChatBoxButton from "../../../../Common/ChatBoxButton";
import socketManager from "../../../../../socketManager";
import dateFunctions from "../../../../../helperFunctions/date";
import "./index.scss";
let interval;
const isMobile = () => {
  let check = true;
  if (navigator.mediaDevices) check = false;
  return check;
};
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastSeenText: "",
      showCallBtns: false,
    };
    this.dateFunctions = new dateFunctions();
  }
  componentWillUnmount = () => {
    clearInterval(interval);
  };
  toggleCallBtns = () => {
    this.setState({ showCallBtns: !this.state.showCallBtns });
  };
  startCall = (type) => {
    //type = 0 - Audio, 1 - Video, 2 - Screenshare
    let chatWith =
      this.props.chatThread.participant1._id === "" ||
      this.props.chatThread.participant1._id === this.props.userId
        ? this.props.chatThread.participant2
        : this.props.chatThread.participant1;
    this.props.startCall({
      callType: type,
      callStatus: 0,
      incomingCall: false,
      callWith: {
        _id: chatWith._id,
        name: chatWith.name,
        pfpLink: chatWith.pfpLink,
      },
      remoteStream: "",
      myStream: "",
    });
  };
  getLastSeen = async () => {
    let chatWith =
      this.props.chatThread.participant1._id === "" ||
      this.props.chatThread.participant1._id === this.props.userId
        ? this.props.chatThread.participant2
        : this.props.chatThread.participant1;
    let socket = await socketManager.getInstance();
    if (!socket) return;
    socket.emit("getLastSeen", chatWith._id, (response) => {
      if (response.status === 200) {
        if (response.data.online) {
          if (this.state.lastSeenText !== "Online")
            this.setState({
              lastSeenText: "Online",
            });
        } else {
          let text = "";
          let lastSeenDate = response.data.lastSeen;
          let displayDate = this.dateFunctions.getDisplayDate(lastSeenDate);
          if (displayDate === "today")
            text =
              "Last seen today at " +
              this.dateFunctions.getFormattedTime(lastSeenDate);
          else if (displayDate === "yesterday")
            text =
              "Last seen yesterday at " +
              this.dateFunctions.getFormattedTime(lastSeenDate);
          else
            text =
              "Last seen on " + this.dateFunctions.getDisplayDate(lastSeenDate);
          if (this.state.lastSeenText !== text)
            this.setState({
              lastSeenText: text,
            });
        }
      }
    });
  };
  componentDidMount = () => {
    this.getLastSeen();
    interval = setInterval(this.getLastSeen, 10000);
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.chatThread._id !== this.props.chatThread._id)
      this.setState({ lastSeenText: "" });
    clearInterval(interval);
    setTimeout(this.getLastSeen, 1000);
    interval = setInterval(this.getLastSeen, 10000);
  };
  render() {
    let chatWith =
      this.props.chatThread.participant1._id === "" ||
      this.props.chatThread.participant1._id === this.props.userId
        ? this.props.chatThread.participant2
        : this.props.chatThread.participant1;
    return (
      <div className="chatboxheader__container">
        <div className="chatboxheader__userdata-container">
          <div className="chatboxheader__userdata-sm">
            <ChatBoxButton
              type="back"
              style="dark"
              onClick={this.props.showRecents}
            />
          </div>
          <div className="chatboxheader__userdata">
            <div className="chatboxheader__userdata-img">
              <img
                src={
                  chatWith.pfpLink
                    ? chatWith.pfpLink
                    : "https://res.cloudinary.com/jblaze2908/image/upload/v1614540131/default.png"
                }
                alt=""
              />
            </div>
            <div className="chatboxheader__userdata-details">
              <div className="chatboxheader__userdata-details-name">
                {chatWith.name}
              </div>
              <div className="chatboxheader__userdata-details-lastseen">
                {this.state.lastSeenText}
              </div>
            </div>
          </div>
        </div>

        <div className="chatboxheader__btns">
          <div className="chatboxheader__btns-sm">
            <ChatBoxButton
              type="call"
              style="dark"
              onClick={() => this.toggleCallBtns()}
            />
            <div
              className={
                "chatboxheader__btns-sm-btns" +
                (this.state.showCallBtns
                  ? " chatboxheader__btns-sm-btns-open"
                  : "")
              }
            >
              {" "}
              <ChatBoxButton
                type="call"
                style="dark"
                onClick={() => this.toggleCallBtns()}
              />
              <ChatBoxButton
                type="phone"
                style="dark"
                onClick={() => this.startCall(0)}
                additionalStyle={{ marginTop: "0.5rem" }}
              />
              <ChatBoxButton
                type="video"
                style="dark"
                onClick={() => this.startCall(1)}
                additionalStyle={{ marginTop: "0.5rem" }}
              />
              {isMobile() ? (
                ""
              ) : (
                <ChatBoxButton
                  type="screenshare"
                  style="dark"
                  onClick={() => this.startCall(2)}
                  additionalStyle={{ marginTop: "0.5rem" }}
                />
              )}
            </div>
          </div>
          <span className="chatboxheader__btns-lg">
            <ChatBoxButton
              type="phone"
              style="dark"
              onClick={() => this.startCall(0)}
            />
            <ChatBoxButton
              type="video"
              style="dark"
              onClick={() => this.startCall(1)}
              additionalStyle={{ marginLeft: "1rem" }}
            />
            {isMobile() ? (
              ""
            ) : (
              <ChatBoxButton
                type="screenshare"
                style="dark"
                onClick={() => this.startCall(2)}
                additionalStyle={{ marginLeft: "1rem" }}
              />
            )}
          </span>
          <ChatBoxButton
            type="menu"
            style="dark"
            additionalStyle={{ marginLeft: "1rem" }}
          />
        </div>
      </div>
    );
  }
}
