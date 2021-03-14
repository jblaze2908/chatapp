import React, { Component } from "react";
import ChatWindow from "./ChatWindow";
import CallWindow from "./CallWindow";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  prefetchCallData,
  getStreams,
  startCall,
  endCall,
} from "../../actions/calls";
import peerManager from "../../peerManager";
import socketManager from "../../socketManager";
import "./index.scss";
class index extends Component {
  socket;
  constructor(props) {
    super(props);
    this.state = {
      call: "",
      remoteStream: "",
    };
  }
  manageSocket = async () => {
    this.socket = await socketManager.getInstance();
    this.socket.on("newCall", (savedCall, callWith) => {
      this.props.prefetchCallData({
        _id: savedCall._id,
        callType: savedCall.callType, //0 - Audio, 1 - Video, 2 - Screenshare
        callStatus: -1, // 0 - Ringing, 1 - in Call, 2- Ended
        incomingCall: true,
        callWith: {
          _id: callWith._id,
          name: callWith.name,
          pfpLink: callWith.pfpLink,
        },
      });
    });
    this.socket.on("callEnded", () => {
      this.endCall();
    });
  };
  managePeer = async () => {
    let peer = await peerManager.getInstance();
    peer.on("call", (call) => {
      this.setState({ call: call });
      if (this.props.callDetails.callStatus === -1)
        this.props.startCall({
          ...this.props.callDetails,
          callStatus: 0, //-1-prefetched data, 0 - Ringing, 1 - in Call, 2- Ended
        });
      call.on("close", () => {});
      call.on("disconnect", () => {});
      call.on("error", (err) => {});
    });
  };
  componentDidMount = async () => {
    this.manageSocket();
    this.managePeer();
  };
  componentDidUpdate = (prevProps) => {
    if (this.props.userInfo.socketId !== prevProps.userInfo.socketId) {
      this.manageSocket();
    }
  };
  pickUpCall = (myStream) => {
    this.state.call.answer(myStream);
    this.state.call.on("stream", (remoteStream) => {
      this.props.getStreams({ remoteStream, myStream });
    });
  };

  //status - 1 - start call, 2 - end call
  informCallParticipant = (status, callType, callWithId) => {
    return new Promise(async (resolve, reject) => {
      if (status === 1) {
        let socket = await socketManager.getInstance();
        socket.emit("startCall", callWithId, callType, (response) => {
          resolve(response);
        });
      }
    });
  };
  startCall = async (data) => {
    let res = await this.informCallParticipant(
      1,
      data.callType,
      data.callWith._id
    );
    this.props.startCall({
      _id: res._id,
      ...data,
      remoteStream: "",
      myStream: "",
    });
  };
  endCall = () => {
    if (this.state.call) this.setState({ call: "" });
    let myStream = this.props.callDetails.myStream;
    if (myStream && myStream.getTracks)
      myStream.getTracks().forEach((track) => {
        track.stop();
      });
    this.props.endCall();
  };
  render() {
    return (
      <div className="chatapp__page">
        {this.props.chatsLoaded ? (
          <React.Fragment>
            <ChatWindow mode={this.props.chatMode} startCall={this.startCall} />
            <CallWindow
              pickUpCall={this.pickUpCall}
              endCall={this.endCall}
              call={this.state.call}
            />
          </React.Fragment>
        ) : (
          "Loading..."
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    chatsLoaded: state.chatsLoaded,
    chatMode: state.chatMode,
    callDetails: state.callDetails,
    userInfo: state.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { startCall, endCall, getStreams, prefetchCallData },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
