import React, { Component } from "react";
import Axios from "axios";
import { LazyLoadComponent } from "react-lazy-load-image-component";

import "./index.scss";
let timeout;
export default class index extends Component {
  key = "AX1K18RHW9GN";
  constructor(props) {
    super(props);

    this.state = {
      gifs: [],
      next: "",
      search: "",
    };
  }

  componentDidMount = () => {
    this.fetchGifs();
  };
  handleScroll = () => {
    let obj = this.panels;
    let diffLeft = obj.scrollHeight - obj.offsetHeight - obj.scrollTop;
    let diffPercent = (diffLeft / obj.scrollHeight) * 100;
    if (diffLeft < 10) {
      this.fetchGifs(true);
    }
  };
  fetchGifs = (next) => {
    let url = "";
    if (!this.state.search) {
      url = "https://g.tenor.com/v1/trending?key=" + this.key;
    } else {
      url =
        "https://g.tenor.com/v1/search?key=" +
        this.key +
        "&q=" +
        this.state.search;
    }
    if (next) url += "&pos=" + this.state.next;
    Axios.get(url).then((res) => {
      let gifs;
      if (next) gifs = [...this.state.gifs, ...res.data.results];
      else gifs = [...res.data.results];

      this.setState({ gifs, next: res.data.next });
    });
  };
  handleFormChange = (evt) => {
    this.setState({ search: evt.target.value });
    clearTimeout(timeout);
    timeout = setTimeout(this.fetchGifs, 500);
  };
  selectGif = (gif) => {
    this.props.onSelect(gif.media[0].mediumgif.url);
  };
  render() {
    return (
      <div className="gifPicker__container">
        <div className="gifPicker__search">
          <input
            type="text"
            className="gifPicker__search-textfield"
            placeholder="Search Gifs⚡"
            value={this.state.search}
            onChange={this.handleFormChange}
          />
          <i className="fas fa-search" />
        </div>
        <div
          className="gifPicker__panels"
          onScroll={this.handleScroll}
          ref={(ref) => {
            this.panels = ref;
          }}
        >
          {this.state.gifs.map((gif) => (
            <div className="gifPicker__panels-panel" key={gif.id}>
              <LazyLoadComponent>
                <img
                  className="gifPicker__panels-panel-img"
                  src={gif.media[0].nanogif.url}
                  alt=""
                  onClick={() => {
                    this.selectGif(gif);
                  }}
                />
              </LazyLoadComponent>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
