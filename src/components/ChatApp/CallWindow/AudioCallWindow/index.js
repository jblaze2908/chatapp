import React, { Component } from "react";
import peerManger from "../../../../peerManager";
import socketManager from "../../../../socketManager";
import OutgoingCallSound from "../../../../assets/sounds/outgoingcall.mp3";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getStreams } from "../../../../actions/calls";
import "./index.scss";
class index extends Component {
  timerTimeout = null;
  call;
  stream;
  constructor(props) {
    super(props);
    this.state = {
      timer: { minutes: 0, seconds: -1 },
    };
  }

  onUnload = (e) => {
    e.preventDefault();
    e.returnValue = "";
    socketManager.reconnect(this.props.userInfo.token);
  };
  componentDidMount = async () => {
    window.addEventListener("beforeunload", this.onUnload);
    if (this.props.callDetails.callStatus !== 1) {
      let constraints = { audio: true, video: false };
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia ||
        navigator.oGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          constraints,
          this.handleAudioStream,
          this.audioError
        );
      }
    } else {
      this.startTimer();
      this.playAudioStream(this.props.callDetails.remoteStream);
    }
  };
  componentWillUnmount = () => {
    window.removeEventListener("beforeunload", this.onUnload);
    if (this.stream)
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
  };
  handleAudioStream = (stream) => {
    this.stream = stream;
    setTimeout(() => {
      this.startCall(stream);
    }, 1000);
  };
  audioError = (error) => {};
  playAudioStream = (remoteStream) => {
    this.audioPlayer.pause();
    this.audioPlayer.src = null;
    this.audioPlayer.srcObject = remoteStream;
    this.audioPlayer.muted = false;
    this.audioPlayer.play();
  };
  startCall = async (stream) => {
    let callWithId = this.props.callDetails.callWith._id;
    this.audioPlayer.src = OutgoingCallSound;
    this.audioPlayer.muted = false;
    this.audioPlayer.loop = true;
    let peer = await peerManger.getInstance();
    if (peer) {
      this.audioPlayer.play();
      this.call = peer.call(callWithId, stream);
      this.call.on("stream", (remoteStream) => {
        this.startTimer();
        this.props.getStreams({ remoteStream, myStream: stream });
        this.playAudioStream(remoteStream);
      });
    }
  };
  endCall = async () => {
    this.audioPlayer.pause();
    if (this.props.call) this.props.call.close();
    else if (this.call) this.call.close();
    let socket = await socketManager.getInstance();
    socket.emit("endCall", this.props.callDetails._id, (response) => {});
    clearTimeout(this.timerTimeout);
    this.props.endCall();
  };
  startTimer = () => {
    let seconds = this.state.timer.seconds + 1;
    let minutes = this.state.timer.minutes;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    this.setState({
      timer: {
        minutes,
        seconds,
      },
    });
    this.timerTimeout = setTimeout(() => {
      this.startTimer();
    }, 1000);
  };

  render() {
    return (
      <div className="audiocall__container">
        <div className="audiocall__header">
          <div className="audiocall__header-text">
            {this.props.callDetails.callStatus === 0 ? "Calling" : "Voice Call"}
          </div>
          <div className="audiocall__header-callwith">
            {this.props.callDetails.callWith.name}
          </div>
        </div>
        <div
          className={
            "audiocall__img-supercontainer" +
            (this.props.callDetails.callStatus === 1
              ? " audiocall__img-supercontainer-incall"
              : "")
          }
        >
          <div
            className={
              "audiocall__img-container" +
              (this.props.callDetails.callStatus === 1
                ? " audiocall__img-container-incall"
                : "") +
              (this.props.callDetails.callStatus === 2
                ? " audiocall__img-container-callend"
                : "")
            }
          >
            <div
              className={
                "audiocall__img" +
                (this.props.callDetails.callStatus === 1
                  ? " audiocall__img-incall"
                  : "")
              }
            >
              <audio
                ref={(ref) => {
                  this.audioPlayer = ref;
                }}
              />
              <img
                src={
                  this.props.callDetails.callWith.pfpLink ||
                  "https://res.cloudinary.com/jblaze2908/image/upload/v1614540131/default.png"
                }
                alt=""
              />
            </div>
          </div>
          {this.props.callDetails.callStatus > 0 ? (
            <div
              className={
                "audiocall__calltimer-container" +
                (this.props.callDetails.callStatus === 2
                  ? " audiocall__calltimer-container-callend"
                  : "")
              }
            >
              <div className="audiocall__calltimer">
                {(("" + this.state.timer.minutes).length === 1
                  ? "0" + this.state.timer.minutes
                  : this.state.timer.minutes) +
                  " : " +
                  (("" + this.state.timer.seconds).length === 1
                    ? "0" + this.state.timer.seconds
                    : this.state.timer.seconds)}
              </div>
            </div>
          ) : null}
        </div>
        <div className="audiocall__btns">
          <button
            className={
              "audiocall__btns-endcall" +
              (this.props.callDetails.callStatus === 2
                ? " audiocall__btns-endcall-animation"
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
