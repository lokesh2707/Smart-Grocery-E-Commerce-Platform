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

      <section className="hero-section">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-badge">AI-powered grocery experience</span>
          <h1>Shop smarter with instant list matching and fresh essentials.</h1>
          <p>From handwritten lists to doorstep delivery, SmartCart AI makes everyday shopping feel effortless.</p>

          <div className="hero-actions">
            <button onClick={() => navigate("/products")} className="hero-button">
              Start Shopping
            </button>
            <button onClick={() => navigate("/products")} className="hero-button secondary">
              Browse Products
            </button>
          </div>

          <div className="hero-metrics">
            <div className="hero-highlight-card">
              <strong>2 min</strong>
              <span>list-to-cart flow</span>
            </div>
            <div className="hero-highlight-card">
              <strong>99% match</strong>
              <span>smart product accuracy</span>
            </div>
            <div className="hero-highlight-card">
              <strong>Fast delivery</strong>
              <span>same-day availability</span>
            </div>
          </div>
        </div>
      </section>

      <section className="value-section">
        <div className="section-heading">
          <span className="section-kicker">Why SmartCart AI</span>
          <h2>Everything you need for a faster, calmer grocery run.</h2>
        </div>

        <div className="value-grid">
          <div className="value-card">
            <div className="feature-icon">📸</div>
            <h3>AI Shopping List</h3>
            <p>Upload a handwritten list and let AI auto-detect and match groceries.</p>
          </div>

          <div className="value-card">
            <div className="feature-icon">🛒</div>
            <h3>Streamlined Cart</h3>
            <p>Browse essentials and checkout in a few taps without friction.</p>
          </div>

          <div className="value-card">
            <div className="feature-icon">📄</div>
            <h3>Instant Receipts</h3>
            <p>Save every order with clean summaries and downloadable receipts.</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Smart Matching</h3>
          <p>Find the closest products instantly and reduce decision fatigue.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🥬</div>
          <h3>Fresh Picks</h3>
          <p>Discover everyday favorites with a polished shopping experience.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3>Personalized Help</h3>
          <p>Get recommendations that adapt to your routine and budget.</p>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <span className="section-kicker">Popular categories</span>
          <h2>Find staples, snacks, and fresh picks in one polished place.</h2>
        </div>

        <div className="category-grid">
          <div className="category-card">Fresh Produce</div>
          <div className="category-card">Pantry Essentials</div>
          <div className="category-card">Beverages</div>
          <div className="category-card">Household</div>
        </div>
      </section>

      <section className="ocr-section">
        <h2>Upload Your Shopping List</h2>
        <p>Image, PDF or Word — we’ll analyze and match your groceries automatically.</p>

        <div className="upload-area">
          <div className="upload-card">
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
            <div className="upload-hint">PNG, JPG, PDF, and DOCX files supported</div>

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
      </section>
    </div>
  );
};

export default Home;