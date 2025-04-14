import { render, screen } from "@testing-library/react";
import LecturerDashboard from "../pages/lecturer-dashboard";
import { AuthProvider } from "../context/AuthContext";

test("renders dashboard with correct headers", () => {
  render(
    <AuthProvider>
      <LecturerDashboard />
    </AuthProvider>
  );

  expect(screen.getByText(/LECTURER DASHBOARD/i)).toBeInTheDocument();
  expect(screen.getByText(/Filter by Course/i)).toBeInTheDocument();
  expect(screen.getByText(/Tutor Applicants/i)).toBeInTheDocument();
  expect(screen.getByText(/Lab Assistant Applicants/i)).toBeInTheDocument();
});

import { render, screen, fireEvent } from "@testing-library/react";

test("typing into search input updates its value", () => {
  render(
    <AuthProvider>
      <LecturerDashboard />
    </AuthProvider>
  );

  const input = screen.getByPlaceholderText(/search by name/i);
  fireEvent.change(input, { target: { value: "Alice" } });
  expect((input as HTMLInputElement).value).toBe("Alice");
});

import { render, screen, fireEvent } from "@testing-library/react";

test("rank modal opens when clicking More Options", async () => {
  localStorage.setItem("applicants", JSON.stringify([
    {
      username: "testuser",
      email: "test@example.com",
      course: "COSC1234",
      role: "tutor",
      availability: "full-time",
      previousRoles: "TA",
      skills: "JS, React",
      credentials: "Masters",
    }
  ]));

  render(
    <AuthProvider>
      <LecturerDashboard />
    </AuthProvider>
  );

  const button = await screen.findByText(/More Options/i);
  fireEvent.click(button);

  expect(screen.getByText(/Rank Applicant/i)).toBeInTheDocument();
});

import { render, screen } from "@testing-library/react";

test("priority graph renders if data exists", () => {
  localStorage.setItem("applicants", JSON.stringify([
    { username: "user1", course: "COSC1234", role: "tutor", email: "a", availability: "part-time", previousRoles: "", skills: "", credentials: "" }
  ]));

  localStorage.setItem("reviews", JSON.stringify({
    "user1_COSC1234_tutor": {
      username: "user1", course: "COSC1234", role: "tutor", rank: 1, comment: "Great"
    }
  }));

  render(
    <AuthProvider>
      <LecturerDashboard />
    </AuthProvider>
  );

  expect(screen.getByText(/Overall Applicant Priority/i)).toBeInTheDocument();
});


test("displays message when no applicants match filters", () => {
    localStorage.setItem("applicants", JSON.stringify([]));
    render(
      <AuthProvider>
        <LecturerDashboard />
      </AuthProvider>
    );
    expect(screen.getByText(/Unselected Applicants: None/i)).toBeInTheDocument();
  });
  