import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import OCRConfirmation from "../components/OCRConfirmation";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [ocrMatchData, setOcrMatchData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleOCRUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    toast.info("Processing...");

    try {
      const res = await api.post("/ocr/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 70000
      });

      if (!res.data.cleanedLines.length) {
        toast.error("No readable items found.");
        return;
      }

      const match = await api.post("/ocr/match", {
        lines: res.data.cleanedLines
      });

      // Show confirmation modal instead of auto-adding
      setOcrMatchData(match.data);
      setShowConfirmation(true);
      toast.dismiss();

    } catch (err) {
      toast.error("Failed to process file");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleOCRConfirm = async (confirmedItems) => {
    try {
      console.log('OCR Confirmed Items:', confirmedItems); // Debug log
      
      if (!confirmedItems || confirmedItems.length === 0) {
        toast.error('No items to add to cart');
        return;
      }

      // Save to localStorage with the key that Cart.js expects
      console.log('Saving to localStorage with key "ocrMatchedItems"');
      localStorage.setItem("ocrMatchedItems", JSON.stringify(confirmedItems));
      console.log('Updated cart:', confirmedItems); // Debug log
      
      setShowConfirmation(false);
      setFile(null);
      toast.success(`Added ${confirmedItems.length} item${confirmedItems.length !== 1 ? 's' : ''} to cart!`);
      
      // Redirect to cart after a short delay
      setTimeout(() => navigate("/cart"), 1000);
    } catch (error) {
      console.error('Error in handleOCRConfirm:', error); // Debug log
      toast.error('Failed to add items to cart: ' + error.message);
    }
  };

  const handleOCRCancel = () => {
    setShowConfirmation(false);
    setOcrMatchData(null);
    setFile(null);
  };

  return (
    <div className="home">
      {/* Show confirmation modal if OCR was processed */}
      {showConfirmation && ocrMatchData && (
        <OCRConfirmation 
          matchData={ocrMatchData}
          onConfirm={handleOCRConfirm}
          onCancel={handleOCRCancel}
        />
      )}

      {/* HERO SECTION */}
      <section className="hero-section">
        
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>Fresh, Fast & Delivered to Your Doorstep</h1>
          <p>Shop groceries, daily needs & essentials — all in one place.</p>

          <button onClick={() => navigate("/products")} className="hero-button">
            Start Shopping
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📸</div>
          <h3>AI Shopping List</h3>
          <p>Upload your handwritten list and let AI auto-add items to cart.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🛒</div>
          <h3>Easy Shopping</h3>
          <p>Explore products across categories with smooth navigation.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📄</div>
          <h3>Instant Receipts</h3>
          <p>Download PDF receipts for all your orders instantly.</p>
        </div>
      </div>

      {/* OCR UPLOAD */}
      <div className="ocr-section">
        <h2>Upload Your Shopping List</h2>
        <p>Image, PDF or Word — we’ll analyze and match your groceries automatically.</p>

        <div className="upload-area">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
            hidden
          />
          <label htmlFor="file-upload" className="upload-label">
            {file ? file.name : "Choose Image or PDF"}
          </label>

          {file && (
            <button
              onClick={handleOCRUpload}
              disabled={uploading}
              className="btn-primary"
            >
              {uploading ? "Processing..." : "Process & Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;