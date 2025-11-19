import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MatchingOpportunities() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [pincode, setPincode] = useState("");
    const [domain, setDomain] = useState("");
    const [date, setDate] = useState("");
    const [postings, setPostings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
            return;
        }

        setTimeout(() => setIsLoading(false), 500);
    }, [navigate]);

    const handleSearch = async () => {
        setError("");
        try {
            const query = new URLSearchParams();
            if (pincode) query.append("pincode", pincode);
            if (domain) query.append("domain", domain);
            if (date) query.append("date", date);

            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recommend?${query.toString()}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            });

            if (!res.ok) {
                const msg = await res.text();
                setPostings([]);
                setError(msg);
            } else {
                const data = await res.json();
                setPostings(data);
            }
        } catch (err) {
            setError("Failed to fetch postings.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <Navbar />
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Volunteer Opportunities
                    </h1>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Pincode"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="border p-2 rounded-lg flex-1"
                        />
                        <input
                            type="text"
                            placeholder="Domain"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className="border p-2 rounded-lg flex-1"
                        />
                        <input
                            type="date"
                            placeholder="Date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border p-2 rounded-lg flex-1"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {/* Results */}
                    {error && <p className="text-red-500">{error}</p>}

                    {postings.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {postings.map((p) => (
                                <div key={p.id} className="bg-white rounded-xl shadow p-4">
                                    <h3 className="text-xl font-semibold">{p.title}</h3>
                                    <p className="text-gray-600">{p.description}</p>
                                    <p className="text-sm mt-2">
                                        <strong>Domain:</strong> {p.domain} | <strong>Pincode:</strong> {p.pincode} | <strong>Date:</strong>{" "}
                                        {p.startDate} to {p.endDate}
                                    </p>
                                    <p className="text-sm mt-1">
                                        <strong>Volunteers Needed:</strong> {p.volunteersNeeded}
                                    </p>
                                    <button
                                        className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                                        onClick={() => alert(`Apply clicked for posting ${p.id}`)}
                                    >
                                        Apply
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
