import Navbar from "../components/nav";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Applicant = {
  email: string;
  username?: string;
  course: string;
  role: string;
  availability: string;
  previousRoles: string;
  skills: string;
  credentials: string;
};

type Review = {
  email: string;
  course: string;
  rank: number;
  comment: string;
};

export default function LecturerDashboard() {
  const { lecturer } = useAuth();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedApplicants, setSelectedApplicants] = useState<Record<string, Review>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"course" | "availability">("course");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("applicants");
    const reviews = localStorage.getItem("reviews");

    if (data) setApplicants(JSON.parse(data));
    if (reviews) setSelectedApplicants(JSON.parse(reviews));

    const reviewMap: Record<string, number> = {};
    const parsed = JSON.parse(reviews || "{}");
    Object.values(parsed).forEach((r: any) => {
      if (r.email) {
        reviewMap[r.email] = (reviewMap[r.email] || 0) + 1;
      }
    });

    const chart = Object.entries(reviewMap).map(([email, count]) => ({
      name: email,
      selections: count,
    }));

    setChartData(chart);
  }, []);

  const handleSelect = (email: string, course: string) => {
    setSelectedApplicants((prev) => {
      const updated = {
        ...prev,
        [email]: {
          email,
          course,
          rank: prev[email]?.rank || 1,
          comment: prev[email]?.comment || "",
        },
      };
      localStorage.setItem("reviews", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRankChange = (email: string, rank: number) => {
    setSelectedApplicants((prev) => {
      const updated = {
        ...prev,
        [email]: {
          ...prev[email],
          rank,
        },
      };
      localStorage.setItem("reviews", JSON.stringify(updated));
      return updated;
    });
  };

  const handleCommentChange = (email: string, comment: string) => {
    setSelectedApplicants((prev) => {
      const updated = {
        ...prev,
        [email]: {
          ...prev[email],
          comment,
        },
      };
      localStorage.setItem("reviews", JSON.stringify(updated));
      return updated;
    });
  };

  const filtered = applicants
    .filter((app) => app.course.toLowerCase().includes(selectedCourse.toLowerCase() || ""))
    .filter((app) =>
      [app.email, app.username, app.course, app.availability, app.skills]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const sorted = filtered.sort((a, b) => {
    if (sortBy === "course") {
      return a.course.localeCompare(b.course);
    } else {
      return a.availability.localeCompare(b.availability);
    }
  });

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Lecturer Dashboard</h1>
        <h2 className="text-xl font-semibold text-center mb-6">
          Welcome, {lecturer?.username || lecturer?.email}
        </h2>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">📊 Applicant Selection Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="selections" fill="#3B82F6" name="Selections" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Filter by Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">All</option>
              {[...new Set(applicants.map((a) => a.course))].map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Search Applicants:</label>
            <input
              type="text"
              placeholder="Name, availability, skill..."
              className="w-full border p-2 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "course" | "availability")}
              className="w-full border p-2 rounded"
            >
              <option value="course">Course</option>
              <option value="availability">Availability</option>
            </select>
          </div>
        </div>

        {/* Applicants */}
        {sorted.length === 0 ? (
          <p className="text-center text-gray-500">No matching applicants found.</p>
        ) : (
          sorted.map((applicant, index) => (
            <div key={index} className="relative border rounded p-4 mb-6 shadow-md">
              {selectedApplicants[applicant.email]?.rank && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Rank: {selectedApplicants[applicant.email].rank}
                </div>
              )}

              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                  {applicant.username || applicant.email}
                </h2>
                <button
                  onClick={() => handleSelect(applicant.email, applicant.course)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Select
                </button>
              </div>

              <p><strong>Course:</strong> {applicant.course}</p>
              <p><strong>Availability:</strong> {applicant.availability}</p>
              <p><strong>Previous Roles:</strong> {applicant.previousRoles}</p>
              <p><strong>Skills:</strong> {applicant.skills}</p>
              <p><strong>Credentials:</strong> {applicant.credentials}</p>

              {selectedApplicants[applicant.email] && (
                <div className="mt-4 bg-gray-50 p-4 rounded border">
                  <label className="block font-medium">Rank (1–10):</label>
                  <input
                    type="number"
                    value={selectedApplicants[applicant.email].rank}
                    onChange={(e) => handleRankChange(applicant.email, parseInt(e.target.value))}
                    className="border p-2 rounded w-20 mt-1"
                    min={1}
                    max={10}
                  />

                  <label className="block mt-4 font-medium">Comment:</label>
                  <textarea
                    value={selectedApplicants[applicant.email].comment}
                    onChange={(e) => handleCommentChange(applicant.email, e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                    rows={3}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
