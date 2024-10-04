import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <div className="hd1">
        <div className="hd1_c1">
          <div>
            <h1>{this.props.personInfo.name}</h1>
            <p>{this.props.personInfo.occupation}</p>
          </div>
        </div>
        <div className="hd1_c2">
          <div>
            <p>{this.props.contactInfo.emailText}<a href={this.props.contactInfo.emailLink}>{this.props.contactInfo.emailLinkText}</a></p>
            <p>{this.props.contactInfo.web}</p>
            <p>{this.props.contactInfo.mobile}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;