import React, { useState, useCallback } from 'react';
import FloatingAlert from '../components/FloatingAlert';
import Navbar from '../components/Navbar';
import { API_BASE } from "../../utils";

// --- SVG Icon Components ---
const FileUploadIcon = () => (
    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Loader = () => (
    <div className="w-16 h-16 mx-auto rounded-full border-4 border-white/10 border-t-purple-500 animate-spin" />
);


export default function SOS() {
    const [parentName, setParentName] = useState("");
    const [childPhoto, setChildPhoto] = useState(null);
    const [fileName, setFileName] = useState("PNG, JPG, WEBP up to 10MB");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Manual Input Fields
    const [ageGroup, setAgeGroup] = useState("");
    const [upperWear, setUpperWear] = useState("");
    const [lowerWear, setLowerWear] = useState("");
    const [footwear, setFootwear] = useState("");
    const [accessories, setAccessories] = useState("");

    // User count from backend
    const [userCount, setUserCount] = useState(0);

    // Alert State
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setChildPhoto(file);
            setFileName(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!parentName || !ageGroup || !upperWear) {
            alert("Please fill in at least your name, the age group, and upper wear.");
            return;
        }

        setIsLoading(true);
        setIsModalOpen(true);

        // Fetch user count from backend
        try {
            const resp = await fetch(`${API_BASE}/api/user-count/`);
            if (resp.ok) {
                const data = await resp.json();
                setUserCount(data.count || 0);
            }
        } catch (err) {
            console.error("Failed to fetch user count:", err);
            setUserCount(0);
        }

        // Trigger Floating Alert
        const message = `🚨 Missing child alert! ${ageGroup}, last seen wearing ${upperWear}. Stay alert in your area!`;
        setAlertMessage(message);
        setShowAlert(true);
        setIsLoading(false);
    };

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <div className="bg-mesh min-h-screen flex items-center justify-center font-sans p-4 py-20 relative overflow-hidden">
            <Navbar />
            {/* Decorative orbs */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-600/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-md animate-slide-up">
                <div className="gradient-border">
                    <div className="glass-card p-7 max-h-[85vh] overflow-y-auto scrollbar-hide">
                        <header className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-red-500/20">
                                🚨
                            </div>
                            <h1 className="text-2xl font-bold text-white">Aura Emergency SOS</h1>
                            <p className="text-gray-400 text-sm mt-2">
                                Activate an emergency alert to find a missing person.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Parent Name */}
                            <div>
                                <label htmlFor="parentName" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Your Name</label>
                                <input
                                    type="text"
                                    id="parentName"
                                    value={parentName}
                                    onChange={(e) => setParentName(e.target.value)}
                                    className="input-glass"
                                    placeholder="e.g., Priya Sharma"
                                    required
                                />
                            </div>

                            {/* Age Group */}
                            <div>
                                <label htmlFor="ageGroup" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Estimated Age / Age Group</label>
                                <input
                                    type="text"
                                    id="ageGroup"
                                    value={ageGroup}
                                    onChange={(e) => setAgeGroup(e.target.value)}
                                    className="input-glass"
                                    placeholder="e.g., 4-6 years old"
                                    required
                                />
                            </div>

                            {/* Upper Wear */}
                            <div>
                                <label htmlFor="upperWear" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Upper Wear Description</label>
                                <input
                                    type="text"
                                    id="upperWear"
                                    value={upperWear}
                                    onChange={(e) => setUpperWear(e.target.value)}
                                    className="input-glass"
                                    placeholder="e.g., Bright Red T-Shirt with Spider-Man logo"
                                    required
                                />
                            </div>

                            {/* Lower Wear */}
                            <div>
                                <label htmlFor="lowerWear" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Lower Wear Description</label>
                                <input
                                    type="text"
                                    id="lowerWear"
                                    value={lowerWear}
                                    onChange={(e) => setLowerWear(e.target.value)}
                                    className="input-glass"
                                    placeholder="e.g., Blue Jeans"
                                />
                            </div>

                            {/* Footwear */}
                            <div>
                                <label htmlFor="footwear" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Footwear Description</label>
                                <input
                                    type="text"
                                    id="footwear"
                                    value={footwear}
                                    onChange={(e) => setFootwear(e.target.value)}
                                    className="input-glass"
                                    placeholder="e.g., White Sneakers"
                                />
                            </div>

                            {/* Accessories */}
                            <div>
                                <label htmlFor="accessories" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Accessories / Identifying Features</label>
                                <input
                                    type="text"
                                    id="accessories"
                                    value={accessories}
                                    onChange={(e) => setAccessories(e.target.value)}
                                    className="input-glass"
                                    placeholder="e.g., Glasses, yellow backpack, birthmark on cheek"
                                />
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label htmlFor="file-upload" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Recent Photo of Child</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-white/15 rounded-xl hover:border-white/25 transition-colors duration-300 bg-white/3">
                                    <div className="space-y-2 text-center">
                                        <FileUploadIcon />
                                        <div className="flex text-sm text-gray-400">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                                            >
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">{fileName}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-0.5 mt-2"
                            >
                                Broadcast Emergency Alert
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* --- MODAL Component --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="glass-card p-7 w-full max-w-md mx-4 text-center animate-slide-up max-h-[90vh] overflow-y-auto scrollbar-hide">
                        {isLoading ? (
                            <div>
                                <Loader />
                                <h2 className="text-xl font-semibold mt-5 text-white">Sending Alert...</h2>
                                <p className="text-gray-400 mt-2 text-sm">Broadcasting to all registered users.</p>
                            </div>
                        ) : (
                            <div className="text-left">
                                <div className="text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
                                        🚨
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-2">Emergency Alert Sent!</h2>
                                    <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold mb-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Sent to {userCount} registered {userCount === 1 ? 'user' : 'users'}
                                    </div>
                                </div>

                                <div className="glass-card p-5 text-sm space-y-2">
                                    {childPhoto && (
                                        <div className="flex justify-center mb-4">
                                            <img
                                                src={URL.createObjectURL(childPhoto)}
                                                alt="Missing Child"
                                                className="w-full max-h-56 object-contain rounded-lg shadow-md border border-white/10 bg-black/20"
                                            />
                                        </div>
                                    )}
                                    <p className="text-gray-300">
                                        <span className="text-gray-500 text-xs uppercase tracking-wider">Initiated By</span>
                                        <br />
                                        <span className="text-white font-medium">{parentName}</span>
                                    </p>
                                    <p className="text-gray-300">
                                        <span className="text-gray-500 text-xs uppercase tracking-wider">Age Group</span>
                                        <br />
                                        <span className="text-white font-medium">{ageGroup}</span>
                                    </p>
                                    <div className="border-t border-white/10 my-3" />
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Provided Description</h4>
                                    <ul className="space-y-1.5 text-gray-300">
                                        <li className="flex gap-2"><span className="text-indigo-400">•</span> <strong>Top:</strong> {upperWear}</li>
                                        {lowerWear && <li className="flex gap-2"><span className="text-indigo-400">•</span> <strong>Bottom:</strong> {lowerWear}</li>}
                                        {footwear && <li className="flex gap-2"><span className="text-indigo-400">•</span> <strong>Shoes:</strong> {footwear}</li>}
                                        {accessories && <li className="flex gap-2"><span className="text-indigo-400">•</span> <strong>Extra Details:</strong> {accessories}</li>}
                                    </ul>
                                    <div className="border-t border-white/10 my-3" />
                                    <p className="text-xs text-red-400 font-medium text-center">
                                        Alert has been broadcasted to mall security and all {userCount} nearby users.
                                    </p>
                                </div>

                                <button
                                    onClick={closeModal}
                                    className="mt-6 w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 border border-white/10"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating emergency banner */}
            <FloatingAlert
                message={alertMessage}
                visible={showAlert}
                duration={10000}
                reappearDelay={20000}
                onClose={() => setShowAlert(false)}
            />
        </div>
    );
}