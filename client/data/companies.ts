export type Job = { id: string; title: string; location: string; type: string };
export type Company = {
  slug: string;
  name: string;
  blurb: string;
  logo?: string;
  jobs: Job[];
};

export const companies: Company[] = [
  {
    slug: "mecer-inter-ed",
    name: "Mecer Inter-Ed",
    blurb: "Leading training provider offering vendor-accredited learning.",
    logo: undefined,
    jobs: [
      { id: "dev-learnership", title: "Software Development Learnership", location: "Johannesburg", type: "Learnership" },
      { id: "cloud-intern", title: "Cloud Support Internship", location: "Midrand", type: "Internship" },
    ],
  },
  {
    slug: "capaciti",
    name: "CAPACITI",
    blurb: "Digital skills development and work readiness programs.",
    logo: undefined,
    jobs: [
      { id: "data-analyst-intern", title: "Data Analyst Internship", location: "Cape Town", type: "Internship" },
      { id: "ux-learnership", title: "UX/UI Design Learnership", location: "Remote", type: "Learnership" },
    ],
  },
  {
    slug: "partner-x",
    name: "Partner X",
    blurb: "Technology services and graduate opportunities.",
    jobs: [
      { id: "it-support", title: "IT Support Learnership", location: "Pretoria", type: "Learnership" },
    ],
  },
];
