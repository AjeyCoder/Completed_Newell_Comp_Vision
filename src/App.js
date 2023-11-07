import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from  "./component/landing"
import { Livecam } from './component/livecam/livecam';
import { Signin } from './component/auth/signin';
import { Signup } from './component/auth/signup';
import {Livecam1} from './component/livecam1/livecam1';
import { Uploadfaces } from './component/video/uploadfaces';
import ImageUpload from "./component/faceupload/ImageUpload";
import Navbar from "./component/navbar";



function App()  {

  return(
    <>
    <Router>
      <Routes>
      <Route path="/" element={< Signin />}/>
      <Route path="/landing" element={< Landing />}/>
      <Route path="/live" element={< Livecam />}/>
      <Route path="/signin" element={< Signin />}/>
      <Route path="/signup" element={< Signup />}/>
      <Route path="/face" element={< ImageUpload />}/>
      <Route path="/video" element={< Uploadfaces />}/>
      <Route path="/nav" element={< Navbar />}/>
      <Route path="/live1" element={< Livecam1 />}/>


      

      </Routes>
    </Router>
    </>

  )




 //return <ImageUpload/>;
};

export default App;
