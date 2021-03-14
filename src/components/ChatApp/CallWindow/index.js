import React, { Component } from "react";
import IncomingCall from "./IncomingCall";
import AudioCallWindow from "./AudioCallWindow";
import VideoCallWindow from "./VideoCallWindow";
import ScreenshareWindow from "./ScreenshareWindow";
import { connect } from "react-redux";
import "./index.scss";
class index extends Component {
  render() {
    return (
      <div
        className={
          "callwindow__container" +
          (this.props.mode === "chat" || this.props.mode === "default"
            ? this.props.mode === "default"
              ? ""
              : " callwindow__container-close"
            : " callwindow__container-open")
        }
      >
        {this.props.callDetails.callStatus === 0 &&
        this.props.callDetails.incomingCall ? (
          <IncomingCall
            call={this.props.call}
            pickUpCall={this.props.pickUpCall}
            endCall={this.props.endCall}
            callDetails={this.props.callDetails}
          />
        ) : null}
        {((this.props.callDetails.callStatus === 0 &&
          !this.props.callDetails.incomingCall) ||
          this.props.callDetails.callStatus > 0) &&
        this.props.callDetails.callType === 0 ? (
          <AudioCallWindow
            call={this.props.call}
            endCall={this.props.endCall}
          />
        ) : null}
        {((this.props.callDetails.callStatus === 0 &&
          !this.props.callDetails.incomingCall) ||
          this.props.callDetails.callStatus > 0) &&
        this.props.callDetails.callType === 1 ? (
          <VideoCallWindow
            call={this.props.call}
            endCall={this.props.endCall}
          />
        ) : null}
        {((this.props.callDetails.callStatus === 0 &&
          !this.props.callDetails.incomingCall) ||
          this.props.callDetails.callStatus > 0) &&
        this.props.callDetails.callType === 2 ? (
          <ScreenshareWindow
            call={this.props.call}
            endCall={this.props.endCall}
          />
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    callDetails: state.callDetails,
    mode: state.chatMode,
  };
};
export default connect(mapStateToProps)(index);
