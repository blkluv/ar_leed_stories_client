import React from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../images/up_shiley_marcos_logo_trans.png";
import menuButton from "../images/toggleMenu.png";
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    return (
    <>
        <header>
        <div class="inner">
            <div class="logo">
                <div>
                    <Link to="/">
                        <img src={logo}></img>
                    </Link> 
                </div>
            </div>
            <div class="buttons">
            <nav>
                <li><span>
                    <NavLink to="/leed-stories" activeClassName="activeLink" className="navButton">
                        LEED Stories
                    </NavLink>
                </span></li>
                <li><span>
                    <NavLink to="/humidityTemp-details" activeClassName="activeLink" className="navButton">
                        Humidity/Temperature
                    </NavLink>
                </span></li>
                <li><span>
                    <NavLink to="/air-details" activeClassName="activeLink" className="navButton">
                        Air Quality
                    </NavLink>
                </span></li>
                <li><span>
                    <NavLink to="/solar-details" activeClassName="activeLink" className="navButton">
                        Electricity/Solar
                    </NavLink>
                </span></li>
            </nav>
            </div>
        </div>
    </header>


                    <button className="sidebarButton" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        <img className="menuButtonImage" src={menuButton}></img>
                    </button>
                    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                        <NavLink to="/" activeClassName="activeLink" className="navButton">
                            Home
                        </NavLink>
                        <NavLink to="/leed-stories" activeClassName="activeLink" className="navButton">
                            LEED Stories
                        </NavLink>
                        <NavLink to="/electric-details" activeClassName="activeLink" className="navButton">
                            Electricity
                        </NavLink>
                        <NavLink to="/humidityTemp-details" activeClassName="activeLink" className="navButton">
                            Humidity/Temperature
                        </NavLink>
                        <NavLink to="/water-details" activeClassName="activeLink" className="navButton">
                            Water
                        </NavLink>
                        <NavLink to="/air-details" activeClassName="activeLink" className="navButton">
                            Air Quality
                        </NavLink>
                        <NavLink to="/solar-details" activeClassName="activeLink" className="navButton">
                            Solar
                        </NavLink>
                        

            </div>
        </>
    );
}