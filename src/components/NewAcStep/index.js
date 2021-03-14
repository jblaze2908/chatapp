import React, { Component } from "react";
import Axios from "axios";
import { apiUrl } from "../../config/index";
import { updateProfile } from "../../actions/userInfo";
import "./index.scss";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imgLink: "",
      img: "",
      fullName: "",
      btnText: "Continue",
    };
  }
  pickImg = () => {
    this.fileUploader.click();
  };
  attachFile = async (evt) => {
    let file = evt.target.files[0];
    if (file) {
      let dataUrl = await this.toBase64(file);
      this.setState({ img: file, imgLink: dataUrl });
    }
  };
  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  handleInputChange = (evt) => {
    this.setState({
      fullName: evt.target.value,
    });
  };
  updateProfile = () => {
    if (this.state.fullName === "") return;
    let data = new FormData();
    data.append("name", this.state.fullName);
    if (this.state.img) data.append("pfp", this.state.img);
    this.setState({
      btnText: "Saving...",
    });
    Axios.post(apiUrl + "user/update_profile", data, {
      headers: {
        authorization: this.props.userInfo.token,
      },
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.pfpLink)
          data = {
            name: res.data.name,
            pfpLink: res.data.pfpLink,
          };
        else data = { name: res.data.name };
        this.props.updateProfile(data);
      }
    });
  };
  render() {
    return (
      <div className="signupstep__page">
        <div className="signupstep__container">
          <div className="signupstep__image" onClick={this.pickImg}>
            {this.props.userInfo.pfpLink || this.state.imgLink
              ? ""
              : "Upload Img"}
            {this.props.userInfo.pfpLink || this.state.imgLink ? (
              <img
                src={this.state.imgLink || this.props.userInfo.pfpLink}
                alt=""
              />
            ) : (
              ""
            )}
          </div>
          <div className="signupstep__form">
            <label className="signupstep__form-label">Full Name</label>
            <div className="signupstep__form-textfield-container">
              <input
                type="text"
                className="signupstep__form-textfield"
                placeholder="Enter Full Name"
                name="full name"
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <button className="signupstep__btn" onClick={this.updateProfile}>
            {this.state.btnText}
          </button>
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
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateProfile,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
