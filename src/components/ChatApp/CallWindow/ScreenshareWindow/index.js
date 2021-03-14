import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getStreams } from "../../../../actions/calls";
import OutgoingCallSound from "../../../../assets/sounds/outgoingcall.mp3";
import peerManger from "../../../../peerManager";
import socketManager from "../../../../socketManager";
import "./index.scss";
class index extends Component {
  call;
  stream;
  constructor(props) {
    super(props);
    this.state = {
      showControls: false,
    };
  }
  onUnload = async (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  componentDidMount = async () => {
    window.addEventListener("beforeunload", this.onUnload);
    if (this.props.callDetails.incomingCall) {
      this.playVideoStream(this.props.callDetails.remoteStream);
    } else {
      let screenCapStream = await this.captureScreen();
      let micCapture = await this.captureMic();
      this.stream = await this.combineStreams(screenCapStream, micCapture);
      setTimeout(() => {
        this.startCall(this.stream);
      }, 1000);
    }
  };
  componentWillUnmount = () => {
    window.removeEventListener("beforeunload", this.onUnload);
    if (this.stream)
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
  };
  captureScreen = async () => {
    return new Promise(async (resolve, reject) => {
      let captureStream = null;
      try {
        captureStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: "always",
          },
          audio: false,
        });
        captureStream.getVideoTracks()[0].onended = () => {
          this.endCall();
        };
      } catch (err) {
        this.endCall();
        reject(err);
      }
      resolve(captureStream);
    });
  };
  playVideoStream = (remoteStream) => {
    this.mainVideoPlayer.srcObject = remoteStream;
    this.mainVideoPlayer.muted = false;
    this.mainVideoPlayer.play();
  };
  playAudioStream = (remoteStream) => {
    this.audioPlayer.pause();
    this.audioPlayer.src = null;
    this.audioPlayer.srcObject = remoteStream;
    this.audioPlayer.play();
  };
  startCall = async (stream) => {
    let callWithId = this.props.callDetails.callWith._id;
    this.audioPlayer.src = OutgoingCallSound;
    this.audioPlayer.loop = true;
    let peer = await peerManger.getInstance();
    if (peer) {
      this.audioPlayer.play();
      this.call = peer.call(callWithId, stream);
      this.call.on("stream", (remoteStream) => {
        this.props.getStreams({ remoteStream, myStream: stream });
        this.playAudioStream(remoteStream);
      });
    }
  };
  endCall = async () => {
    if (this.mainVideoPlayer) this.mainVideoPlayer.pause();
    if (this.audioPlayer) this.audioPlayer.pause();
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
  captureMic = async () => {
    return new Promise(async (resolve, reject) => {
      let audioStream = null;
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
      } catch (err) {
        reject(err);
      }
      resolve(audioStream);
    });
  };
  combineStreams = async (screenCapStream, micCapture) => {
    return new Promise(async (resolve, reject) => {
      let finalStream = new MediaStream();
      const videoTrack = screenCapStream.getVideoTracks()[0];
      finalStream.addTrack(videoTrack);
      let audioTrack = micCapture.getAudioTracks()[0];
      finalStream.addTrack(audioTrack);

      resolve(finalStream);
    });
  };
  render() {
    if (!this.props.callDetails.incomingCall)
      return (
        <div className="screenshare__container">
          <audio
            ref={(ref) => {
              this.audioPlayer = ref;
            }}
          />
          <div className="screenshare__header">
            {this.props.callDetails.callStatus === 0
              ? "Sending screenshare request to"
              : "You are sharing screen with "}
          </div>

          <div
            className={
              "screenshare__data" +
              (this.props.callDetails.callStatus === 1
                ? " screenshare__data-inCall"
                : "")
            }
          >
            <div
              className={
                "screenshare__data-img-container" +
                (this.props.callDetails.callStatus === 1
                  ? " screenshare__data-img-container-inCall"
                  : " screenshare__data-img-container-ringing")
              }
            >
              <div
                className={
                  "screenshare__data-img" +
                  (this.props.callDetails.callStatus === 1
                    ? " screenshare__data-img-inCall"
                    : "")
                }
              >
                <img
                  src={
                    this.props.callDetails.callWith.pfpLink ||
                    "https://res.cloudinary.com/jblaze2908/image/upload/v1614540131/default.png"
                  }
                  alt=""
                />
              </div>
            </div>
            <div
              className={
                "screenshare__data-name" +
                (this.props.callDetails.callStatus === 1
                  ? " screenshare__data-name-inCall"
                  : "")
              }
            >
              {this.props.callDetails.callWith.name}
            </div>
          </div>
          {this.props.callDetails.callStatus === 1 ? (
            <div className="screenshare__banner">You are sharing screen</div>
          ) : (
            ""
          )}
          <div className="screenshare__btns">
            <button
              className={
                "screenshare__btns-endcall" +
                (this.props.callDetails.callStatus === 2
                  ? " screenshare__btns-endcall-animation"
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
    else
      return (
        <div
          className="screenshare__container"
          onMouseLeave={this.hideControls}
          onMouseEnter={this.showControls}
        >
          <div className="screenshare__video-container">
            <video
              ref={(ref) => {
                this.mainVideoPlayer = ref;
              }}
              onEnded={() => {}}
            />
          </div>
          <div
            className={
              "screenshare__btns-overlay" +
              (this.state.showControls ||
              this.props.callDetails.callStatus === 0
                ? " screenshare__btns-visible"
                : " screenshare__btns-hidden")
            }
          >
            <button
              className={
                "screenshare__btns-endcall" +
                (this.props.callDetails.callStatus === 2
                  ? " screenshare__btns-endcall-animation"
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
    userInfo: state.userInfo,
    callDetails: state.callDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getStreams }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
