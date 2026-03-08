import "./DetectionLab.css";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";
import axios from "axios";
import { useRef, useState } from "react";
import ResultDisplay from "./ResultDisplay"; // Import the new child component

function DetectionLab() {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  // --- NEW STATE VARIABLES ---
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);

  const navigate = useNavigate();

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFiles = (files) => {
    const selected = Array.from(files);

    if (selected.length + images.length > 4) {
      alert("Maximum 4 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...selected]);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const handleUpload = async () => {
    if (!isLoggedIn()) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (images.length === 0) {
      alert("Upload at least one image");
      return;
    }

    const formData = new FormData();

    images.forEach((img) => {
      formData.append("images", img);
    });

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/detect-disease",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // 🔹 Navigate to Result page and send data
      navigate("/result", {
        state: {
          result: res.data,
          images: images
        }
      });

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Detection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="lab-section">
      <div className="lab-header">
        <h2>AI Detection Lab</h2>
        <p>Experience real-time AI-powered plant analysis</p>
      </div>

      <div className="lab-wrapper">
        {/* LEFT SIDE (Unchanged) */}
        <div className="lab-left">
          <div
            className="upload-box"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              hidden
              onChange={handleChange}
            />
            <div className="upload-content">
              <h3>Drag & Drop Leaf Image</h3>
              <p>or click to upload (max 4)</p>
            </div>
          </div>

          {images.length > 0 && (
            <div className="preview-grid">
              {images.map((img, index) => (
                <div className="preview-box" key={index}>
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="preview-img"
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="lab-features">
            <span>Instant Scan</span>
            <span>AI Powered</span>
            <span>Accurate Results</span>
          </div>

          <button className="scan-btn" onClick={handleUpload}>
            Start Scanning
          </button>
        </div>

        {/* RIGHT SIDE (Now Dynamic) */}
        <div className="lab-right">
          {isLoading ? (
            <div className="loading-container">
              <div className="loader-circle"></div>
              <p>Analyzing images with AI...</p>
            </div>
          ) : resultData ? (
            // Pass the result as props to the child component
            <ResultDisplay result={resultData} />
          ) : (
            // Default View
            <div className="hologram-container">
              <div className="hologram-glow"></div>
              <div className="grid-overlay"></div>
              <div className="hologram-leaf">🌿</div>
              <div className="scan-line"></div>
              <div className="particles">
                {Array.from({ length: 20 }).map((_, idx) => (
                  <span key={idx}></span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DetectionLab;