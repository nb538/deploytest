import React, { Component } from "react";

class Skills extends Component {
    render() {
        return (
            <div className="ks1">
                <div className="body_t">
                    <h2>{this.props.keySkills.title}</h2>
                </div>
                <div className="ks1_p">
                    <p>{this.props.keySkills.skill1}</p>
                    <p>{this.props.keySkills.skill2}</p>
                    <p>{this.props.keySkills.skill3}</p>
                    <p>{this.props.keySkills.skill4}</p>
                    <p>{this.props.keySkills.skill5}</p>
                    <p>{this.props.keySkills.skill6}</p>
                    <p>{this.props.keySkills.skill7}</p>
                    <p>{this.props.keySkills.skill8}</p>
                    <p>{this.props.keySkills.skill9}</p>
                </div>
            </div>
        )
    }
}

export default Skills;