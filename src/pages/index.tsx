import React from "react";
import Image from "next/image";

export default function HomePage() {
  return (
    <section className="max-w-4xl mx-auto text-center sm:text-left">
      <h1 className="text-4xl font-bold mb-4">Welcome to TeachTeam (TT)</h1>
      <p className="mb-6 text-lg leading-relaxed">
        TeachTeam is a streamlined system to facilitate tutor hiring at the School of Computer Science.
        Tutors can apply for courses by submitting their academic credentials, availability, and skills.
        Lecturers can review, comment, and rank applicants based on course requirements.
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        <Image
          src="/images/tutor-selection.jpg"
          alt="Tutor selection"
          width={400}
          height={250}
          className="rounded shadow-md"
        />
        <Image
          src="/images/classroom.jpg"
          alt="Classroom teaching"
          width={400}
          height={250}
          className="rounded shadow-md"
        />
      </div>

      <p className="mt-6 text-md text-gray-600">
        Please sign in to proceed as a <strong>Lecturer</strong> or a <strong>Tutor Applicant</strong>.
      </p>
    </section>
  );
}
