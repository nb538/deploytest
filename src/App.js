
import React, { Component } from 'react';
import "./App.css";
import Header from './Header';
import PersonalProfile from './PersonalProfile';
import WorkExperience from './WorkExperience';
import Skills from './Skills';
import Education from './Education';
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      personInfo:{
        name: "Nicolas Bermudez",
        occupation: "Computer Scientist"
      },
      contactInfo: {
        emailText: "E-mail: ",
        emailLink: "https://www.gmail.com",
        emailLinkText: "nb538@gmail.com",
        web: "Web: nb538.github.io/deploytest/",
        mobile: "Mobile: 123-456-7890"
      },
      personalInfo: {
        title: "Personal Profile",
        text: "Lorem ipsum odor amet, consectetuer adipiscing elit. " +
          "Vel tincidunt mollis laoreet facilisis rutrum ad tincidunt " + 
          "quis volutpat. Cursus aptent finibus curabitur pellentesque " + 
          "pellentesque lectus? Porttitor tempus efficitur efficitur vivamus " + 
          "tempus conubia class. Rhoncus imperdiet accumsan augue aliquam " + 
          "scelerisque nam porttitor commodo. Convallis amet elementum molestie " + 
          "malesuada nullam nunc vulputate. Class rhoncus morbi ante auctor nullam " + 
          "dignissim ante viverra. Ad sodales maximus vel senectus, convallis dolor " + 
          "semper."
      },
      workExperience: {
        title: "Work Experience",
        title1: "Security Shift Supervisor",
        desc1: "This is where job description 1 goes.",
        title2: "Certified Driver",
        desc2: "This is where job description 2 goes"
      },
      keySkills: {
        title: "Key Skills",
        skill1: "Key Skill 1",
        skill2: "Key Skill 2",
        skill3: "Key Skill 3",
        skill4: "Key Skill 4",
        skill5: "Key Skill 5",
        skill6: "Key Skill 6",
        skill7: "Key Skill 7",
        skill8: "Key Skill 8",
        skill9: "Key Skill 9"
      },
      education: {
        title: "Education",
        university1: "County College of Morris",
        title1: "Degree: AS in Computer Science",
        years1: "Attendance: 2020-2022",
        gpa1: "GPA: 3.5",
        university2: "New Jersey Institute of Technology",
        title2: "Degree: BS in Computer Science",
        years2: "Attendance: 2022-2024",
        gpa2: "GPA: 3.8"
      }
    }
  }
  render() {
    return (
      <div>
        <Header personInfo={this.state.personInfo} contactInfo={this.state.contactInfo}></Header>
        <div className="divider"></div>
        <PersonalProfile personalInfo={this.state.personalInfo}></PersonalProfile>
        <div className="line"></div>
        <WorkExperience workExperience={this.state.workExperience}></WorkExperience>
        <div className="line"></div>
        <Skills keySkills={this.state.keySkills}></Skills>
        <div className="line"></div>
        <Education education={this.state.education}></Education>
      </div>
    );
  }
}
export default App;