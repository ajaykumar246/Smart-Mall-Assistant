import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import getCookie from "../../utils";
import { API_BASE } from "../../utils";

function ChatPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [showImageDropdown, setShowImageDropdown] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingCaption, setPendingCaption] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const token = localStorage.getItem("authToken") || "null";
  useEffect(() => { }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPendingImage({ src: ev.target.result, file });
        setPendingCaption("");
      };
      reader.readAsDataURL(file);
    }
    setShowImageDropdown(false);
  };

  const handleCaptureImage = async () => {
    setShowImageDropdown(false);
    setCameraError("");
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraError("Unable to access camera. Please allow camera permissions.");
      setShowCamera(false);
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");
      console.log(imageDataUrl);
      setPendingImage({ src: imageDataUrl, file: null });
      setPendingCaption("");
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
      setShowCamera(false);
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const csrftoken = getCookie("csrftoken");
  const regex = /^--cdgf2025: \+91[0-9]{10}\n$/;

  const handleSend = async (e) => {
    e?.preventDefault();

    if (pendingImage && pendingImage.file) {
      const formData = new FormData();
      formData.append("image", pendingImage.file);

      try {
        const response = await fetch(`${API_BASE}/api/upload/`, {
          method: "POST",
          headers: { "X-CSRFToken": csrftoken },
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Image upload failed on the server.");
        }
        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: "user", text: pendingCaption, image: data.image },
        ]);
      } catch (error) {
        console.error("Error uploading image:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: "bot", text: "Sorry, the image could not be uploaded." },
        ]);
      } finally {
        setPendingImage(null);
        setPendingCaption("");
      }
      return;
    }

    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prevMessages) => [
      ...prevMessages,
      { from: "user", text: userMessage },
    ]);
    setInput("");

    fetch(`${API_BASE}/api/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ message: userMessage }),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error("Chat API request failed.");
        return resp.json();
      })
      .then((data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: "bot", text: data.response || "Response received." },
        ]);
      })
      .catch((err) => {
        console.error("Error sending message:", err);
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: "bot", text: "Sorry, something went wrong." },
        ]);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-mesh relative">
      {/* Decorative orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
        <Navbar />

        {/* Chat Container */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-3 sm:px-6 pt-20 pb-4 min-h-0 overflow-hidden">
          {/* Header */}
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold text-white">
              Chat <span className="text-gradient">Support</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">Ask anything about the mall</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-1 pb-4 min-h-0 space-y-3" style={{ overscrollBehavior: 'contain' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[80%] sm:max-w-xs shadow-lg ${msg.from === "user"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-md"
                    : "glass-card text-gray-200 rounded-bl-md"
                    }`}
                >
                  {msg.image ? (
                    <>
                      <img
                        src={msg.image}
                        alt="Captured"
                        className="max-w-[180px] max-h-[180px] rounded-lg mb-2"
                      />
                      {msg.text && <div className="mt-1 text-sm">{msg.text}</div>}
                    </>
                  ) : regex.test(msg.text) ? (
                    <a href={`tel:${msg.text.slice(14, 24)}`}>
                      <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 flex items-center gap-2">
                        📞 Call now
                      </button>
                    </a>
                  ) : (
                    <span className="text-sm leading-relaxed">{msg.text}</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Camera Modal */}
          {showCamera && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
              <div className="glass-card p-6 flex flex-col items-center gap-4 w-80">
                <video ref={videoRef} className="rounded-xl w-full h-48 bg-black" autoPlay playsInline />
                <canvas ref={canvasRef} className="hidden" />
                {cameraError && <div className="text-red-400 text-sm">{cameraError}</div>}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleTakePhoto}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                  >
                    Capture
                  </button>
                  <button
                    onClick={handleCloseCamera}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pending Image Modal */}
          {pendingImage && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-40">
              <div className="glass-card p-6 flex flex-col items-center gap-4 w-80">
                <img src={pendingImage.src} alt="Preview" className="max-w-full max-h-48 rounded-xl" />
                <input
                  type="text"
                  className="input-glass text-sm"
                  placeholder="Add a caption..."
                  value={pendingCaption}
                  onChange={(e) => setPendingCaption(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-3 w-full">
                  <button
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                    onClick={() => {
                      setMessages((msgs) => [
                        ...msgs,
                        { from: "user", text: pendingCaption, image: pendingImage.src },
                      ]);
                      setPendingImage(null);
                      setPendingCaption("");
                    }}
                  >
                    Send
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                    onClick={() => {
                      setPendingImage(null);
                      setPendingCaption("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Input Bar */}
          <form onSubmit={handleSend} className="flex items-center gap-2 glass-card p-2 mt-2 flex-shrink-0">
            <input
              type="text"
              className="flex-1 bg-transparent px-4 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none text-sm"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            {/* More options */}
            <div className="relative">
              <button
                type="button"
                className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={() => setShowImageDropdown((prev) => !prev)}
                tabIndex={-1}
                aria-label="More options"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              {showImageDropdown && (
                <div className="absolute bottom-12 right-0 glass-card p-1.5 z-20 min-w-[160px] animate-slide-up">
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    onClick={handleCaptureImage}
                  >
                    📷 Capture Image
                  </button>
                  <label className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200">
                    📁 Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Send button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105"
              aria-label="Send"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;