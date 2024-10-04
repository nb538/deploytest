import React, { Component } from "react";

class Education extends Component {
    render() {
        return (
            <div className="edu">
                <div className="body_t">
                    <h2>{this.props.education.title}</h2>
                </div>
                <div className="edu_p">
                    <h3>{this.props.education.university1}</h3>
                    <p>{this.props.education.title1}</p>
                    <p>{this.props.education.years1}</p>
                    <p>{this.props.education.gpa1}</p>
                    <h3>{this.props.education.university2}</h3>
                    <p>{this.props.education.title2}</p>
                    <p>{this.props.education.years2}</p>
                    <p>{this.props.education.gpa2}</p>
                </div>
            </div>
        )
    }
}

export default Education;