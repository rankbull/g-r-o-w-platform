export interface Course {
  id: number;
  title: string;
  instructor: string;
  subject: string;
  duration: string;
  lessons: number;
  isFree: boolean;
  creditCost: number;
  level: string;
  rating: number;
  enrolled: number;
}

export const COURSES: Course[] = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    instructor: "Alex Kim",
    subject: "Computer Science",
    duration: "12 weeks",
    lessons: 48,
    isFree: false,
    creditCost: 150,
    level: "Intermediate",
    rating: 4.9,
    enrolled: 1240,
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    instructor: "Dr. Maria Santos",
    subject: "Computer Science",
    duration: "8 weeks",
    lessons: 32,
    isFree: true,
    creditCost: 0,
    level: "Beginner",
    rating: 4.7,
    enrolled: 3800,
  },
  {
    id: 3,
    title: "Advanced Mathematics: Proofs & Analysis",
    instructor: "Prof. Dr. Patel",
    subject: "Math",
    duration: "10 weeks",
    lessons: 40,
    isFree: false,
    creditCost: 200,
    level: "Advanced",
    rating: 4.8,
    enrolled: 620,
  },
  {
    id: 4,
    title: "English Literature Mastery",
    instructor: "Prof. James Brown",
    subject: "English",
    duration: "6 weeks",
    lessons: 24,
    isFree: false,
    creditCost: 100,
    level: "Intermediate",
    rating: 4.6,
    enrolled: 890,
  },
  {
    id: 5,
    title: "Cybersecurity Essentials",
    instructor: "James Lee",
    subject: "Computer Science",
    duration: "14 weeks",
    lessons: 56,
    isFree: false,
    creditCost: 250,
    level: "Intermediate",
    rating: 4.9,
    enrolled: 1680,
  },
  {
    id: 6,
    title: "Cell Biology & Genetics",
    instructor: "Dr. Chen",
    subject: "Science",
    duration: "8 weeks",
    lessons: 30,
    isFree: true,
    creditCost: 0,
    level: "Beginner",
    rating: 4.5,
    enrolled: 2100,
  },
];
