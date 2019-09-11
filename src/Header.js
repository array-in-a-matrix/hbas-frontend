import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons'
import { faCube, faPlus, faServer, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import './MainDisplay.css';

const platform = "Switch";

class Header extends Component {
  render() {
    return (
      <div className="nav">
        <ul>
          <li id="title" className="title"><FontAwesomeIcon icon={faCube} />
            &nbsp;&nbsp;Homebrew App Store <span className="platform">for </span>
            <select id="device">
              <option value="switch" selected>{platform}</option>
              <option value="wiiu">WiiU</option>
            </select>
          </li>
          <li id="ftu"><a href="https://fortheusers.org">About</a></li>
          <li id="discord"><a href="https://discord.gg/F2PKpEj">Discord</a></li>
          <li id="twitter"><a href="https://twitter.com/wiiubru">Twitter</a></li>
          <li id="account"><a href="https://www.switchbru.com/account/">Account</a></li>
          <li id="dns"><a href="https://www.switchbru.com/dns">DNS</a></li>
          <li id="submit"><a href="https://submit.fortheusers.org/">Submit</a></li>
          <li id="m_ftu"><a href="https://fortheusers.org"><FontAwesomeIcon icon={faCube} /></a></li>
          <li id="m_discord"><a href="https://discord.gg/F2PKpEj"><FontAwesomeIcon icon={faDiscord} /></a></li>
          <li id="m_twitter"><a href="https://twitter.com/wiiubru"><FontAwesomeIcon icon={faTwitter} /></a></li>
          <li id="m_account"><a href="https://www.switchbru.com/account/"><FontAwesomeIcon icon={faSignInAlt} /></a></li>
          <li id="m_dns"><a href="https://www.switchbru.com/dns"><FontAwesomeIcon icon={faServer} /></a></li>
          <li id="m_submit"><a href="https://submit.fortheusers.org/"><FontAwesomeIcon icon={faPlus} /></a></li>
        </ul>
      </div >
    );
  }
}

export default Header;
