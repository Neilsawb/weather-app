import React, { Component} from 'react';
import './App.css';
import Weatherparameter from './weatherparameter';
let previousTemp = null;

function sendDataToThingsBoard(temperature) {
  
  // set up POST data to send to thingsboard. as per curl example from thingsboard.
  var url = 'http://70.34.199.188:31131/api/v1/Wlpc95hHKNE0TWOl6Wxq/telemetry' // --header "Content-Type:application/json'
  var data = {"smhiTemperature":temperature};
  
  
  fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow'
    }) 
    .then(response => {
      if (response.status === 200) {
        console.log(response.text());
    } else {
     throw new Error('Something went wrong on api server!');
    }
  })
  .catch(error => {
    console.error(error);
  });
  previousTemp = temperature; // update previous temp with new temp.
}

class App extends Component {
  
  state = {
    temp: null,
    windspeed: null,
    rainfall: null,
  };

  componentDidMount() {
    fetch("https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/17.924/lat/59.287/data.json")
    .then(res => res.json())
    .then(data => {
      console.log(data);
      const currentWeather = data.timeSeries[0].parameters;
      if (currentWeather[10].values[0] !== previousTemp) {
        console.log("calling sendDataToThingsBoard !");
        sendDataToThingsBoard(currentWeather[10].values[0]);
      }
      this.setState({
        temp: currentWeather[10].values[0],
        windspeed: currentWeather[4].values[0],
        rainfall: currentWeather[3].values[0]
      });
    });
  }

  
  
  render() {
    const { temp, windspeed, rainfall} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Current weather conditions in Skärholmen</h1>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1 1 1",
              gridGap: "24px"
            }}
          > 
            <Weatherparameter unit = "°C">{temp}</Weatherparameter>
            <Weatherparameter unit = "m/s">{windspeed}</Weatherparameter>
            <Weatherparameter unit = "mm/h">{rainfall}</Weatherparameter>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
