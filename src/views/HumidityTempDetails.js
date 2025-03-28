import React, {useEffect,useState} from "react";
import plans from "../images/plans.png";
import axios from 'axios';
import Header from "../components/Header";
import { Line } from 'react-chartjs-2';
import { CircularProgressbar } from 'react-circular-progressbar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import Switch from '@mui/material/Switch';
import { SliderData } from "./sliderData";
import ImageSlider2 from "./imageSlider2";
import buildingPhoto from "../images/ShileyPhotos/IMG_4502.png";

ChartJS.register(ArcElement, Tooltip, Legend, Title);


export default function HumidityTempDetails() {

    const isUsingDummyData = false; 

    // Initialize state for temperature and humidity with dummy values
    const [temperature, setTemperature] = useState(25); // Dummy temperature value in Celsius
    const [humidity, setHumidity] = useState(60); // Dummy humidity value in percentage
    const [temperatureDataOverDay, setTemperatureDataOverDay] = useState([]);
    const [error, setError] = useState(null);
    const [checked, setChecked] = useState(true);

    const handleChange = (event) => {
      //alert(event.target.checked);
      setChecked(event.target.checked);
      if (event.target.checked == true) {
        loadTemperatureDataOverDay(isUsingDummyData, "indoor");
      } else {
        loadTemperatureDataOverDay(isUsingDummyData, "outdoor");
      }
    };

    useEffect(() => {
      loadTemperatureDataOverDay(isUsingDummyData, "indoor");

        // Simulate updating temperature and humidity every 5 seconds
        const intervalId = setInterval(() => {
            // Generate random dummy values for temperature and humidity
            const newTemperature = Math.floor(Math.random() * 50); // Random value between 0 and 50
            const newHumidity = Math.floor(Math.random() * 100); // Random value between 0 and 100

            setTemperature(newTemperature);
            setHumidity(newHumidity);
        }, 5000);
    
        return () => clearInterval(intervalId);
    }, []);


    function loadTemperatureDataOverDay(useDummyData, runningEnv) {
        if (useDummyData) {
            var dummyData = [60, 70, 75, 61, 55, 63, 76, 71, 62, 68, 69, 73,
                    67, 75, 59, 60, 78, 90, 66, 77, 50, 55, 71, 63];
            if (runningEnv == "outdoor") {
              dummyData = [25, 15, 23, 42, 28, 27, 26, 24, 75, 27, 55, 24,
                66, 43, 23, 60, 28, 90, 32, 100, 50, 85, 25, 95];
            }
            setTemperatureDataOverDay(dummyData);
        } else {
            const url = "http://localhost:8080/dailytemperature?env=" + runningEnv;
            axios.get(url)
              .then (res => {
                  console.log(res.data);
                  setTemperatureDataOverDay(res.data.temperatureUsage);
                  setError(null);
              })
              .catch((err) => {
                  console.log(err);
                  setError(err);
            });
        }
    }

    const lineOptions = {
      scales: {
        y:
          {
            min: 0,
            max: 120,
            stepSize: 5,
          },
      },
    };

    const temperatureLineData = {
        labels: ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', 
                  '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'],
        datasets: [
          {
            label: 'Temperature',
            //data: [25, 24, 23, 26, 28, 27, 26, 24, 23, 27, 25, 24,
            //      25, 24, 23, 26, 28, 27, 26, 24, 23, 27, 25, 24], // Sample temperature values
            data: temperatureDataOverDay,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
    }

    //change color based on humidity level
    const calcColor = (percent, start, end) => {
      let a = percent / 100,
          b = (end - start) * a,
          c = b + start;

      // return an CSS hsl color string
      return 'hsl(' + c + ', 100%, 50%)';
    };

    const BarBounds = ({ valueStart, valueEnd, children }) => {
      const [value, setValue] = React.useState(valueStart);
      React.useEffect(() => {
          setValue(valueEnd);
      }, [valueEnd]);

      return children(value);
    };


    return (
        <>
            <Header />

            <div className="temperature-humidity-container">

              <div className="tempInfo">
                    <h2 style = {{textAlign:"center", color: 'white', textShadow: '1px 1px 2px black'}}>Thermal Comfort</h2>
              </div>
              <div className="temperature-graph-container">              
                <div className="temperature-container">
                  <div className="temperature">
                    <p><b> {temperature} &deg;F </b></p>
                  </div>
                  <div className="temperature-graph">
                    <Line data={temperatureLineData} options={lineOptions}/>
                    <br/>
                    <h5>Temperature over a 24 Hour Day Period</h5>
                    Average Outdoor Air Temperature
                    <Switch
                      checked={checked}
                      onChange={handleChange}
                      inputProps={{ 'aria-label': 'Indoor Temperature' }}
                    />
                    Average Indoor Air Temperature
                  </div>
                </div>
                <div className="humidity-container">
                  <div className="humidity">
                    <p><b> Outdoor Humidity: {humidity}% </b></p>
                  </div>
                  
                  <div className="humidity-graph">
                    <BarBounds valueStart={0} valueEnd={humidity}>
                      {
                        (value) => (
                          <CircularProgressbar
                            value={value}
                            circleRatio={0.7} /* Make the circle only 0.7 of the full diameter */
                            styles={
                              {
                                trail: {
                                  strokeLinecap: 'butt',
                                  transform: 'rotate(-126deg)',
                                  transformOrigin: 'center center', 
                                  stroke: "#808080"
                                },
                                path: { 
                                  strokeLinecap: 'butt',
                                  transform: 'rotate(-126deg)',
                                  transformOrigin: 'center center',
                                  stroke: calcColor(value, 0, 120),
                                },
                              }
                            }
                            strokeWidth={10}
                          />
                        )
                      }
                    </BarBounds> 
                  </div>
                    
                  
                   
                  </div>
              </div>

            {/* <img class="displayplans" src={plans}></img>  
            </div>
            <div className="home">
            <div className="homeVideoContainer" >
                    <ImageSlider2 slides={SliderData} style={{ filter: 'blur(30px)'}} />
                </div>
                <img className="homePhoto" src={buildingPhoto} alt="Building" /> */}
            </div> 
       </>
    );
}
