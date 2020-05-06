import React from 'react'

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    this.myChart.data.labels = this.props.data.labels;
    this.myChart.data.datasets[0].data = this.props.data.datasets.data;
    this.myChart.update();
  }

  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'line',
      options: {
	      maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: this.props.data.max
              }
            }
          ]
        }
      },
      data: {
        labels: this.props.data.labels,
        datasets: [{
          fill: 'none',
          pointRadius: 2,
          borderWidth: 2,
          lineTension: 0,
          label: this.props.data.datasets.label,
          data: this.props.data.datasets.data,
          backgroundColor: this.props.data.datasets.backgroundColor
        }]
      }
      
    });
    
  }

  render() {
    return (
        <canvas ref={this.canvasRef} />
    );
  }
}

export default LineChart