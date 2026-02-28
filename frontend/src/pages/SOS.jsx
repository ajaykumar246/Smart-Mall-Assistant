import React, { useState, useCallback } from "react";
import FloatingAlert from "../components/FloatingAlert";

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
    const [agentState, setAgentState] = useState("idle");
    const [aiResponse, setAiResponse] = useState(null);

    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setChildPhoto(file);
            setFileName(file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!childPhoto) {
            alert("Please upload a photo.");
            return;
        }

        console.log("Agent Perceiving: Data collected.", { parentName, childPhoto });

        setAgentState("reasoning");
        setIsModalOpen(true);

        setTimeout(() => {
            const mockAiResponse = {
                description: {
                    upper_wear: { type: "T-shirt", color: "Bright Red", pattern: "Spider-Man logo" },
                    lower_wear: { type: "Shorts", color: "Blue" },
                    footwear: { type: "Sneakers", color: "White" },
                    accessories: "None",
                },
                estimated_age_group: "4-6 years old",
            };

            setAiResponse(mockAiResponse);

            const message = `🚨 Missing child alert! ${mockAiResponse.estimated_age_group}, last seen wearing ${mockAiResponse.description.upper_wear.color} ${mockAiResponse.description.upper_wear.type}. Stay alert in your area!`;
            setAlertMessage(message);
            setShowAlert(true);

            setAgentState("action");
        }, 2500);
    };

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setTimeout(() => {
            setAgentState("idle");
            setAiResponse(null);
        }, 300);
    }, []);

    return (
        <div className="bg-mesh min-h-screen flex items-center justify-center font-sans p-4 relative overflow-hidden">
            {/* Decorative orbs */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-600/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-md animate-slide-up">
                <div className="gradient-border">
                    <div className="glass-card p-7">
                        <header className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-red-500/20">
                                🚨
                            </div>
                            <h1 className="text-2xl font-bold text-white">Emergency SOS</h1>
                            <p className="text-gray-400 text-sm mt-2">
                                Activate an AI-assisted alert to find a missing person.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="parentName" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                                    Your Name
                                </label>
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

                            <div>
                                <label htmlFor="file-upload" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                                    Recent Photo of Child
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-white/15 rounded-xl hover:border-white/25 transition-colors duration-300 bg-white/3">
                                    <div className="space-y-2 text-center">
                                        <FileUploadIcon />
                                        <div className="flex text-sm text-gray-400">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    required
                                                />
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
                                Activate AI Alert
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="glass-card p-7 w-full max-w-md mx-4 text-center animate-slide-up">
                        {agentState === "reasoning" && (
                            <div>
                                <Loader />
                                <h2 className="text-xl font-semibold mt-5 text-white">AI Agent is Reasoning...</h2>
                                <p className="text-gray-400 mt-2 text-sm">Analyzing image to generate a precise description.</p>
                            </div>
                        )}

                        {agentState === "action" && aiResponse && (
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
                                    🚨
                                </div>
                                <h2 className="text-xl font-bold text-white mb-5">AI Alert Drafted</h2>
                                <div className="text-left glass-card p-5 text-sm space-y-2">
                                    <p className="text-gray-300">
                                        <span className="text-gray-500 text-xs uppercase tracking-wider">Initiated By</span>
                                        <br />
                                        <span className="text-white font-medium">{parentName}</span>
                                    </p>
                                    <p className="text-gray-300">
                                        <span className="text-gray-500 text-xs uppercase tracking-wider">Estimated Age</span>
                                        <br />
                                        <span className="text-white font-medium">{aiResponse.estimated_age_group}</span>
                                    </p>
                                    <div className="border-t border-white/10 my-3" />
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">AI-Generated Description</h4>
                                    <ul className="space-y-1.5 text-gray-300">
                                        <li className="flex gap-2"><span className="text-indigo-400">•</span> <strong>Top:</strong> {aiResponse.description.upper_wear.color} {aiResponse.description.upper_wear.type} with a {aiResponse.description.upper_wear.pattern}.</li>
                                        <li className="flex gap-2"><span className="text-indigo-400">•</span> <strong>Bottom:</strong> {aiResponse.description.lower_wear.color} {aiResponse.description.lower_wear.type}.</li>
                                        <li className="flex gap-2"><span className="text-indigo-400">•</span> <strong>Shoes:</strong> {aiResponse.description.footwear.color} {aiResponse.description.footwear.type}.</li>
                                        <li className="flex gap-2"><span className="text-indigo-400">•</span> <strong>Accessories:</strong> {aiResponse.description.accessories}.</li>
                                    </ul>
                                    <div className="border-t border-white/10 my-3" />
                                    <p className="text-xs text-red-400 font-medium">
                                        Alert will be sent to security and nearby users in a 200-meter radius.
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