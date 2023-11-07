import React from "react";
import './landing.css';
import img1 from './images/robbery.jpg';
import { Link } from "react-router-dom";

const navbar = () => {
    return (
        <div>
        <div>
        <nav >
            <h1>ComputerVision</h1>
            <div>
                <ul id="navbar">
                    <li><Link className="active" to="/live"> Live Detection </Link></li>
                    <li><Link to="/face"> Upload Faces </Link></li>
                    <li><Link to="/video"> Upload video </Link></li>
                    <li><Link to="/signin"> LogOut </Link></li>
                </ul>
            </div>
        </nav>
        </div>
        <div className="image">
        <img src= {img1} ></img>
    </div>
    </div>
         )
        }
        
        export default navbar;