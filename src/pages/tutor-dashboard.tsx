import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTopCourses } from "../hooks/useTopCourses";
import Navbar from "../components/nav";

const courseList = [
  { code: "COSC1234", name: "Full Stack Development" },
  { code: "COSC2345", name: "Machine Learning" },
  { code: "COSC3456", name: "Data Structures" },
  { code: "COSC4567", name: "Cloud Computing" },
  { code: "COSC4868", name: "Data Science" },
  { code: "COSC7548", name: "Algorithms and Analysis" },
  { code: "COSC3497", name: "DataBase Management System" },
  { code: "COSC9368", name: "Programming" },
  { code: "COSC7482", name: "AI" },
];

export default function TutorDashboard() {
  const { tutor, logout } = useAuth();
  const router = useRouter();
  const topCourses = useTopCourses();

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedRole, setSelectedRole] = useState<"" | "tutor" | "lab-assistant">("");
  const [availability, setAvailability] = useState("");
  const [previousRoles, setPreviousRoles] = useState("");
  const [skills, setSkills] = useState("");
  const [credentials, setCredentials] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = [];
    if (!selectedRole) errors.push("Select a role");
    if (!availability) errors.push("Select availability");
    if (!previousRoles) errors.push("Enter previous roles");
    if (!skills) errors.push("Enter skills");
    if (!credentials) errors.push("Enter academic credentials");

    if (errors.length > 0) {
      setMessage(errors.join(", "));
      return;
    }

    const newApplication = {
      email: tutor?.email,
      username:tutor?.username,
      course: selectedCourse,
      role: selectedRole,
      availability,
      previousRoles,
      skills,
      credentials,
    };

    const existing = localStorage.getItem("applicants");
    const applicants = existing ? JSON.parse(existing) : [];

    applicants.push(newApplication);
    localStorage.setItem("applicants", JSON.stringify(applicants));
    console.log(applicants)

    setMessage("✅ Application submitted!");
    setSelectedCourse("");
    setSelectedRole("");
    setAvailability("");
    setPreviousRoles("");
    setSkills("");
    setCredentials("");
  };
  console.log("Top Courses:", topCourses);


  return (
    <div>
      <Navbar/>

      {/* Dashboard Content */}
      <div className="max-w-5xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-xl">
        <h2 className="text-3xl font-bold mb-2 text-center">Welcome, {tutor?.username}</h2>
        <p className="text-center text-gray-600 mb-6">Select a role and choose a course to apply for.</p>
        {(topCourses.tutor.length > 0 || topCourses.labAssistant.length > 0) && (
  <div className="mb-8">
    {topCourses.tutor.length > 0 && (
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">
          🔥 Top 3 Tutor Applied Courses
        </h3>
        <ul className="space-y-1">
          {topCourses.tutor.map((course, index) => (
            <li key={course.code} className="text-gray-700">
              #{index + 1} - <strong>{course.code}</strong> ({course.count} applicants)
            </li>
          ))}
        </ul>
      </div>
    )}

    {topCourses.labAssistant.length > 0 && (
      <div className="text-center">
        <h3 className="text-xl font-semibold text-green-700 mb-2">
          🧪 Top 3 Lab Assistant Applied Courses
        </h3>
        <ul className="space-y-1">
          {topCourses.labAssistant.map((course, index) => (
            <li key={course.code} className="text-gray-700">
              #{index + 1} - <strong>{course.code}</strong> ({course.count} applicants)
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}


        {/* Role and Course Selection */}
        {!selectedCourse ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tutor Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold text-blue-600 mb-2 text-center">Tutor Positions</h3>
              <div className="space-y-2">
                {courseList.map((course) => (
                  <div
                    key={`${course.code}-tutor`}
                    className="border p-3 rounded cursor-pointer hover:bg-blue-50"
                    onClick={() => {
                      setSelectedCourse(course.code);
                      setSelectedRole("tutor");
                    }}
                  >
                    <h4 className="font-semibold">{course.code}</h4>
                    <p>{course.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Assistant Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold text-green-600 mb-2 text-center">Lab Assistant Positions</h3>
              <div className="space-y-2">
                {courseList.map((course) => (
                  <div
                    key={`${course.code}-lab`}
                    className="border p-3 rounded cursor-pointer hover:bg-green-50"
                    onClick={() => {
                      setSelectedCourse(course.code);
                      setSelectedRole("lab-assistant");
                    }}
                  >
                    <h4 className="font-semibold">{course.code}</h4>
                    <p>{course.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Application Form
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <h3 className="text-xl text-center font-bold mb-4">
              Applying for: <span className="text-blue-600">{selectedCourse}</span> as{" "}
              <span className="capitalize">{selectedRole?.replace("-", " ")}</span>
            </h3>

            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full border p-3 rounded"
              required
            >
              <option value="">-- Select Availability --</option>
              <option value="part-time">Part Time</option>
              <option value="full-time">Full Time</option>
            </select>

            <textarea
              value={previousRoles}
              onChange={(e) => setPreviousRoles(e.target.value)}
              placeholder="Describe your previous roles"
              className="w-full border p-3 rounded"
              required
            />

            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="List your relevant skills"
              className="w-full border p-3 rounded"
              required
            />

            <textarea
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              placeholder="List your academic credentials"
              className="w-full border p-3 rounded"
              required
            />

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setSelectedCourse("");
                  setSelectedRole("");
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Back to Courses
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit Application
              </button>
            </div>

            {message && (
              <p className="text-center text-green-600 mt-4">{message}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
