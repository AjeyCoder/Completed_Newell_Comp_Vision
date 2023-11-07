import React, { useState } from "react";
import "./faceupload.css";
import { Link } from "react-router-dom";
import axios from "axios";


export const Uploadfaces = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoUpload = async () => {
    if (selectedVideo) {
      const formData = new FormData();
      formData.append("video", selectedVideo);
      const request = {
        method: "POST",
        body: formData,
      };
      fetch("http://localhost:5000/susact", request)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
        })
        .catch((error) => console.error("Error:", error));
    }
  };


  return (
    <div className="video-up">
      <div>
        <nav>
          <div>
            <h1>ComputerVision</h1>
          </div>
          <div>
            <ul id="navbar">
              <li><Link to="/landing"> HOME</Link></li>
            </ul>
          </div>
        </nav>
      </div>

    <div className="container">
      <h1>Video Upload</h1>
      <p>Select a video file to upload:</p>
      <div className="file-upload-container">
      <label htmlFor="video-upload" className="upload-label">
        Choose File
      </label>
      <input
        type="file"
        id="video-upload"
        onChange={(e) => setSelectedVideo(e.target.files[0])}
      />
      <button
        id="upload-button"
        className="upload-button"
        disabled={!selectedVideo}
        onClick={handleVideoUpload}
      >
        Upload Video
      </button>
      </div>
    </div>
    </div>
  );
};
