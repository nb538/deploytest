import React, { Component } from "react";

class PersonalProfile extends Component {
    render() {
        return (
            <div className="perpro1">
                <div className="body_t">
                    <h2>{this.props.personalInfo.title}</h2>
                </div>
                <div className="perpro1_p">
                    <p>{this.props.personalInfo.text}</p>
                </div>
            </div>
        )
    }
}

export default PersonalProfile;