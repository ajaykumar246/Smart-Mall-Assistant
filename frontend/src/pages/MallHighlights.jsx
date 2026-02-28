import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const highlights = [
  { title: "H&M", image: "/hm.png", tag: "Fashion", desc: "Trendy styles for everyone" },
  { title: "Food Court", image: "/food.png", tag: "Dining", desc: "Delicious cuisines under one roof" },
  { title: "PVR Cinemas", image: "/movie.png", tag: "Entertainment", desc: "Latest blockbusters in IMAX" },
  { title: "Zara", image: "/zara.png", tag: "Fashion", desc: "Premium fashion & accessories" },
  { title: "Lifestyle", image: "/poster1.png", tag: "Lifestyle", desc: "Home, fashion & beauty" },
];

const MallHighlights = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-slide-up">
      <div className="text-center mb-8">
        
        <h2 className="text-3xl sm:text-4xl font-bold">
          Top Highlights in <span className="text-gradient">Smart Mall</span>
        </h2>
        <p className="text-gray-400 text-sm mt-2">Discover the best stores, food & entertainment</p>
      </div>

      <Slider {...settings}>
        {highlights.map((item, idx) => (
          <div key={idx} className="px-2">
            <div className="rounded-2xl overflow-hidden group border border-white/10 shadow-2xl shadow-black/30">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[350px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-purple-900/20" />

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <span className="inline-block px-3 py-1 bg-indigo-500/30 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-200 mb-3 border border-indigo-400/20 uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.desc}</p>
                </div>

                {/* Top-right counter badge */}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/70 font-medium border border-white/10">
                  {idx + 1} / {highlights.length}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MallHighlights;
