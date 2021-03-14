import React, { Component } from "react";
import EmojiPicker from "emoji-picker-react";
import GifPicker from "../../../../Common/GifPicker";
import GifIcon from "../../../../../assets/imgs/gificon.png";
import "./index.scss";
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEmojiPicker: false,
      showGifPicker: false,
      message: "",
    };
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  handleClickOutside = (evt) => {
    if (!this.state.showEmojiPicker && !this.state.showGifPicker) return;
    if (
      this.emojiPicker &&
      this.state.showEmojiPicker &&
      !this.emojiPicker.contains(evt.target)
    ) {
      this.toggleEmojiPicker();
    } else if (
      this.gifPicker &&
      this.state.showGifPicker &&
      !this.gifPicker.contains(evt.target)
    ) {
      this.toggleGifPicker();
    }
  };
  toggleEmojiPicker = () => {
    this.setState({ showEmojiPicker: !this.state.showEmojiPicker });
  };
  toggleGifPicker = () => {
    this.setState({ showGifPicker: !this.state.showGifPicker });
  };
  selectEmoji = (evt, emojiObject) => {
    this.setState({
      message: this.state.message + emojiObject.emoji,
    });
    this.autosize({ target: this.messageInput });
  };
  handleInputChange = (evt) => {
    this.setState({
      message: evt.target.value,
    });
  };
  autosize = (evt) => {
    var el = this.messageInput;
    if (evt.keyCode === 13 && !evt.shiftKey) {
      this.sendMessage();
      evt.preventDefault();
    }
    setTimeout(function () {
      if (el.offsetHeight > 50 && el.scrollHeight > el.offsetHeight) return;
      el.style.cssText = "height:auto; padding:0rem";
      el.style.cssText = "height:" + el.scrollHeight + "px";
    }, 0);
  };
  sendMessage = () => {
    let message = this.state.message;
    if (message === "") return;
    this.props.sendMessage(message);
    this.setState({ message: "" });
  };
  pickImg = () => {
    this.fileUploader.click();
  };
  attachFile = async (evt) => {
    let file = evt.target.files[0];
    if (file) {
      this.fileUploader.value = null;
      let dataUrl = await this.toBase64(file);
      this.props.attachImg({ img: file, imgLink: dataUrl });
    }
  };
  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  selectGif = (gifUrl) => {
    this.setState({ showGifPicker: false });
    this.props.attachImg({ img: "", imgLink: gifUrl });
  };
  render() {
    return (
      <React.Fragment>
        <div className="chatinput__supercontainer">
          <div className="chatinput__container">
            <div className="chatinput__input-container">
              <textarea
                name=""
                className="chatinput__input"
                placeholder="Your message..."
                id=""
                value={this.state.message}
                rows="1"
                onKeyDown={this.autosize}
                onChange={this.handleInputChange}
                ref={(ref) => {
                  this.messageInput = ref;
                }}
              ></textarea>
            </div>
            <div
              className="chatinput__btn"
              ref={(ref) => {
                this.emojiPicker = ref;
              }}
            >
              <i
                className="far fa-laugh-beam"
                onClick={this.toggleEmojiPicker}
              />
              <div
                className="chatinput__emojipicker-container"
                style={{
                  display: this.state.showEmojiPicker ? "block" : "none",
                }}
              >
                <div className="chatinput__emojipicker-triangle" />
                <EmojiPicker
                  disableSearchBar={true}
                  native={true}
                  onEmojiClick={this.selectEmoji}
                  groupVisibility={{ recently_used: false }}
                />
              </div>
            </div>
            <button
              className="chatinput__btn"
              ref={(ref) => {
                this.gifPicker = ref;
              }}
            >
              {/* <i className="fas fa-image" /> */}
              <img src={GifIcon} alt="" onClick={this.toggleGifPicker} />
              <div
                className="chatinput__gifpicker-container"
                style={{
                  display: this.state.showGifPicker ? "block" : "none",
                }}
              >
                <div className="chatinput__emojipicker-triangle" />
                {this.state.showGifPicker ? (
                  <GifPicker onSelect={this.selectGif} />
                ) : (
                  ""
                )}
              </div>
            </button>
            <button className="chatinput__btn" onClick={this.pickImg}>
              <i className="fas fa-image" />
            </button>
            <button className="chatinput__btn" onClick={this.sendMessage}>
              <i className="fas fa-paper-plane" />
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
      </React.Fragment>
    );
  }
}
