import React, { useEffect, useState } from "react";

type Applicant = {
  email: string;
  course: string;
  role: string;
  availability: string;
  previousRoles: string;
  skills: string;
  credentials: string;
};

export default function LecturerDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);


  useEffect(() => {
    const stored = localStorage.getItem("applicants");
    if (stored) {
      setApplicants(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 mt-8 rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Lecturer Dashboard</h2>

      {applicants.length === 0 ? (
        <p className="text-center text-gray-500">No applications yet.</p>
      ) : (
        <table className="w-full text-left border">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Course</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Availability</th>
              <th className="p-2 border">Skills</th>
              <th className="p-2 border">Credentials</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((app, index) => (
              <tr key={index} className="border-t">
                <td className="p-2 border">{app.email}</td>
                <td className="p-2 border">{app.course}</td>
                <td className="p-2 border">{app.role}</td>
                <td className="p-2 border">{app.availability}</td>
                <td className="p-2 border">{app.skills}</td>
                <td className="p-2 border">{app.credentials}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
