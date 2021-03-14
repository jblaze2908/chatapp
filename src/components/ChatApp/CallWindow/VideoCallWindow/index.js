import React, { Component } from "react";
import peerManger from "../../../../peerManager";
import socketManager from "../../../../socketManager";
import OutgoingCallSound from "../../../../assets/sounds/outgoingcall.mp3";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getStreams } from "../../../../actions/calls";
import "./index.scss";
class index extends Component {
  call;
  stream;
  constructor(props) {
    super(props);
    this.state = {
      videoSrc: null,
      showControls: false,
    };
  }
  onUnload = async (e) => {
    e.preventDefault();
    e.returnValue = "";
    await socketManager.reconnect(this.props.userInfo.token);
  };
  componentDidMount = async () => {
    window.addEventListener("beforeunload", this.onUnload);
    let constraints = { audio: true, video: { facingMode: "user" } };
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.oGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        constraints,
        this.props.callDetails.callStatus !== 1
          ? this.handleVideoStream.bind(this, false)
          : this.handleVideoStream.bind(this, true),
        this.streamError
      );
    }
  };
  componentWillUnmount = () => {
    window.removeEventListener("beforeunload", this.onUnload);
    if (this.stream)
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
  };
  handleVideoStream = (playNow, stream) => {
    this.stream = stream;
    if (playNow) {
      this.playVideoStream(this.props.callDetails.remoteStream, stream);
    } else
      setTimeout(() => {
        this.startCall(stream);
      }, 1000);
  };

  streamError = (error) => {};

  playVideoStream = (remoteStream, stream) => {
    this.audioPlayer.pause();
    this.setState({ status: 1 }, () => {
      this.mainVideoPlayer.srcObject = remoteStream;
      this.mainVideoPlayer.muted = false;
      this.mainVideoPlayer.play();
      this.secondaryVideoPlayer.srcObject = stream;
      this.secondaryVideoPlayer.muted = true;
      this.secondaryVideoPlayer.play();
    });
  };
  startCall = async (stream) => {
    this.mainVideoPlayer.srcObject = stream;
    this.mainVideoPlayer.muted = true;
    this.mainVideoPlayer.play();
    let callWithId = this.props.callDetails.callWith._id;
    this.audioPlayer.src = OutgoingCallSound;
    this.audioPlayer.muted = false;
    this.audioPlayer.loop = true;
    let peer = await peerManger.getInstance();
    if (peer) {
      this.audioPlayer.play();
      this.call = peer.call(callWithId, stream);
      this.call.on("stream", (remoteStream) => {
        this.props.getStreams({ remoteStream, myStream: stream });
        this.playVideoStream(remoteStream, stream);
      });
    }
  };
  videoError = (error) => {};

  endCall = async () => {
    if (this.mainVideoPlayer) this.mainVideoPlayer.pause();
    if (this.secondaryVideoPlayer) this.secondaryVideoPlayer.pause();
    this.audioPlayer.pause();
    if (this.props.call) this.props.call.close();
    else if (this.call) this.call.close();
    let socket = await socketManager.getInstance();
    socket.emit("endCall", this.props.callDetails._id, (response) => {});
    this.props.endCall();
  };
  hideControls = () => {
    if (this.state.showControls)
      this.setState({
        showControls: false,
      });
  };
  showControls = () => {
    if (!this.state.showControls)
      this.setState({
        showControls: true,
      });
  };
  render() {
    return (
      <div
        className="videocall__container"
        onMouseLeave={this.hideControls}
        onMouseEnter={this.showControls}
      >
        {this.props.callDetails.callStatus === 0 ? (
          <div className="videocall__header">
            <div className="videocall__header-text">Video Calling</div>
            <div className="videocall__header-callwith">
              {this.props.callDetails.callWith.name}{" "}
            </div>
          </div>
        ) : null}
        <div className="videocall__video-container">
          <video
            ref={(ref) => {
              this.mainVideoPlayer = ref;
            }}
          />
          {this.props.callDetails.callStatus === 1 ? (
            <div className="videocall__smallvideo-container">
              <video
                ref={(ref) => {
                  this.secondaryVideoPlayer = ref;
                }}
              />
            </div>
          ) : null}
        </div>{" "}
        <div
          className={
            "videocall__btns" +
            (this.state.showControls || this.props.callDetails.callStatus === 0
              ? " videocall__btns-visible"
              : " videocall__btns-hidden")
          }
        >
          <button
            className={
              "videocall__btns-endcall" +
              (this.props.callDetails.callStatus === 2
                ? " videocall__btns-endcall-animation"
                : "")
            }
            onClick={this.endCall}
          >
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

const mapStateToProps = (state) => {
  return {
    callDetails: state.callDetails,
    userInfo: state.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getStreams }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
