import React from "react";
import ReactDOM from "react-dom";
import Chart from "chart.js";
import chi from "chi-squared";
import LineChart from "./components/LineChart";
import "./index.css";

Chart.defaults.global.defaultFontFamily = "Roboto, sans-serif";

function chiSqrt() {
  let ri = document.getElementById("ri").value.split(" ");

  function chiSqrtTest(obtained, expected) {
    let sum = 0;
    //(Oi-ei)^2/ei
    for (let i = 0; i < obtained.length; i++) {
      sum += (obtained[i] - expected[i]) ** 2 / expected[i];
    }
    return sum;
  }

  if (ri.length === 1) {
    ReactDOM.render(
      <p>Incluye números validos</p>,
      document.getElementById("sol")
    );
    return;
  }

  //Add the recomended m = sqrt(n)
  let m = Math.ceil(Math.sqrt(ri.length));

  /**
   ei: the expected number of events in a category, will be the same for each i 
   because we're expecting to be an uniform distribution since they are pseudo random numbers
   */
  let ei = new Array(m).fill(ri.length / m);

  //oi: the observable number of events in a category
  let oi = new Array(m).fill(null);

  /**
    As Math.random only return numbers between 0 and 1, excluding 1, 
    ir: is the range of each interval
  */
  let ir = 1 / m;

  // suit the numbers of observable event to the Oi range they belong
  for (let i = 0; i < ri.length; i++) {
    for (let j = 0; j < m; j++) {
      if (ri[i] < ir * (j + 1)) {
        oi[j] += 1;
        break;
      }
    }
  }

  const sum = chiSqrtTest(oi, ei);
  let uniform = (1 - chi.cdf(sum, m - 1)) * 100;
  if (uniform > 5) {
    ReactDOM.render(
      <div className="res">
        <input type="checkbox" id="resUniformInput" defaultChecked={true} />
        <span>The data is uniform</span>
      </div>,
      document.getElementById("resUniform")
    );
    document.getElementById("resUniformInput").checked = true;
  } else {
    ReactDOM.render(
      <div className="res">
        <input type="checkbox" id="resUniformInput" defaultChecked={false} />
        <span>The data is not uniform</span>
      </div>,
      document.getElementById("resUniform")
    );
    document.getElementById("resUniformInput").checked = false;
  }
  //Dependent Test with Streak
  let postiveStreak = 0;
  let negativeStreak = 0;
  let streak = [];
  for (let i = 0; i < ri.length; i++) {
    if (ri[i] > ri[i + 1]) {
      if (negativeStreak != 0) {
        streak.push(negativeStreak);
        negativeStreak = 0;
      }
      postiveStreak++;
    } else {
      if (postiveStreak != 0) {
        streak.push(postiveStreak);
        postiveStreak = 0;
      }
      negativeStreak++;
    }
  }
  let getlabel = () => {
    let label = [0];
    let irs = 0;
    let n1 = 0;
    let n2 = 0;
    let lab = "";
    for (let i = 1; i < m; i++) {
      irs += ir;
      n1 = irs.toFixed(2);
      n2 = irs + ir;
      n2 = n2.toFixed(2);
      lab = n1 + " - " + n2;
      label.push(lab);
    }
    return label;
  };

  ReactDOM.render(
    <div>
      <LineChart
        type="line"
        data={{
          labels: getlabel(),
          label: "Events",
          datas: oi,
          fill: false,
          backgroundColor: "blue",
          pointRadius: 2,
          borderColor: "#cfcfcf",
          borderWidth: 2,
          lineTension: 0,
          max: Math.max(...oi),
          min: 0,
        }}
        title="count"
        color="#ccc"
      />
      <b>
        <p>the straigher the line the more uniform it is</p>
      </b>
      <p></p>
    </div>,
    document.getElementById("linechart")
  );

  function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  }

  //Obtained
  let count = [];
  streak.forEach(function (i) {
    count[i - 1] = (count[i - 1] || 0) + 1;
  });

  let max = (2 * ri.length - 1) / 3;
  let desviacion = Math.sqrt((16 * ri.length - 29) / 90);
  let z = Math.abs((streak.length - max) / desviacion);
  if (z < 1.96) {
    ReactDOM.render(
      <div className="res">
        <input type="checkbox" id="resIndependentInput" defaultChecked={true} />
        <span>The data is independent</span>
      </div>,
      document.getElementById("resIndependent")
    );
    document.getElementById("resIndependentInput").checked = true;
  } else {
    ReactDOM.render(
      <div className="res">
        <input
          type="checkbox"
          id="resIndependentInput"
          defaultChecked={false}
        />
        <span>The data is not independent</span>
      </div>,
      document.getElementById("resIndependent")
    );
    document.getElementById("resIndependentInput").checked = false;
  }

  //Expected
  let expected = [];
  for (let i = 1; i <= count.length; i++) {
    expected.push(
      (2 / factorial(i + 3)) *
        (ri.length * (i ** 2 + 3 * i + i) - (i ** 3 + 3 * i ** 2 - i - 4))
    );
  }
  while (expected[expected.length - 1] < 5) {
    expected[expected.length - 2] += expected[expected.length - 1];
    expected.pop();
  }
  while (count[count.length - 1] < 5) {
    count[count.length - 2] += count[count.length - 1];
    count.pop();
  }

  if (count.length != expected.length) {
    ReactDOM.render(
      <div className="res">
        <input type="checkbox" id="resStreakInput" defaultChecked={false} />
        <span>
          The data does not meet the requirements to perform this test
        </span>
      </div>,
      document.getElementById("resStreak")
    );
    document.getElementById("resStreakInput").checked = false;
  } else {
    const result = chiSqrtTest(count, expected);
    if (count.length <= 0) {
      ReactDOM.render(
        <div className="res">
          <input type="checkbox" id="resStreakInput" defaultChecked={false} />
          <span>
            The data does not meet the requirements to perform this test
          </span>
        </div>,
        document.getElementById("resStreak")
      );
      document.getElementById("resStreakInput").checked = false;
      return;
    }
    let uniformTest = (1 - chi.cdf(result, count.length)) * 100;
    if (uniformTest > 5) {
      ReactDOM.render(
        <div className="res">
          <input type="checkbox" id="resStreakInput" defaultChecked={true} />
          <span>Streak lengths meet expected data</span>
        </div>,
        document.getElementById("resStreak")
      );
      document.getElementById("resStreakInput").checked = true;
    } else {
      ReactDOM.render(
        <div className="res">
          <input type="checkbox" id="resStreakInput" defaultChecked={false} />
          <span>Streak lengths do not meet expected data</span>
        </div>,
        document.getElementById("resStreak")
      );
      document.getElementById("resStreakInput").checked = false;
    }
  }

  ReactDOM.render(
    <span>
      There is {uniform.toFixed(2)}% confidence that the next number in the list
      will follow an uniform distribution
    </span>,
    document.getElementById("sol")
  );
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="container">
          <h1>Test for Random Numbers</h1>
          <h3>Insert numbers between 0 and 1, separated by a space</h3>
          <input size="50" type="text" name="randomnumbers" id="ri"></input>
          <button onClick={chiSqrt}>Calculate</button>
          <div id="sol"></div>
          <div id="linechart"></div>
          <div id="resUniform"></div>
          <div id="resIndependent"></div>
          <div id="resStreak"></div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
