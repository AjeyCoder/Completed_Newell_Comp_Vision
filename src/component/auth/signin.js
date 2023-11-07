
import React, { useState } from "react";
import "./std.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Signin = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const handlein = async (event) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });
      if (response.status === 201) {
            navigate("/landing");  
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error occurred during the request:", error);
    }
  };
  

  return (
    <>
      <div className="wrapper">
        <div className="form">
          <div className="heading">ComputerVision</div>
          <div class="line"></div>
        </div>
        <div className="inputs">
          <div className="head">
          <h1>Login</h1>

          </div>
          <div className="allign">
          <div>
          <div className="input">
            <input
              value={email}
              onChange={(event) => setemail(event.target.value)}
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="input">
            <input
              value={password}
              onChange={(event) => setpassword(event.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>
          
        </div>
        <div className="submit-container">
          <button onClick={handlein} className="in">
            Sign-in
          </button>
          <li><Link className="link" to="/signup"> Don`t have account? please signup</Link></li>
        </div>
      </div>
      </div>
      </div>
    </>
  );
}

export default Signin;

