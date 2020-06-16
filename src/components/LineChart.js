import React from "react";
import Chart from "chart.js";

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    this.myChart.options.scales.yAxes[0].ticks.max = this.props.data.max;
    this.myChart.options.scales.yAxes[0].ticks.min = this.props.data.min;
    this.myChart.data.labels = this.props.data.labels;
    this.myChart.data.datasets[0].data = this.props.data.datas;
    this.myChart.update();
  }

  componentDidMount() {
    const {
      labels,
      label,
      datas,
      fill,
      backgroundColor,
      pointRadius,
      borderColor,
      borderWidth,
      lineTension,
      max,
      min,
    } = this.props.data;

    this.myChart = new Chart(this.canvasRef.current, {
      type: this.props.type,
      options: {
        maintainAspectRatio: true,
        scales: {
          yAxes: [
            {
              ticks: {
                min: min,
                max: max,
              },
            },
          ],
        },
      },
      data: {
        labels: labels,
        datasets: [
          {
            fill: fill,
            pointRadius: pointRadius,
            borderWidth: borderWidth,
            lineTension: lineTension,
            borderColor: borderColor,
            label: label,
            data: datas,
            backgroundColor: backgroundColor,
          },
        ],
      },
    });
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

export default LineChart;
