import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: [] };
  }
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  getWordFrequency = (text) => {
    const stopWords = new Set([
      "the",
      "and",
      "a",
      "an",
      "in",
      "on",
      "at",
      "for",
      "with",
      "about",
      "as",
      "by",
      "to",
      "of",
      "from",
      "that",
      "which",
      "who",
      "whom",
      "this",
      "these",
      "those",
      "it",
      "its",
      "they",
      "their",
      "them",
      "we",
      "our",
      "ours",
      "you",
      "your",
      "yours",
      "he",
      "him",
      "his",
      "she",
      "her",
      "hers",
      "it",
      "its",
      "we",
      "us",
      "our",
      "ours",
      "they",
      "them",
      "theirs",
      "I",
      "me",
      "my",
      "myself",
      "you",
      "your",
      "yourself",
      "yourselves",
      "was",
      "were",
      "is",
      "am",
      "are",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "having",
      "do",
      "does",
      "did",
      "doing",
      "a",
      "an",
      "the",
      "as",
      "if",
      "each",
      "how",
      "which",
      "who",
      "whom",
      "what",
      "this",
      "these",
      "those",
      "that",
      "with",
      "without",
      "through",
      "over",
      "under",
      "above",
      "below",
      "between",
      "among",
      "during",
      "before",
      "after",
      "until",
      "while",
      "of",
      "for",
      "on",
      "off",
      "out",
      "in",
      "into",
      "by",
      "about",
      "against",
      "with",
      "amongst",
      "throughout",
      "despite",
      "towards",
      "upon",
      "isn't",
      "aren't",
      "wasn't",
      "weren't",
      "haven't",
      "hasn't",
      "hadn't",
      "doesn't",
      "didn't",
      "don't",
      "doesn't",
      "didn't",
      "won't",
      "wouldn't",
      "can't",
      "couldn't",
      "shouldn't",
      "mustn't",
      "needn't",
      "daren't",
      "hasn't",
      "haven't",
      "hadn't",
    ]);
    const words = text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=_`~()]/g, "")
      .replace(/\s{2,}/g, " ")
      .split(" ");
    const filteredWords = words.filter((word) => !stopWords.has(word));
    return Object.entries(
      filteredWords.reduce((freq, word) => {
        freq[word] = (freq[word] || 0) + 1;
        return freq;
      }, {})
    );
  };

  renderChart() {
    const data = this.state.wordFrequency
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const svgWidth = 1000;

    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([50, svgWidth - 100]);

    const fontSizeScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([50, 20]);

    const svg = d3
      .select(".svg_parent")
      .attr("width", svgWidth)
      .attr("height", 100);

    const words = svg.selectAll("text").data(data, (d) => d[0]);

    words.exit().remove();

    words
      .enter()
      .append("text")
      .attr("x", (d, i) => xScale(i))
      .attr("y", 50)
      .attr("font-size", 0)
      .attr("fill", "black")
      .text((d) => d[0])
      .transition()
      .duration(2000)
      .attr("font-size", (d, i) => `${fontSizeScale(i)}px`)
      .attr("x", (d, i) => xScale(i));

    words
      .transition()
      .duration(2000)
      .attr("x", (d, i) => xScale(i))
      .attr("font-size", (d, i) => `${fontSizeScale(i)}px`);
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea
            type="text"
            id="input_field"
            style={{ height: 150, width: 1000 }}
          />
          <button
            type="submit"
            value="Generate Matrix"
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={() => {
              var input_data = document.getElementById("input_field").value;
              this.setState({
                wordFrequency: this.getWordFrequency(input_data),
              });
            }}
          >
            {" "}
            Generate WordCloud
          </button>
        </div>
        <div className="child2">
          <svg className="svg_parent"></svg>
        </div>
      </div>
    );
  }
}

export default App;