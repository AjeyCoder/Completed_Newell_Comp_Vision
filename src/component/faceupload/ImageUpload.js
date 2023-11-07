import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./image.css";

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [description, setDescription] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(file);
    }
  };

  const handleUploadButtonClick = () => {
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }
    const user = localStorage.getItem('user');
    const id = localStorage.getItem('id');
    const email = localStorage.getItem('email');
    
    const formData = new FormData();
    formData.append('file', image);
    formData.append('name', name);
    formData.append('mobileNumber', mobileNumber);
    formData.append('description', description);
    formData.append('user', user);
    formData.append('id', id); 
    formData.append('email', email);
    

    const token = "adhgsdaksdhk938742937423";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    fetch("http://localhost:5000/upload_profile_pic", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
  
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="image">
      <div>
        <nav>
          <div>
            <h1>ComputerVision</h1>
          </div>
          <div>
            <ul id="navbar">
              <li>
                <Link to="/landing"> HOME</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="box-decoration">
        <div className="image">
          <div className="image-upload-side">
            <label htmlFor="file" className="image-upload-label">
              {image ? image.name : "Choose an image"}
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <div
              onClick={() => document.getElementById("image").click()}
              style={{ cursor: "pointer" }}
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="upload image"
                  className="img-display-after"
                />
              ) : (
                <img
                  src="./photo.png"
                  alt="upload image"
                  className="img-display-before"
                />
              )}
            </div>
          </div>
        </div>
        <div className="input-info">
          <div className="input-container">
            <div className="input-side">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <button
            className="image-upload-button"
            onClick={handleUploadButtonClick}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
