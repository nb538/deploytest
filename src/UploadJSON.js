import React, { Component } from "react";

class UploadJSON extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: null,
    };
  }

  // Handles the JSON file submission
  // Adapted from given FileUpload.js
  handleFileSubmit = (event) => {
    event.preventDefault();
    const { jsonData } = this.state;

    if (jsonData) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;

        try {
          const json = JSON.parse(text);
          this.setState({ jsonData: null });
          this.props.set_data(json);
        } catch (error) {
          console.error("Invalid JSON file", error);
          alert("Error: The uploaded file is not a valid JSON.");
        }
      };

      reader.readAsText(jsonData);
    } else {
      alert("No file selected or file is invlaid format.");
    }
  };

  // Renders component that receives JSON file.
  render() {
    return (
      <div className="upload-comp">
        <h2 style={{ marginLeft: "5%" }}>Upload a JSON File</h2>
        <form
          onSubmit={this.handleFileSubmit}
          style={{ justifyContent: "space-around", marginLeft: "5%" }}
        >
          <input
            type="file"
            accept=".json"
            onChange={(event) =>
              this.setState({ jsonData: event.target.files[0] })
            }
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default UploadJSON;
