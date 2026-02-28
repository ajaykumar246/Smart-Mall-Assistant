
import React, { useRef, useState } from "react";
import getCookie from "../../utils";
import { API_BASE } from "../../utils";
import Navbar from "../components/Navbar";

export default function ScanPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [recommendedImage, setRecommendedImage] = useState(null);
  const [backendMessage, setBackendMessage] = useState("");

  const csrftoken = getCookie("csrftoken");

  const openCamera = async () => {
    setError("");
    setCapturedImage(null);
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError("Unable to access camera. Please allow camera permissions.");
      setCameraOpen(false);
    }
  };

  const closeCamera = () => {
    setCameraOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");
      setCapturedImage(imageDataUrl);
      setCameraOpen(false);
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  function dataURLtoFile(dataUrl, filename) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  const handleUpload = async () => {
    if (!capturedImage) return;
    try {
      const formData = new FormData();
      const file = dataURLtoFile(capturedImage, "scan.png");
      formData.append("file", file);
      formData.append("upload_preset", "your_unsigned_preset");
      const response = await fetch(
        "https:/api.cloudinary.com/v1_1/<your-cloud-name>/image/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();
      console.log("Uploaded to Cloudinary:", data.secure_url);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
    }
  };

  const uploadImage = async () => {
    if (!capturedImage) {
      alert("Please capture an image first!");
      return;
    }

    setLoading(true);
    setRecommendedImage(null);
    setBackendMessage("");

    try {
      const file = dataURLtoFile(capturedImage, "captured.png");
      const formData = new FormData();
      formData.append("image", file);

      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      const response = await fetch(`${API_BASE}/api/upload/`, {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload Response:", data);

      if (response.ok) {
        if (data.recommended_image) {
          setRecommendedImage(data.recommended_image);
          setBackendMessage(data.text);
        } else if (data.message) {
          setRecommendedImage(null);
          setBackendMessage(data.message);
        } else {
          setBackendMessage("No recommendation found.");
        }
      } else {
        setBackendMessage(data.error || "Unknown error occurred.");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setBackendMessage("An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-mesh relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-3xl pointer-events-none" />

      <Navbar />

      <div className="relative z-10 w-full flex items-center justify-center min-h-screen px-4 pt-20 pb-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="gradient-border">
            <div className="glass-card p-7">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
                  📸
                </div>
                <h2 className="text-2xl font-bold text-white">Scan a Product</h2>
                <p className="text-gray-400 text-sm mt-1">Capture or upload to find matches</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                {!cameraOpen && (
                  <button
                    onClick={openCamera}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 text-sm"
                  >
                    📷 Open Camera
                  </button>
                )}

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    id="fileInput"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="fileInput"
                    className="block text-center bg-gradient-to-r from-pink-500 to-rose-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition-all duration-300 cursor-pointer text-sm"
                  >
                    📁 Choose File
                  </label>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center mb-4 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                  {error}
                </div>
              )}

              {/* Camera View */}
              {cameraOpen && (
                <div className="flex flex-col items-center gap-4 w-full mb-4">
                  <video ref={videoRef} className="rounded-xl w-full max-h-64 bg-black" autoPlay playsInline />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={handleCapture}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 text-sm"
                    >
                      Capture
                    </button>
                    <button
                      onClick={closeCamera}
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Captured Image Preview */}
              {capturedImage && (
                <div className="w-full flex flex-col items-center gap-3 mt-2">
                  <div className="w-full rounded-xl overflow-hidden border border-white/10">
                    <img src={capturedImage} alt="Captured" className="w-full max-h-64 object-cover" />
                  </div>
                  <input
                    type="text"
                    className="input-glass text-sm"
                    placeholder="Describe what you're looking for..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                  <button
                    onClick={uploadImage}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 ${loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg hover:shadow-indigo-500/25"
                      }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      "Find Similar Products"
                    )}
                  </button>
                </div>
              )}

              {/* Backend Recommendation */}
              {(recommendedImage || backendMessage) && (
                <div className="w-full mt-6 glass-card p-4 border-emerald-500/20">
                  {recommendedImage && (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm">
                          ✨
                        </div>
                        <h3 className="text-base font-semibold text-white">Recommended Product</h3>
                      </div>
                      <img
                        src={recommendedImage}
                        alt="Recommendation"
                        className="rounded-xl w-full max-h-64 object-cover border border-white/10"
                      />
                    </>
                  )}
                  {backendMessage && (
                    <p className="text-gray-300 mt-3 text-sm text-center">{backendMessage}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
