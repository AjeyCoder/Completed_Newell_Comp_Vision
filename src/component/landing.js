import React from "react";
import './landing.css';
import img1 from './images/robbery.jpg';
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export const Landing = () => {
  const navigate = useNavigate();

  const handleLogout = async (event) =>{
    try {
      const response = await axios.post('http://localhost:5000/logout', null, {
           // This enables sending cookies with the request
      });

      if (response.status === 201) {
        navigate("/signin");
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error occurred during logout:', error);
    }
    }

    return (
    <div className="nav-container">
        <div>
        <nav >
            <h1>ComputerVision</h1>
            <div>
                <ul id="navbar">
                    <li><Link className="active" to="/live"> Suspicious Live </Link></li>
                    <li><Link className="active" to="/live1"> Face Live </Link></li>
                    <li><Link to="/face"> Upload Faces </Link></li>
                    <li><Link to="/video"> Upload video </Link></li>
                    <li>
                     <button onClick={handleLogout} classname = "in">Logout</button>
                    </li>
                </ul>
            </div>
        </nav>
        </div>
        <div className="imgaes-container">
            <img src= {img1} ></img>
        </div>
        <div className="overlay-text">
            <p>
            In today's world, security is paramount, especially in our homes and shops.
            Our project leverages cutting-edge technology to enhance security through live 
            object detection using CCTV cameras. Using state-of-the-art object detection models 
            and machine learning techniques, we've developed a system that can instantly identify 
            and alert you about any unauthorized objects or individuals in your monitored area.<br/>
            <br/>
            Our methodology involves collecting CCTV footage, preprocessing the data, and training a
            robust object detection model. This system can be seamlessly integrated with your existing 
            CCTV infrastructure, providing real-time alerts and peace of mind. Whether you're a homeowner 
            or a shop owner, this technology offers an extra layer of security, ensuring the safety of your 
            property and loved ones. Experience the future of security with our live object detection solution.
            </p>
        </div>

    </div>
        
    )
}

export default Landing;
