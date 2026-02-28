import React, { useEffect, useState } from "react";

export default function NotificationPage() {
  const [socket, setSocket] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/notifications/");
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPopupMessage(data.message);
    };

    ws.onopen = () => console.log("WebSocket connected!");
    ws.onclose = () => console.log("WebSocket disconnected!");

    return () => ws.close();
  }, []);

  const triggerPopup = () => {
    if (socket) {
      socket.send(JSON.stringify({ message: "User triggered popup!" }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-mesh relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center">
        <h1 className="text-2xl font-bold text-white mb-6">Notifications</h1>
        <button
          onClick={triggerPopup}
          className="btn-gradient px-8 py-3"
        >
          Trigger Popup
        </button>
      </div>

      {popupMessage && (
        <div className="fixed top-5 right-5 z-50 animate-slide-up">
          <div className="glass-card px-6 py-4 border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm">
                🔔
              </div>
              <span className="text-white text-sm font-medium">{popupMessage}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
