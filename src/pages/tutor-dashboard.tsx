import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const courseList = [
  { code: "COSC1234", name: "full stack development" },
  { code: "COSC2345", name: "machine learning" },
  { code: "COSC3456", name: "data structures" },
  { code: "COSC4567", name: "cloud computing" },
];

export default function TutorDashboard() {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [role, setRole] = useState("");
  const [availability, setAvailability] = useState("");
  const [previousRoles, setPreviousRoles] = useState("");
  const [skills, setSkills] = useState("");
  const [credentials, setCredentials] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = [];
    if (!role) errors.push("Select a role");
    if (!availability) errors.push("Select availability");
    if (!previousRoles) errors.push("Enter previous roles");
    if (!skills) errors.push("Enter skills");
    if (!credentials) errors.push("Enter academic credentials");

    if (errors.length > 0) {
      setMessage(errors.join(", "));
      return;
    }

    const newApplication = {
      email: user?.username,
      course: selectedCourse,
      role,
      availability,
      previousRoles,
      skills,
      credentials,
    };

    const existing = localStorage.getItem("applicants");
    const applicants = existing ? JSON.parse(existing) : [];

    applicants.push(newApplication);
    localStorage.setItem("applicants", JSON.stringify(applicants));

    setMessage("✅ Application submitted!");
    setSelectedCourse(""); // Reset to show course list again
    setRole("");
    setAvailability("");
    setPreviousRoles("");
    setSkills("");
    setCredentials("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow rounded text-center">
      <h2 className="text-3xl font-bold mb-6">Tutor Dashboard</h2>

      {!selectedCourse ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
          {courseList.map((course) => (
            <div
              key={course.code}
              className="cursor-pointer border p-4 rounded w-full hover:bg-gray-100"
              onClick={() => setSelectedCourse(course.code)}
            >
              <h3 className="text-lg font-semibold">{course.code}</h3>
              <p className="capitalize">{course.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left mt-6">
          <h3 className="text-xl font-semibold text-center mb-2">
            Applying for: {selectedCourse}
          </h3>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">-- Select Role --</option>
            <option value="tutor">Tutor</option>
            <option value="lab-assistant">Lab Assistant</option>
          </select>

          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">-- Select Availability --</option>
            <option value="part-time">Part Time</option>
            <option value="full-time">Full Time</option>
          </select>

          <textarea
            value={previousRoles}
            onChange={(e) => setPreviousRoles(e.target.value)}
            placeholder="Previous roles"
            className="border p-2 rounded"
            required
          />

          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills"
            className="border p-2 rounded"
            required
          />

          <textarea
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            placeholder="Academic credentials"
            className="border p-2 rounded"
            required
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedCourse("")}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Back to Courses
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Submit Application
            </button>
          </div>

          {message && (
            <p className="text-sm mt-2 text-green-600 text-center">{message}</p>
          )}
        </form>
      )}
    </div>
  );
}
