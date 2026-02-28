import React, { useEffect, useState } from "react";

export default function FloatingAlert({
  message,
  visible,
  duration = 8000,
  reappearDelay = 30000,
}) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    let timer;
    if (visible) {
      setShow(true);
      timer = setTimeout(() => setShow(false), duration);
    }
    return () => clearTimeout(timer);
  }, [visible, duration]);

  const handleDismiss = () => {
    setShow(false);
    setTimeout(() => setShow(true), reappearDelay);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-red-500/20 max-w-sm">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-700" />
        {/* Animated shimmer */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />

        <div className="relative px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">🚨</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm">Emergency Alert</h3>
              <p className="mt-1 text-red-100 text-xs leading-relaxed">{message}</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="mt-3 text-xs bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
