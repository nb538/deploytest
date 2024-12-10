import React, { Component } from "react";
import UploadJSON from "./UploadJSON.js";
import Comp1 from "./Comp1.js";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount = () => {
    //console.log(tweets);
  };

  componentDidUpdate = () => {
    //console.log("App.js update triggered");
    //console.log(this.state.data);
  };

  set_data = (json_data) => {
    this.setState({ data: json_data });
  };

  render() {
    return (
      <div className="body">
        <UploadJSON set_data={this.set_data}></UploadJSON>
        <Comp1 json_data={this.state.data}></Comp1>
      </div>
    );
  }
}

export default App;
