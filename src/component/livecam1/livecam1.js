import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./livecam.css";
import axios from "axios";

export const Livecam1 = () => {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const [isCameraRunning, setIsCameraRunning] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  

  

  const startCamera = () => {
    if (!isCameraRunning) {
      if (videoRef.current) {
        videoRef.current.play();
      }
      setIsCameraRunning(true);
      setIsFullScreen(false);

    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      console.log("Camera Paused")
      videoRef.current.pause();
      setIsCameraRunning(false);
      setIsFullScreen(false);
      console.log("Camera Paused now ")
      sendPauseMessageToBackend();
    }
  };

  const sendPauseMessageToBackend = async () => {
    const email = localStorage.getItem("email");
    try {
      const response = await axios.post("http://localhost:5000/facerecogniser", {
        email: email ,
        message: "Camera paused",
      });
      if (response.status === 220) {
        console.log("Pause message sent successfully.");
      } else {
        console.error("Failed to send the pause message to the backend.");
      }
      
    } catch (error) {
      console.error("Error sending pause message:", error);
    }

  };


  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (!isFullScreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if (videoRef.current.mozRequestFullScreen) {
          videoRef.current.mozRequestFullScreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
          videoRef.current.webkitRequestFullscreen();
        } else if (videoRef.current.msRequestFullscreen) {
          videoRef.current.msRequestFullscreen();
        }
        setIsFullScreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        setIsFullScreen(false);
      }
    }
  };
  const captureAndSendFrame = async () => {
    if (videoRef.current ) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvas.width,
        canvas.height
      );
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      sendDataToBackend(imageDataUrl);
      }
    
  };

  const sendDataToBackend = async (imageDataUrl) => {
    const email = localStorage.getItem("email");
    try {
      const response = await axios.post("http://localhost:5000/facerecogniser", {
        frames: imageDataUrl,
        email: email,
        message : "Camera not Paused"
      });

      if (response.status === 201) {
        console.log("Frame sent successfully.");
        setImageUrls((prevUrls) => [...prevUrls, response.data.image_file]);
      } 
    } catch (error) {
      console.error("Error sending frame:", error);
    }
  };

  const clearProcessedFrames = () => {
    setImageUrls([]);
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          intervalRef.current = setInterval(captureAndSendFrame, 1000); 
        }
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  }, []);

  return (
    <div className="livecam-container">
      <div>
        <nav>
          <div>
            <h1>ComputerVision</h1>
          </div>
          <div>
            <ul id="navbar">
              <li>
                <Link className="active" to="/landing">
                  HOME
                </Link>
              </li>
              <li>
                {isCameraRunning ? (
                  <button onClick={stopCamera}>Pause Camera</button>
                ) : (
                  <button onClick={startCamera}>Resume Camera</button>
                )}
              </li>
              <li>
                <button onClick={clearProcessedFrames}>Clear Frames</button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="video-frame">
        <video
          ref={videoRef}
          autoPlay
          type="video/mp4"
          onClick={toggleFullScreen}
        ></video>
      </div>

      <div className="element">
        {imageUrls.map((imageUrl, index) => (
          
          <img
            key={index}
            src={imageUrl}
            alt={`Image ${index}`}
            style={{ width: "300px", height: "300px" , margin:"10px"}}
          />

        ))}
      </div>
    </div>
  );
};