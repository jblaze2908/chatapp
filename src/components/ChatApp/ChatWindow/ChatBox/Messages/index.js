import React, { Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import dateFunctions from "../../../../../helperFunctions/date";
import "./index.scss";
let pfpCache = new Map();
export default class index extends Component {
  images;
  constructor(props) {
    super(props);
    this.state = {
      update: 0,
      photoIndex: 0,
      imgViewerOpen: false,
    };

    this.dateFunctions = new dateFunctions();
  }
  getPfpLink = (_id) => {
    let cachedResult = pfpCache.get(_id);
    if (cachedResult) {
      return cachedResult;
    } else {
      let pfpLink = "";
      if (_id === this.props.userId) pfpLink = this.props.userPfp;
      else if (this.props.chatThread.participant1._id === _id) {
        pfpLink = this.props.chatThread.participant1.pfpLink;
      } else if (this.props.chatThread.participant2._id === _id) {
        pfpLink = this.props.chatThread.participant2.pfpLink;
      } else {
        pfpLink = this.props.userPfp;
      }
      if (pfpLink) {
        pfpCache.set(_id, pfpLink);
        return pfpLink;
      } else {
        let link =
          "https://res.cloudinary.com/jblaze2908/image/upload/v1614540131/default.png";
        pfpCache.set(_id, link);
        return link;
      }
    }
  };
  setMessagesAsRead = () => {
    let lastMsg =
      this.props.chatThread.messages.length !== 0 &&
      this.props.chatThread.messages[this.props.chatThread.messages.length - 1];
    if (
      this.props.chatThread.messages.length !== 0 &&
      !lastMsg.readAt &&
      lastMsg.from !== this.props.userId
    )
      this.props.setMessagesAsRead();
  };
  filterImages = () => {
    let images = this.props.chatThread.messages.filter((a) => a.imgLink);
    this.images = images;
  };
  openImgViewer = (chatId) => {
    let index = this.images.findIndex((chat) => chat._id === chatId);
    this.setState({
      imgViewerOpen: true,
      photoIndex: index,
    });
  };
  getImageCaption = (index) => {
    let chat = this.images[index];
    let caption = "";
    if (chat.from === this.props.userId) caption += "Sent at ";
    else caption = "Received at ";
    caption +=
      this.dateFunctions.getFormattedTime(chat.sentAt) +
      " on " +
      this.dateFunctions.getFormattedDate(chat.sentAt);
    return caption;
  };
  componentDidMount = () => {
    this.filterImages();
    this.messageContainer.scrollTo(0, this.messageContainer.scrollHeight);
    this.setMessagesAsRead();
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.userPfp !== this.props.userPfp) {
      pfpCache.delete(this.props.userId);
      this.setState({ update: this.state.update + 1 });
    }
    if (prevProps.chatThread._id !== this.props.chatThread._id) {
      this.filterImages();

      this.messageContainer.scrollTo(0, this.messageContainer.scrollHeight);
      this.setMessagesAsRead();
    } else if (
      prevProps.chatThread.messages.length !==
      this.props.chatThread.messages.length
    ) {
      this.filterImages();

      this.messageContainer.scrollTo({
        top: this.messageContainer.scrollHeight,
        behavior: "smooth",
      });
      this.setMessagesAsRead();
    }
  };
  render() {
    return (
      <div
        className="messages__container"
        style={{ height: this.props.height }}
        ref={(ref) => {
          this.messageContainer = ref;
        }}
      >
        <TransitionGroup>
          {this.props.chatThread.messages.map((chat, index) => {
            let dateChange, displayDate;
            if (index === 0) dateChange = true;
            else {
              dateChange = !this.dateFunctions.checkIfSameDate(
                this.props.chatThread.messages[index - 1].sentAt,
                chat.sentAt
              );
            }
            if (dateChange) {
              displayDate = this.dateFunctions.getDisplayDate(chat.sentAt);
            }
            let chatClass =
              chat.from === this.props.userId ? "sent" : "received";

            return (
              <CSSTransition key={chat._id} timeout={300} classNames="message">
                <div
                  className={"messages__message messages__message-" + chatClass}
                >
                  {dateChange ? (
                    <div className="messages__message-row-datechange">
                      {displayDate}
                    </div>
                  ) : null}
                  <div
                    className={
                      "messages__message-row messages__message-" +
                      chatClass +
                      "-row"
                    }
                  >
                    {chat.text ? (
                      <div
                        className={
                          "messages__message-text messages__message-" +
                          chatClass +
                          "-text"
                        }
                      >
                        {chat.text}
                      </div>
                    ) : (
                      <div
                        className={
                          "messages__message-attachment messages__message-" +
                          chatClass +
                          "-attachment"
                        }
                        style={{ cursor: "zoom-in" }}
                        onClick={() => {
                          this.openImgViewer(chat._id);
                        }}
                      >
                        <LazyLoadImage src={chat.imgLink} threshold={500} />
                      </div>
                    )}
                    <div
                      className={
                        "messages__message-img messages__message-" +
                        chatClass +
                        "-img"
                      }
                    >
                      <img src={this.getPfpLink(chat.from)} alt="" />
                    </div>
                  </div>
                  <div
                    className={
                      "messages__message-time messages__message-" +
                      chatClass +
                      "-time"
                    }
                  >
                    {this.dateFunctions.getFormattedTime(chat.sentAt)}
                    {chatClass === "sent" && chat.readAt ? (
                      <i
                        className="fas fa-check-double"
                        style={{ marginLeft: ".5rem" }}
                      />
                    ) : null}
                  </div>
                </div>
              </CSSTransition>
            );
          })}
          {this.props.imgLink ? (
            <CSSTransition timeout={300} classNames="message">
              <div className="messages__message messages__message-sent">
                <div className="messages__message-row messages__message-sent-row">
                  <div
                    className="messages__message-remove"
                    onClick={this.props.removeAttachment}
                  >
                    <i className="fas fa-times-circle" />
                  </div>
                  <div className="messages__message-attachment messages__message-sent-attachment">
                    <img src={this.props.imgLink} alt="" />
                    <div
                      className="messages__message-attachment-overlay"
                      onClick={this.props.sendAttachment}
                    >
                      {this.props.imgBtnStatus}
                    </div>
                  </div>
                </div>
              </div>
            </CSSTransition>
          ) : (
            ""
          )}
        </TransitionGroup>
        {this.state.imgViewerOpen && this.images.length !== 0 ? (
          <Lightbox
            mainSrc={this.images[this.state.photoIndex].imgLink}
            nextSrc={
              this.images[(this.state.photoIndex + 1) % this.images.length]
                .imgLink
            }
            prevSrc={
              this.images[
                (this.state.photoIndex + this.images.length - 1) %
                  this.images.length
              ].imgLink
            }
            onCloseRequest={() => this.setState({ imgViewerOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex:
                  (this.state.photoIndex + this.images.length - 1) %
                  this.images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (this.state.photoIndex + 1) % this.images.length,
              })
            }
            imageCaption={this.getImageCaption(this.state.photoIndex)}
          />
        ) : null}
      </div>
    );
  }
}
