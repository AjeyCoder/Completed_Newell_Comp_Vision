import React, { useState } from "react";
import "./signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Signup = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const handleup = async (event) => {
    try {
      const response = await axios.post('http://localhost:5000/signup',{
        name,
        email,
        password,
      });
      if (response.status === 201) {
        try{
          console.log("Response Data:", response.data); // Check the structure of response data
          const responseData = response.data; // Assuming the response is nested under 'resp'
          console.log("responseData:", responseData);
          if (responseData && responseData.id && responseData.email && responseData.user) {
              localStorage.setItem('id', responseData.id);
              localStorage.setItem('email', responseData.email);
              localStorage.setItem('user' , responseData.user);
              navigate("/signin");
           } else {
              console.error("Id or email not found in the response data.");
           }
        } catch (error) {
          console.error("Error occurred while processing response data:", error);
        }
       }
       else {
        console.error(response.data);
       }
     } catch (error) {
      console.error('An error occurred:', error);
    }
  };



  
     

  return (
    <>
      <div className="container-up">
        <div className="header">
          <div className="text">ComputerVision</div>
          <div class="line"></div>
        </div>
        <div className="inputs-up">
        <div className="head-up">
          <h1>sign-up</h1>

          </div>
          <div className="allign-up">
          <div className="input">
            <input
              value={name}
              onChange={(event) => setname(event.target.value)}
              type="text"
              placeholder="Name"
            />
          </div>
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
          <button onClick={handleup} className="up">
            Sign-up
          </button>
          <li><Link className="link" to="/"> Do you already have account ? please sign in.</Link></li>
        </div>
        </div>
      </div>
    </>
  );
};
