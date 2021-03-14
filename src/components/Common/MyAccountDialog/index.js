import React, { Component } from "react";
import ReactModal from "react-modal";
import Axios from "axios";
import { apiUrl } from "../../../config";
import "./index.scss";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { hideAccountDialog } from "../../../actions/dialogFlags";
import { updateProfile } from "../../../actions/userInfo";
let status = 0; //1 if uploading
class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overlayText: "Change",
    };
  }

  pickImg = () => {
    if (this.state.overlayText === "Change") this.fileUploader.click();
  };
  attachFile = async (evt) => {
    let file = evt.target.files[0];
    if (file) {
      this.setState({ overlayText: "Uploading" });
      this.fileUploader.value = null;
      let data = new FormData();
      data.append("pfp", file);
      Axios.post(apiUrl + "user/update_profile", data, {
        headers: {
          authorization: this.props.userInfo.token,
        },
      }).then((res) => {
        if (res.status === 200) {
          let img = new Image();
          img.src = res.data.pfpLink;
          this.props.updateProfile({
            pfpLink: res.data.pfpLink,
          });
        }
      });
    }
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.userInfo.pfpLink !== this.props.userInfo.pfpLink)
      this.setState({ overlayText: "Change" });
  };
  render() {
    return (
      <ReactModal
        isOpen={this.props.dialogFlags.showAccountDialog}
        className="myaccount__modal"
        overlayClassName="myaccount__overlay"
        onRequestClose={this.props.hideAccountDialog}
        ariaHideApp={false}
      >
        <div className="myaccount__container">
          <div className="myaccount__img-container">
            <div className="myaccount__img-img">
              <img src={this.props.userInfo.pfpLink} alt="" />
              <div className="myaccount__img-overlay" onClick={this.pickImg}>
                {this.state.overlayText}
              </div>
            </div>
          </div>
          <div className="myaccount__name">{this.props.userInfo.name}</div>
          <div className="myaccount__email">{this.props.userInfo.email}</div>
        </div>
        <input
          type="file"
          style={{ position: "absolute", opacity: 0, zIndex: "-222" }}
          id="file"
          ref={(ref) => {
            this.fileUploader = ref;
          }}
          name=""
          accept=".png,.jpeg,.jpg"
          onChange={this.attachFile}
        />
      </ReactModal>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    dialogFlags: state.dialogFlags,
    userInfo: state.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ hideAccountDialog, updateProfile }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
