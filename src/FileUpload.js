import React, { Component } from "react";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      jsonData: null, // New state to store the parsed JSON data
    };
  }

  handleFileSubmit = (event) => {
    event.preventDefault();
    const { file } = this.state;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const json = this.csvToJson(text);
        this.setState({ jsonData: json }); // Set JSON to state
        this.props.set_data(json);
      };
      reader.readAsText(file);
    }
  };

  csvToJson = (csv) => {
    const lines = csv.split("\n"); // Split by new line to get rows
    const headers = lines[0].split(","); // Split first row to get headers
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(","); // Split each line by comma
      const obj = {};

      // Map each column value to the corresponding header
      headers.forEach((header, index) => {
        obj[header.trim()] = currentLine[index]?.trim(); // Trim to remove spaces
      });

      // Add object to result if it's not an empty row
      if (Object.keys(obj).length && lines[i].trim()) {
        const [year, month, day] = obj.Date.split("-");
        const parsedObj = {
          Date: new Date(year, month - 1, day),
          GPT4: parseInt(obj["GPT-4"]),
          Gemini: parseInt(obj.Gemini),
          PaLM2: parseInt(obj["PaLM-2"]),
          Claude: parseInt(obj.Claude),
          LLaMA31: parseInt(obj["LLaMA-3.1"]),
        };
        result.push(parsedObj);
      }
    }

    return result;
  };

  render() {
    return (
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: 2,
          width: "80%",
          marginLeft: "10%",
          height: "95px",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ marginLeft: "5%" }}>Upload a CSV File</h2>
        <form
          onSubmit={this.handleFileSubmit}
          style={{ justifyContent: "space-between", marginLeft: "5%" }}
        >
          <input
            type="file"
            accept=".csv"
            onChange={(event) => this.setState({ file: event.target.files[0] })}
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default FileUpload;