import Navbar from "../components/nav";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createPortal } from "react-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
} from "recharts";


interface Applicant {
  email: string;
  username: string;
  course: string;
  role: string;
  availability: string;
  previousRoles: string;
  skills: string;
  credentials: string;
}

interface Review {
  username: string;
  course: string;
  role: string;
  rank: number;
  comment: string;
}

function RankModal({ onClose, onSave, applicant, usedRanks }: {
  onClose: () => void;
  onSave: (rank: number, comment: string) => void;
  applicant: Applicant;
  usedRanks: number[];
}) {
  const [rank, setRank] = useState<number>(0);
  const [comment, setComment] = useState("");
  const availableRanks = [1, 2, 3, 4, 5].filter((r) => !usedRanks.includes(r));

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
        <h3 className="text-xl font-semibold mb-4">Rank Applicant</h3>
        <p className="mb-2 font-medium">{applicant.username || applicant.email}</p>
        <label className="block mb-2">Rank (1-5):</label>
        <select
          value={rank}
          onChange={(e) => setRank(Number(e.target.value))}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">-- Select Rank --</option>
          {availableRanks.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <label className="block mb-2">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          rows={3}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-400 text-white">Cancel</button>
          <button
            onClick={() => rank && onSave(rank, comment)}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}


export default function LecturerDashboard() {
  const { lecturer } = useAuth();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [selectedReviews, setSelectedReviews] = useState<Record<string, Review>>({});
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortKey, setSortKey] = useState<"course" | "availability">("course");
  const [mostChosen, setMostChosen] = useState<string | null>(null);
  const [leastChosen, setLeastChosen] = useState<string | null>(null);
  const [unselected, setUnselected] = useState<string[]>([]);
  const [priorityData, setPriorityData] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("applicants");
    const reviews = localStorage.getItem("reviews");
    if (data) setApplicants(JSON.parse(data));
    if (reviews) setSelectedReviews(JSON.parse(reviews));
  }, []);

  useEffect(() => {
    const countMap: Record<string, number> = {};
    Object.values(selectedReviews).forEach((r) => {
      countMap[r.username] = (countMap[r.username] || 0) + 1;
    });
    const entries = Object.entries(countMap);
    setMostChosen(entries.sort((a, b) => b[1] - a[1])[0]?.[0] || null);
    setLeastChosen(entries.sort((a, b) => a[1] - b[1])[0]?.[0] || null);
    const selectedUsernames = new Set(Object.keys(countMap));
    setUnselected(applicants.map(a => a.username).filter(u => !selectedUsernames.has(u)));
    const maxRank = 5;
const allUsernames = new Set(applicants.map((a) => a.username));
const scores: any[] = [];
const getColor = (status: string) => {
  if (status === "highest") return "#34D399"; 
  if (status === "selected") return "#60A5FA"; 
  return "#D1D5DB"; 
};

allUsernames.forEach((username) => {
  const review = Object.values(selectedReviews).find((r) => r.username === username);
  if (review) {
    scores.push({
      username,
      priorityScore: maxRank + 1 - review.rank,
      status: "selected",
    });
  } else {
    scores.push({ username, priorityScore: 0, status: "unselected" });
  }
});

const highest = Math.max(...scores.map((s) => s.priorityScore));
scores.forEach((s) => {
  if (s.priorityScore === highest && s.status === "selected") {
    s.status = "highest";
  }
});

setPriorityData(scores);

  }, [selectedReviews, applicants]);


  const handleSaveReview = (rank: number, comment: string) => {
    if (!selectedApplicant) return;
    const key = `${selectedApplicant.username}_${selectedApplicant.course}_${selectedApplicant.role}`;
    const updated = {
      ...selectedReviews,
      [key]: {
        username: selectedApplicant.username || selectedApplicant.email,
        course: selectedApplicant.course,
        role: selectedApplicant.role,
        rank,
        comment,
      },
    };
    localStorage.setItem("reviews", JSON.stringify(updated));
    setSelectedReviews(updated);
    setSelectedApplicant(null);
  };

  const getUsedRanksForCourse = (course: string, role: string) => {
    return Object.values(selectedReviews)
      .filter((r) => r.course === course && r.role === role)
      .map((r) => r.rank);
  };

  const renderApplicantCard = (applicant: Applicant) => {
    const key = `${applicant.username}_${applicant.course}_${applicant.role}`;
    const review = selectedReviews[key];
    return (
      <div key={key} className="relative bg-white p-4 rounded shadow">
        {review?.rank && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Rank: {review.rank}
          </div>
        )}
        <p><strong>Username:</strong> {applicant.username}</p>
        <p><strong>Course:</strong> {applicant.course}</p>
        <p><strong>Availability:</strong> {applicant.availability}</p>
        <p><strong>Previous Roles:</strong> {applicant.previousRoles}</p>
        <p><strong>Skills:</strong> {applicant.skills}</p>
        <p><strong>Credentials:</strong> {applicant.credentials}</p>
        <button
          onClick={() => setSelectedApplicant(applicant)}
          className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          More Options
        </button>
      </div>
    );
  };

  const filteredApplicants = applicants
    .filter((a) =>
      (!selectedCourse || a.course === selectedCourse) &&
      [a.course, a.username, a.availability, a.skills]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === "course") return a.course.localeCompare(b.course);
      if (sortKey === "availability") return a.availability.localeCompare(b.availability);
      return 0;
    });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, {lecturer?.username}</h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-6">LECTURER DASHBOARD</h2>

        <div className="mb-6 grid md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Filter by Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">All Courses</option>
              {[...new Set(applicants.map((a) => a.course))].map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, course, skill, availability"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Sort By:</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as "course" | "availability")}
              className="w-full border p-2 rounded"
            >
              <option value="course">Course</option>
              <option value="availability">Availability</option>
            </select>
          </div>
        </div>

        
        <div className="mb-8 bg-white border rounded p-4 shadow">
          <h3 className="text-lg font-bold mb-2">Applicant Selection Summary</h3>
          <p><strong>Most Chosen Applicant:</strong> {mostChosen || "N/A"}</p>
          <p><strong>Least Chosen Applicant:</strong> {leastChosen || "N/A"}</p>
          <p><strong>Unselected Applicants:</strong> {unselected.length > 0 ? unselected.join(", ") : "None"}</p>
        </div>


        {priorityData.length > 0 && (
  <div className="mb-10 bg-white p-6 rounded shadow">
    <h3 className="text-xl font-semibold mb-4 text-center">Overall Applicant Priority</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={priorityData} layout="vertical">
        <XAxis type="number" />
        <YAxis dataKey="username" type="category" width={150} />
        <Tooltip />
        <Legend />
        <Bar dataKey="priorityScore" name="Priority Score">
          {priorityData.map((entry, index) => (
            <Cell key={index} fill={
              entry.status === "highest" ? "#34D399" :
              entry.status === "selected" ? "#60A5FA" :
              "#D1D5DB"
            } />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    <div className="mt-2 text-sm text-center text-gray-600">
      <strong>Legend:</strong>{" "}
      <span className="text-green-600 font-semibold">Highest</span>,{" "}
      <span className="text-blue-600 font-semibold">Selected</span>,{" "}
      <span className="text-gray-600 font-semibold">Unselected</span>
    </div>
  </div>
)}

        <div className="grid md:grid-cols-2 gap-8">
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-600">Tutor Applicants</h3>
            <div className="space-y-4">
              {filteredApplicants.filter((a) => a.role === "tutor").map(renderApplicantCard)}
            </div>
          </div>

          
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-600">Lab Assistant Applicants</h3>
            <div className="space-y-4">
              {filteredApplicants.filter((a) => a.role === "lab-assistant").map(renderApplicantCard)}
            </div>
          </div>
        </div>

        {selectedApplicant && (
          <RankModal
            applicant={selectedApplicant}
            usedRanks={getUsedRanksForCourse(selectedApplicant.course, selectedApplicant.role)}
            onClose={() => setSelectedApplicant(null)}
            onSave={handleSaveReview}
          />
        )}
      </div>
    </div>
  );
}