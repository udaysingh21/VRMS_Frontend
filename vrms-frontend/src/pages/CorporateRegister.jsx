import { useState } from "react";
import Navbar from "../components/Navbar";

export default function CorporateRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    industry: "",
    budgetAllocated: "",
    address: "",
    phone: "",
    websiteUrl: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:61146/api/users/register/corporate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Registration failed");
      const data = await response.json();

      alert("✅ Corporate registered successfully!");
      console.log("Server Response:", data);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-lg mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Corporate Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Company Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Official Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />

          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID"
            value={formData.employeeId}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="text"
            name="industry"
            placeholder="Industry (e.g., IT, Healthcare)"
            value={formData.industry}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="number"
            name="budgetAllocated"
            placeholder="Budget Allocated (in USD)"
            value={formData.budgetAllocated}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="text"
            name="phone"
            placeholder="Contact Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="url"
            name="websiteUrl"
            placeholder="Website URL"
            value={formData.websiteUrl}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
