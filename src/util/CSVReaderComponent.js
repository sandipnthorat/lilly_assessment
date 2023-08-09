import React from "react";
import Papa from "papaparse";

class CSVReaderComponent extends React.Component {
  handleFileChange = (e) => {
    const file = e.target.files[0];
    this.parseCSV(file);
  };

  parseCSV = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;
      this.convertCSVtoJSON(csvData);
    };

    reader.readAsText(file);
  };

  convertCSVtoJSON = (csvData) => {
    // Here you can use any CSV parsing logic to convert csvData to JSON.
    // You can use libraries like papaparse or implement custom parsing logic.

    // For example, if your CSV is comma-separated, you can convert it to JSON like this:
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");
    const jsonData = [];

    for (let i = 1; i < lines.length; i++) {
      const data = lines[i].split(",");
      const entry = {};
      for (let j = 0; j < headers.length; j++) {
        entry[headers[j]] = data[j];
      }
      jsonData.push(entry);
    }
    this.props.chartData(jsonData);
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFileChange} />
      </div>
    );
  }
}

export default CSVReaderComponent;
