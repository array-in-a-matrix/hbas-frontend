import React, { Component } from 'react';
import AdSense from 'react-adsense';
import wiiuIcon from './img/wiiu.png';
import switchIcon from './img/switch.png';
import threedsIcon from './img/3ds.png';
import allIcon from './img/all.png';

const getParams = props => {
  const { match: { params: content } } = props;

  // return inner url params, but also lowercase all values
  return Object.keys(content)
    .reduce((destination, key) => {
      destination[key] = (content[key] || "").toLowerCase();
      return destination;
    }, {});
};

const stringDateToTimestamp = incoming => {
  if (!incoming) return 0;
  const parts = incoming.split('/');
  const [day, month, year] = parts;
  return new Date(year, month - 1, day);
}

const platformIcons = {
  wiiu: wiiuIcon,
  switch: switchIcon,
  '3ds': threedsIcon,
  all: allIcon
}

class FullWidthAd extends Component {
  ads = [
    {
      adClient: "ca-pub-7623664678937879",
      adSlot: "6161516658"
    },
    {
      adClient: "ca-pub-8148658375496745",
      adSlot: "4266492119"
    }
  ]

  constructor(props) {
    super();

    // get random ad info from a list of ad id peeps
    this.state = {
      ad: this.ads[Math.floor(Math.random() * this.ads.length)]
    };
  }
  render() {
    const { ad: { adClient, adSlot } } = this.state;

    return <div className="Ad">
      <AdSense.Google
        client={adClient}
        slot={adSlot}
        style={{ display: 'block', height: 70 }}
        format='fluid'
        responsive='true'
      />
    </div>;
  }
}

class Spacer extends Component {
  render() {
    return <div style={{
      height: 400,
      width: 20
    }}>
      &nbsp;
    </div>;
  }
}

class Mobile extends Component {

  selectedcat = (event) => {
    /* Hacky get platform method */
    let e = document.getElementById("device");
    let repo = e.options[e.selectedIndex].value;
    let catselect = event.target.value;
    if (repo === "all") {
      window.location.href = (`${catselect}`);
    }
    else {
      window.location.href = (`/${repo}${catselect}`);
    }
  }

  choice = (event) => {
    let path = event.target.value;
    window.location.href = (path);
  }
  render() {
    return <div className="mobile">
      <div className="categories">
        {/* TODO: dynamically load from category list */}
        <select className="menuselect" defaultValue="#" onChange={this.selectedcat}>
          <option selected disabled hidden value="#">Categories</option>
          <option value="/search">Search</option>
          <option value="/">All apps</option>
          <option value="/stats">Statistics</option>
          <option value="/category/games">Games</option>
          <option value="/category/emulators">Emulators</option>
          <option value="/category/tools">Tools</option>
          <option value="/category/advanced">Advanced</option>
          <option value="/category/themes">Themes</option>
          <option value="/quickstore">QuickStore</option>
          <option value="/category/legacy">Legacy</option>
        </select>
      </div>
      <div className="links">
        <select className="menuselect" id="menu" defaultValue="#" onChange={this.choice}>
          <option selected disabled hidden value="#">Menu</option>
          <option value="/about">About</option>
          <option value="https://discord.gg/F2PKpEj">Discord</option>
          <option value="/api-info">API</option>
          <option value="/submit-or-request">Submit</option>
          <option value="/dmca-request">DMCA</option>
        </select>
      </div>
    </div>
  }
}

const getFirstPixelFromImage = (img) => {
  img.crossOrigin = "anonymous";
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const context = canvas.getContext('2d');
  context.drawImage(img, 0, 0, img.width, img.height);
  const buf8 = context.getImageData(1, 1, 1, 1).data;
  var data = new Uint32Array(buf8);

  // if the pixel is transparent, return white
  if ((data[3] || 0) === 0) {
    return 'rgb(255, 255, 255)';
  }

  return `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
}

export { getParams, getFirstPixelFromImage, stringDateToTimestamp, platformIcons, FullWidthAd, Spacer, Mobile };
