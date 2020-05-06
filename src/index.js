import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js'
import chi from 'chi-squared';
import LineChart from './components/LineChart'
import './index.css'

Chart.defaults.global.defaultFontFamily = "Roboto, sans-serif";

function chiSqrt() {

  let ri = (document.getElementById("ri").value).split(" ");
  let sum = 0;

  //Add the recomended m = sqrt(n)
  let m = Math.ceil(Math.sqrt(ri.length));

  /**
   ei: the expected number of events in a category, will be the same for each i 
   because we're expecting to be an uniform distribution since they are pseudo random numbers
   */
  let ei = ri.length/m
  
  //oi: the observable number of events in a category
  let oi = new Array(m).fill(null)


  /**
    As Math.random only return numbers between 0 and 1, excluding 1, 
    ir: is the range of each interval
  */
  let ir = 1/m;


  // suit the numbers of observable event to the Oi range they belong
  for(let i = 0; i<ri.length; i++){
    for(let j = 0; j<m; j++){
      if( ri[i] < ir*(j+1) ) {
        oi[j] +=1;
        break;
      }
    }
  }

  //X^2 = sum (O-E)^2/E
  for(let i=0; i<m; i++){
    sum += (oi[i]-ei)**2/ei
  }
  let uniform = chi.cdf(sum,m)*100;
  document.getElementById('sol').innerText = `Your data is ${uniform}% uniform`;

   let getlabel = () => {
    let label = [0]
    let irs = ir
    for(let i=1; i<m; i++){
      label.push((irs+=ir).toFixed(2))
    }
    return label
  }


  let datas = {
      labels: getlabel(),
      datasets: {
        label: 'Events',
        data: oi,
        fill: 'none',
        backgroundColor: 'blue',
        pointRadius: 0,
        borderColor: 'red',
        borderWidth: 1,
        lineTension: 0,
        max: Math.max(oi)
      }
  }

  ReactDOM.render(<LineChart
    data= {datas}
    title='count'
    color="#B08EA2"
  />, document.getElementById('linechart'));  
}
  

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>How uniform your numbers are</h1>
        <h3>Insert numbers between 0 and 1, separated by a space</h3>
        <input size="50" type="text" name="randomnumbers" id="ri"></input>
        <button onClick={chiSqrt}>Calculate</button>
        <h1 id="sol"></h1>
        <div id="linechart">
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
