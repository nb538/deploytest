import React, { Component } from "react";
import FileUpload from "./FileUpload";
import Comp1 from "./Comp1";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidUpdate = () => {
    console.log(this.state.data);
  };

  set_data = (csv_data) => {
    this.setState({ data: csv_data });
  };

  render() {
    return (
      <div className="body">
        <FileUpload set_data={this.set_data}></FileUpload>
        <Comp1 csv_data={this.state.data}></Comp1>
      </div>
    );
  }
}

export default App;
