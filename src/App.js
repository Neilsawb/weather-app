import React, { Component} from 'react';
import './App.css';
import Weatherparameter from './weatherparameter';

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
      this.setState({
        temp: currentWeather[10].values[0],
        windspeed: currentWeather[14].values[0],
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
