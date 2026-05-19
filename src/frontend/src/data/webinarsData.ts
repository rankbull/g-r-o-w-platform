export interface Webinar {
  id: number;
  title: string;
  host: string;
  date: string;
  time: string;
  topic: string;
  subject: string;
  attendeeCount: number;
  isFree: boolean;
  creditCost: number;
  meetLink: string;
}

export const WEBINARS: Webinar[] = [
  {
    id: 1,
    title: "Advanced Calculus: Mastering Integration",
    host: "Prof. Dr. Anderson",
    date: "Mar 20, 2026",
    time: "2:00 PM UTC",
    topic:
      "Integration techniques, multivariable calculus, and real analysis applications",
    subject: "Math",
    attendeeCount: 142,
    isFree: false,
    creditCost: 25,
    meetLink: "https://meet.google.com/new",
  },
  {
    id: 2,
    title: "Cybersecurity in the Modern Era",
    host: "Dr. Li Chen",
    date: "Mar 22, 2026",
    time: "4:00 PM UTC",
    topic:
      "Threat modeling, ethical hacking, zero-day exploits, and defense strategies",
    subject: "Computer Science",
    attendeeCount: 289,
    isFree: true,
    creditCost: 0,
    meetLink: "https://meet.google.com/new",
  },
  {
    id: 3,
    title: "Machine Learning from Zero to Hero",
    host: "Ms. Kavya Patel",
    date: "Mar 25, 2026",
    time: "3:00 PM UTC",
    topic: "Neural networks, CNNs, transformers, and hands-on Python projects",
    subject: "Computer Science",
    attendeeCount: 412,
    isFree: false,
    creditCost: 30,
    meetLink: "https://meet.google.com/new",
  },
  {
    id: 4,
    title: "The Geopolitics of the 21st Century",
    host: "Prof. Dr. Williams",
    date: "Mar 28, 2026",
    time: "1:00 PM UTC",
    topic:
      "Great power competition, climate geopolitics, and the future of international order",
    subject: "History",
    attendeeCount: 98,
    isFree: true,
    creditCost: 0,
    meetLink: "https://meet.google.com/new",
  },
  {
    id: 5,
    title: "Creative Writing Masterclass",
    host: "Author Sofia Martinez",
    date: "Apr 1, 2026",
    time: "5:00 PM UTC",
    topic:
      "Storytelling craft, world-building, character arcs, and getting published",
    subject: "English",
    attendeeCount: 187,
    isFree: false,
    creditCost: 20,
    meetLink: "https://meet.google.com/new",
  },
  {
    id: 6,
    title: "Quantum Physics: Beyond Classical Mechanics",
    host: "Dr. Hiroshi Yamamoto",
    date: "Apr 3, 2026",
    time: "2:30 PM UTC",
    topic:
      "Superposition, entanglement, quantum computing, and the nature of reality",
    subject: "Science",
    attendeeCount: 231,
    isFree: false,
    creditCost: 35,
    meetLink: "https://meet.google.com/new",
  },
];
