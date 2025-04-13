import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useShortlistStats } from "../hooks/useShortlistStats";

type Applicant = {
  email: string;
  course: string;
  role: string;
  availability: string;
  previousRoles: string;
  skills: string;
  credentials: string;
};

type ShortlistEntry = {
  email: string;
  rank: number;
  comment: string;
};

export default function LecturerDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [shortlist, setShortlist] = useState<ShortlistEntry[]>([]);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"course" | "availability" | "">("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("applicants");
    if (stored) {
      setApplicants(JSON.parse(stored));
    }
  }, []);

  const handleShortlistChange = (email: string, rank: number, comment: string) => {
    setShortlist((prev) => {
      const updated = prev.filter((entry) => entry.email !== email);
      if (rank > 0 || comment.trim() !== "") {
        updated.push({ email, rank, comment });
      }
      return updated.sort((a, b) => a.rank - b.rank);
    });
  };

  const saveShortlist = () => {
    localStorage.setItem("shortlist", JSON.stringify(shortlist));
    alert("✅ Shortlist saved successfully.");
  };

  const filteredApplicants = applicants
    .filter((a) => {
      const query = search.toLowerCase();
      return (
        a.course.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.availability.toLowerCase().includes(query) ||
        a.skills.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = (a[sortField] || "").toLowerCase();
      const valB = (b[sortField] || "").toLowerCase();
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    

  const stats = useShortlistStats(applicants, shortlist);

  return (
    <div className="max-w-7xl mx-auto bg-white shadow p-6 mt-8 rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Lecturer Dashboard</h2>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by course, email, availability, or skill"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/2"
        />

        <div className="flex gap-2 items-center">
          <label className="font-medium">Sort by:</label>
          <select
            value={sortField}
            onChange={(e) =>
              setSortField(e.target.value as "course" | "availability" | "")
            }
            className="border p-2 rounded"
          >
            <option value="">None</option>
            <option value="course">Course</option>
            <option value="availability">Availability</option>
          </select>

          <button
            type="button"
            onClick={() => setSortAsc((prev) => !prev)}
            className="text-sm px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            {sortAsc ? "▲ Asc" : "▼ Desc"}
          </button>
        </div>
      </div>

      {/* Applicants Table */}
      {filteredApplicants.length === 0 ? (
        <p className="text-center text-gray-500">No matching applications.</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveShortlist();
          }}
        >
          <table className="w-full text-left border mb-6">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Course</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Availability</th>
                <th className="p-2 border">Skills</th>
                <th className="p-2 border">Credentials</th>
                <th className="p-2 border">Rank</th>
                <th className="p-2 border">Comment</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((app) => {
                const shortlistEntry = shortlist.find((s) => s.email === app.email);
                return (
                  <tr key={app.email} className="border-t align-top">
                    <td className="p-2 border">{app.email}</td>
                    <td className="p-2 border">{app.course}</td>
                    <td className="p-2 border">{app.role}</td>
                    <td className="p-2 border">{app.availability}</td>
                    <td className="p-2 border whitespace-pre-wrap">{app.skills}</td>
                    <td className="p-2 border whitespace-pre-wrap">{app.credentials}</td>
                    <td className="p-2 border w-24">
                      <input
                        type="number"
                        min={1}
                        value={shortlistEntry?.rank || ""}
                        onChange={(e) =>
                          handleShortlistChange(app.email, Number(e.target.value), shortlistEntry?.comment || "")
                        }
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="p-2 border">
                      <textarea
                        rows={2}
                        className="w-full border p-1 rounded"
                        value={shortlistEntry?.comment || ""}
                        onChange={(e) =>
                          handleShortlistChange(app.email, shortlistEntry?.rank || 0, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
            >
              Save Shortlist
            </button>
          </div>
        </form>
      )}

      {/* Stats & Chart */}
      {applicants.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-center">
            📊 Application Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 border rounded shadow">
              <p className="font-bold">Most Chosen Applicant</p>
              <p>{stats.mostChosen || "No data"}</p>
            </div>
            <div className="p-4 border rounded shadow">
              <p className="font-bold">Least Chosen Applicant</p>
              <p>{stats.leastChosen || "No data"}</p>
            </div>
            <div className="p-4 border rounded shadow">
              <p className="font-bold">Unselected Applicants</p>
              <ul className="text-sm mt-2">
                {stats.notSelected.length === 0
                  ? "All selected"
                  : stats.notSelected.map((email) => (
                      <li key={email}>{email}</li>
                    ))}
              </ul>
            </div>
          </div>

          <div className="mt-10">
            <h4 className="text-lg font-bold mb-2 text-center">
              Selection Frequency
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.barChartData}>
                <XAxis dataKey="email" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3182ce" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
