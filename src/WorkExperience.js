import React, { Component } from "react";

class WorkExperience extends Component {
    render() {
        return (
            <div className="workexp">
                <div className="body_t">
                    <h2>{this.props.workExperience.title}</h2>
                </div>
                <div className="workexp_p">
                    <h3>{this.props.workExperience.title1}</h3>
                    <p>{this.props.workExperience.desc1}</p>
                    <h3>{this.props.workExperience.title2}</h3>
                    <p>{this.props.workExperience.desc2}</p>
                </div>
            </div>
        )
    }
}

export default WorkExperience;