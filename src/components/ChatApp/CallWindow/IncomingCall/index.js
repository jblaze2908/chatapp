import React, { Component } from "react";
import socketManager from "../../../../socketManager";

import IncomingCallAudio from "../../../../assets/sounds/incomingcall.mp3";
import "./index.scss";
export default class index extends Component {
  timeout;
  onUnload = async (e) => {
    e.preventDefault();
    e.returnValue = "";
    await socketManager.reconnect(this.props.userInfo.token);
  };
  componentDidMount = async () => {
    window.addEventListener("beforeunload", this.onUnload);
    this.audioPlayer.src = IncomingCallAudio;
    this.audioPlayer.muted = false;
    this.audioPlayer.loop = true;
    this.timeout = setTimeout(() => {
      this.audioPlayer.play();
    }, 1000);
  };
  componentWillUnmount = () => {
    window.removeEventListener("beforeunload", this.onUnload);
    clearTimeout(this.timeout);
    this.audioPlayer.pause();
  };
  pickUpCall = () => {
    let constraints;
    if (this.props.callDetails.callType === 1)
      constraints = { audio: true, video: { facingMode: "user" } };
    else constraints = { audio: true, video: false };
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.oGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        constraints,
        this.props.pickUpCall,
        this.streamError
      );
    }
  };
  endCall = async () => {
    this.audioPlayer.pause();
    this.props.call.close();
    let socket = await socketManager.getInstance();
    socket.emit("endCall", this.props.callDetails._id, (response) => {});
    this.props.endCall();
  };
  streamError = (e) => {};
  render() {
    return (
      <div className="incomingCall__container">
        <div className="incomingCall__header">
          {this.props.callDetails.callType === 0
            ? "Incoming Call from"
            : this.props.callDetails.callType === 1
            ? "Incoming Video Call from"
            : "Incoming Screenshare Request from"}
        </div>
        <div className="incomingCall__data">
          <div className="incomingCall__data-img-container">
            <div className="incomingCall__data-img">
              <img
                src={
                  this.props.callDetails.callWith.pfpLink ||
                  "https://res.cloudinary.com/jblaze2908/image/upload/v1614540131/default.png"
                }
                alt=""
              />
            </div>
          </div>
          <div className="incomingCall__data-name">
            {this.props.callDetails.callWith.name}
          </div>
        </div>
        <div className="incomingCall__btns">
          <button className="incomingCall__btns-reject" onClick={this.endCall}>
            <svg
              version="1.1"
              id="Layer_1"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 670.3 268.3"
              fill={"#FFFFFF"}
              style={{ enableBackground: "new 0 0 670.3 268.3;" }}
            >
              <path
                d="M89.2,264.9L202.5,220c9.9-4,16-14,15-24.6l-7.5-77.9c81.1-28.8,169.7-28.5,250.6,0.9l-8.1,77.9
	c-1.1,10.6,4.9,20.7,14.8,24.7l113,45.7c10.8,4.3,23.1,0.3,29.3-9.5l56.9-90.3c6-9.5,4.6-21.8-3.3-29.7
	C482.6-44.9,188.8-45.7,7.1,134.8c-7.9,7.9-9.4,20.2-3.5,29.7l56.3,90.7C66.1,265,78.4,269.1,89.2,264.9L89.2,264.9z"
              />
            </svg>
          </button>
          <button
            className="incomingCall__btns-accept"
            onClick={this.pickUpCall}
          >
            <div className="incomingCall__btns-accept-svg">
              <svg
                version="1.1"
                id="Layer_1"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 670.3 268.3"
                fill={"#FFFFFF"}
                style={{ enableBackground: "new 0 0 670.3 268.3;" }}
              >
                <path
                  d="M89.2,264.9L202.5,220c9.9-4,16-14,15-24.6l-7.5-77.9c81.1-28.8,169.7-28.5,250.6,0.9l-8.1,77.9
	c-1.1,10.6,4.9,20.7,14.8,24.7l113,45.7c10.8,4.3,23.1,0.3,29.3-9.5l56.9-90.3c6-9.5,4.6-21.8-3.3-29.7
	C482.6-44.9,188.8-45.7,7.1,134.8c-7.9,7.9-9.4,20.2-3.5,29.7l56.3,90.7C66.1,265,78.4,269.1,89.2,264.9L89.2,264.9z"
                />
              </svg>{" "}
            </div>
          </button>
        </div>
        <audio
          ref={(ref) => {
            this.audioPlayer = ref;
          }}
        />
      </div>
    );
  }
}
