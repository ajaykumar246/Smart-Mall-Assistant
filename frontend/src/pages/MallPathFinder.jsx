// src/MallPathFinder.js
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const mockFeatures = [
  { title: "Parking", description: "Find the nearest parking spot", path: "/name", icon: "🅿️", gradient: "from-blue-500 to-cyan-500" },
  { title: "SOS", description: "What's your emergency?", path: "/sos", icon: "🚨", gradient: "from-red-500 to-rose-600" },
  { title: "Events", description: "Upcoming mall events", path: "/name", icon: "🎉", gradient: "from-amber-500 to-orange-600" },
  { title: "Offers", description: "Today's best deals", path: "/name", icon: "🏷️", gradient: "from-emerald-500 to-teal-600" },
];

const normalizeGraph = (graph) => {
  const lowerGraph = {};
  for (const key in graph) {
    lowerGraph[key.toLowerCase()] = {
      ...graph[key],
      connections: graph[key].connections.map((c) => c.toLowerCase()),
    };
  }
  return lowerGraph;
};

const findShortestPathWithFloors = (graph, start, end) => {
  start = start.toLowerCase();
  end = end.toLowerCase();
  let queue = [[start]];
  let visited = new Set();
  while (queue.length > 0) {
    let path = queue.shift();
    let node = path[path.length - 1];
    if (node === end) return path;
    if (!visited.has(node)) {
      visited.add(node);
      for (let neighbor of graph[node]?.connections || []) {
        if (!visited.has(neighbor)) {
          queue.push([...path, neighbor]);
        }
      }
    }
  }
  return [];
};

const rawMallGraph = {
  "Nike": { floor: 0, connections: ["Puma", "Skechers", "Reebok"] },
  "Puma": { floor: 0, connections: ["Nike", "Reebok", "Staircase1", "Skechers"] },
  "Skechers": { floor: 0, connections: ["Nike", "Reebok", "Puma", "Kids Corner"] },
  "Reebok": { floor: 0, connections: ["Skechers", "Burger King"] },
  "Burger King": { floor: 0, connections: ["Kids Corner", "Reebok", "McDonald's", "Staircase1"] },
  "McDonald's": { floor: 0, connections: ["Burger King", "The Concourse", "Staircase1"] },
  "Kids Corner": { floor: 0, connections: ["Burger King", "Cafe Coffee Day", "Plam", "Skechers", "Reebok"] },
  "Cafe Coffee Day": { floor: 0, connections: ["Kids Corner", "Perfume Shop", "Plam", "Burger King"] },
  "Perfume Shop": { floor: 0, connections: ["Plam", "Cafe Coffee Day", "Burger King"] },
  "The Concourse": { floor: 0, connections: ["McDonald's", "Staircase2"] },
  "Maintenance Area": { floor: 0, connections: ["Elevator", "Staircase2"] },
  "Display Area": { floor: 0, connections: ["Elevator"] },
  "Plam": { floor: 0, connections: ["Perfume Shop", "Cafe Coffee Day", "Kids Corner"] },
  "Pantaloons": { floor: 1, connections: ["PepperFry", "RockClimbing1", "Staircase1"] },
  "PepperFry": { floor: 1, connections: ["Pantaloons", "RockClimbing1"] },
  "RockClimbing1": { floor: 1, connections: ["Pantaloons", "PepperFry", "RockClimbing2", "Lifestyle"] },
  "RockClimbing2": { floor: 1, connections: ["RockClimbing1", "Marks & Spencer", "Lifestyle", "ZARA", "Starbucks", "Gucci"] },
  "Marks & Spencer": { floor: 1, connections: ["RockClimbing2", "Gucci"] },
  "Gucci": { floor: 1, connections: ["Marks & Spencer", "Cafe Noir", "Elevator", "RockClimbing2", "Starbucks"] },
  "Cafe Noir": { floor: 1, connections: ["Gucci", "Elevator"] },
  "Lifestyle": { floor: 1, connections: ["Staircase1", "ZARA", "RockClimbing1", "RockClimbing2"] },
  "ZARA": { floor: 1, connections: ["Staircase2", "Lifestyle", "Starbucks", "RockClimbing2"] },
  "Starbucks": { floor: 1, connections: ["ZARA", "Woodland", "RockClimbing2", "Gucci", "Staircase2"] },
  "Woodland": { floor: 1, connections: ["Starbucks", "Elevator", "Staircase2"] },
  "KFC": { floor: 2, connections: ["Domino's", "Staircase1", "Anchor Store"] },
  "Domino's": { floor: 2, connections: ["Apple Store", "Zodiac", "KFC", "Anchor Store"] },
  "Zodiac": { floor: 2, connections: ["Domino's", "Anchor Store", "Food Stall", "Apple Store"] },
  "Apple Store": { floor: 2, connections: ["Domino's", "Food Stall", "Zodiac"] },
  "Food Stall": { floor: 2, connections: ["Zodiac", "Apple Store", "Anchor Store"] },
  "Anchor Store": { floor: 2, connections: ["Domino's", "Zodiac", "Atrium", "Staircase1", "Food Stall", "KFC"] },
  "Atrium": { floor: 2, connections: ["Anchor Store", "Thriller Room", "Staircase1", "Staircase2", "Washroom"] },
  "Thriller Room": { floor: 2, connections: ["Atrium", "Tanishq", "Washroom", "Titan"] },
  "Tanishq": { floor: 2, connections: ["Thriller Room", "Elevator", "Titan"] },
  "US Polo": { floor: 2, connections: ["Washroom", "Staircase2", "Elevator"] },
  "Washroom": { floor: 2, connections: ["US Polo", "Staircase2", "Elevator", "Atrium", "Titan"] },
  "Titan": { floor: 2, connections: ["Washroom", "Thriller Room", "Tanishq", "Elevator"] },
  "KK Cinemas": { floor: 3, connections: ["Fun Land"] },
  "Fun Land": { floor: 3, connections: ["Book Tickets", "Elevator", "Snacks Counter"] },
  "Book Tickets": { floor: 3, connections: ["Fun Land", "Elevator"] },
  "Snacks Counter": { floor: 3, connections: ["Fun Land", "Elevator"] },
  "Staircase1": { floor: "multi", connections: ["Burger King", "Puma", "Reebok", "McDonald's", "Lifestyle", "Pantaloons", "KFC", "Anchor Store", "Atrium", "KK Cinemas", "Fun Land"] },
  "Staircase2": { floor: "multi", connections: ["The Concourse", "Maintenance Area", "ZARA", "Starbucks", "Woodland", "Washroom", "US Polo", "Atrium", "Fun Land", "Book Tickets"] },
  "Elevator": { floor: "multi", connections: ["Maintenance Area", "Display Area", "Woodland", "Gucci", "Cafe Noir", "US Polo", "Washroom", "Tanishq", "Titan", "Book Tickets", "Snack Counter"] }
};

const mallGraph = normalizeGraph(rawMallGraph);

const MallPathFinder = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [path, setPath] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const navigate = useNavigate();

  const handleFindPath = () => {
    if (start && end) {
      const shortestPath = findShortestPathWithFloors(mallGraph, start, end);
      setPath(shortestPath);
    }
  };

  return (
    <div className="min-h-screen w-full bg-mesh relative font-sans overflow-hidden">
      <Navbar />

      {/* Decorative orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center py-24 px-6 text-white">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-block px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-300 text-sm font-medium mb-4">
            🗺️ Navigation
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold">
            Mall <span className="text-gradient">Path Finder</span>
          </h1>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-3xl mb-10 animate-slide-up">
          <div className="gradient-border">
            <div className="glass-card p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Start Point</label>
                  <input
                    id="startPoint"
                    name="startPoint"
                    type="text"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    placeholder="Enter start location"
                    className="input-glass"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">End Point</label>
                  <input
                    id="endPoint"
                    name="endPoint"
                    type="text"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    placeholder="Enter destination"
                    className="input-glass"
                  />
                </div>
              </div>
              <button onClick={handleFindPath} className="btn-gradient w-full py-3.5 text-base">
                Find Path
              </button>
            </div>
          </div>
        </div>

        {/* Path Display - Timeline */}
        {path.length > 0 ? (
          <div className="glass-card p-7 w-full max-w-2xl mb-10 animate-slide-up">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-gradient">Shortest Path</span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                {path.length} stops
              </span>
            </h2>
            <div className="space-y-0">
              {path.map((location, index) => {
                const floorChange =
                  index > 0 &&
                  mallGraph[location].floor !== mallGraph[path[index - 1]].floor;

                const displayName = Object.keys(rawMallGraph).find(
                  (k) => k.toLowerCase() === location
                ) || location;

                const isFirst = index === 0;
                const isLast = index === path.length - 1;

                return (
                  <div key={index} className="flex items-start gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 ${isFirst ? "bg-emerald-500 border-emerald-400" :
                          isLast ? "bg-indigo-500 border-indigo-400" :
                            "bg-white/20 border-white/30"
                        }`} />
                      {!isLast && <div className="w-px h-8 bg-white/15" />}
                    </div>
                    {/* Content */}
                    <div className="pb-4 -mt-0.5">
                      <span className="text-sm font-medium text-white">{displayName}</span>
                      {floorChange && (
                        <span className="ml-2 text-xs bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20">
                          Floor {mallGraph[location].floor}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 mb-10 glass-card px-6 py-3">
            Enter start and end points to find a path
          </div>
        )}

        {/* 3D Map */}
        <div className="glass-card w-full max-w-5xl h-[60vh] overflow-hidden">
          <Canvas>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Model />
            <OrbitControls minDistance={5} maxDistance={120} />
          </Canvas>
        </div>

        {/* Separator */}
        <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent my-16" />

        {/* Features */}
        <section id="features" className="w-full max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">
              More <span className="text-gradient">Features</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {mockFeatures.map((feature, index) => (
              <button
                key={index}
                onClick={() => navigate(feature.path)}
                className="glass-card p-5 text-left group hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-lg mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-sm font-semibold mb-1 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Chat Icon */}
      <button
        onClick={() => setShowReview(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-500/30 z-50 hover:scale-110 transition-transform duration-300"
      >
        💬
      </button>

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card w-full max-w-md p-7 relative mx-4 animate-slide-up">
            <button
              onClick={() => setShowReview(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-5 text-white">Leave a Review</h2>
            <textarea
              id="review"
              name="review"
              rows="4"
              placeholder="Write your review..."
              className="input-glass min-h-[120px] resize-none mb-4"
            />
            <button className="btn-gradient w-full py-3">
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function Model() {
  const gltf = useGLTF("/mallfinal.glb");
  return (
    <primitive
      object={gltf.scene}
      scale={[0.5, 0.5, 0.5]}
      position={[0, -2, 0]}
    />
  );
}

export default MallPathFinder;
