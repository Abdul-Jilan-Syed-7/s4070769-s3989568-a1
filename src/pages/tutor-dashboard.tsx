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
    if (!selectedCourse) errors.push("Select a course");
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
    setSelectedCourse("");
    setRole("");
    setAvailability("");
    setPreviousRoles("");
    setSkills("");
    setCredentials("");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 mt-8 rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Tutor Dashboard</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border p-2 rounded"
          required
        >
          <option value="">-- Select Course --</option>
          {courseList.map((course) => (
            <option key={course.code} value={course.code}>
              {course.code} - {course.name.charAt(0).toUpperCase() + course.name.slice(1)}
            </option>
          ))}
        </select>

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

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit Application
        </button>

        {message && (
          <p className="text-sm mt-2 text-center text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
}
