import { useMemo } from "react";

type Applicant = {
  email: string;
};

type ShortlistEntry = {
  email: string;
};

export const useShortlistStats = (
  applicants: Applicant[],
  shortlist: ShortlistEntry[]
) => {
  const stats = useMemo(() => {
    const selectionCount: Record<string, number> = {};

    shortlist.forEach(({ email }) => {
      selectionCount[email] = (selectionCount[email] || 0) + 1;
    });

    const allApplicants = applicants.map((a) => a.email);
    const selectedEmails = shortlist.map((s) => s.email);

    const notSelected = allApplicants.filter((email) => !selectedEmails.includes(email));

    const sortedBySelection = Object.entries(selectionCount).sort(
      (a, b) => b[1] - a[1]
    );

    const mostChosen = sortedBySelection[0]?.[0] || "";
    const leastChosen = sortedBySelection[sortedBySelection.length - 1]?.[0] || "";

    const barChartData = applicants.map((a) => ({
      email: a.email,
      count: selectionCount[a.email] || 0,
    }));

    return {
      mostChosen,
      leastChosen,
      notSelected,
      barChartData,
    };
  }, [applicants, shortlist]);

  return stats;
};
