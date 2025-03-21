import React, {useEffect,useState} from "react";
import axios from 'axios';
import Header from "../components/Header";
import { Line } from 'react-chartjs-2';
import { CircularProgressbar } from 'react-circular-progressbar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { SliderData } from "./sliderData";
import ImageSlider2 from "./imageSlider2";
import buildingPhoto from "../images/ShileyPhotos/IMG_4502.png";
ChartJS.register(ArcElement, Tooltip, Legend, Title);



export default function AirQualityDetails() {

    // Initialize state for air quality with dummy values
    const [humidity, setHumidity] = useState(60); // Dummy humidity value in percentage
    const [temperatureDataOverDay, setTemperatureDataOverDay] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
      loadAirQualityData(true);

        // Simulate updating air quality every 5 seconds
        const intervalId = setInterval(() => {
            // Generate random dummy values for air quality
            const newHumidity = Math.floor(Math.random() * 250); // Random value between 0 and 100
            setHumidity(newHumidity);
        }, 5000);
    
        return () => clearInterval(intervalId);
    }, []);


    function loadAirQualityData(useDummyData) {
        if (useDummyData) {
            const dummyData = [25, 24, 23, 26, 28, 27, 26, 24, 23, 27, 25, 24,
                    25, 24, 23, 26, 28, 27, 26, 24, 23, 27, 25, 24];
            setTemperatureDataOverDay(dummyData);
        } else {
            axios.get(`http://localhost:8080/airQualityIndex`)
                .then (res => {
                    console.log(res.data);
                    setTemperatureDataOverDay(res.data.airQualityIndex);
                    setHumidity(res.data.airQualityIndex[res.data.airQualityIndex.length - 1]);
                    setError(null);
                })
                .catch((err) => {
                    console.log(err);
                    setError(err);
            });
        }
    }


    //change color based on air quality level
    const calcColor = (percent, start, end) => {
      let a = percent / 250,
          b = (start - end) * a, 
          c = b + end; 
  
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
            <div className="airquality-container">
             <div className="tempInfo">
                    <h2 style = {{textAlign:"center", color: 'white', textShadow: '1px 1px 2px black'}}>Outdoor Air Quality Index</h2>
              </div>
              <div className="temperature-graph-container">              
                <div className="humidity-container">
                  <div className="airQuality">
                    <p><b> Air Quality: {humidity} </b></p>
                  </div>
                  
                  <div className="airQuality-graph">
                    <BarBounds valueStart={0} valueEnd={humidity}>
                      {
                        (value) => (
                          <CircularProgressbar
                            value={value}
                            maxValue={50} /* The maximum value of the progress bar */
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
                <div className="text-container" style={{backgroundColor: 'rgb(232,232,255,0.3)', padding: '20px', borderRadius: '10px'}}>
                <h2 style={{color: 'black', textShadow: '1px 1px 2px white'}}>Interpreting Air Quality Index (AQI)</h2>
            <p style={{color: 'white', }}>The Air Quality Index (AQI) measures the quality of the air and its potential impact on health. Here's how to interpret the AQI:</p>
            <ul>
                <li style={{color: 'white', }}><span style={{ color: '#008000', textShadow: '1px 1px 2px black' }}><strong>0-50:</strong> Good</span> - Air quality is satisfactory, and air pollution poses little or no risk.</li>
                <li style={{color: 'white', }}><span style={{ color: '#c1d130', textShadow: '1px 1px 2px black' }}><strong>51-100:</strong> Moderate</span> - Air quality is acceptable; however, there may be some health concerns for sensitive individuals.</li>
                <li style={{color: 'white', }}><span style={{ color: '#de803e', textShadow: '1px 1px 2px black' }}><strong>101-150:</strong> Unhealthy for Sensitive Groups</span> - People with respiratory or heart conditions, children, and the elderly may experience health effects. General public is not likely to be affected.</li>
                <li style={{color: 'white', }}><span style={{ color: '#e36e1b', textShadow: '1px 1px 2px black' }}><strong>151-200:</strong> Unhealthy </span>- Everyone may begin to experience health effects; sensitive individuals may experience more serious health effects.</li>
                <li style={{color: 'white', }}><span style={{ color: '#e3401b', textShadow: '1px 1px 2px black' }}><strong>201-300:</strong> Very Unhealthy </span>- Health warnings of emergency conditions. The entire population is more likely to be affected.</li>
                <li style={{color: 'white', }}><span style={{ color: '#f21111',  textShadow: '1px 1px 2px black' }}><strong>301 and above:</strong> Hazardous</span> - Health alert: everyone may experience more serious health effects.</li>
            </ul>
            <p style={{color: 'white',textShadow: '1px 1px 2px black' }}> <strong>Lower AQI values indicate better air quality, while higher values indicate poorer air quality and increased health risks.</strong></p>
        
        
  </div>
             
              </div>
            </div>
            <div className="home">
            <div className="homeVideoContainer" >
                    <ImageSlider2 slides={SliderData} style={{ filter: 'blur(30px)'}} />
                </div>
                <img className="homePhoto" src={buildingPhoto} alt="Building" />
            </div>
        </>
    );
}
