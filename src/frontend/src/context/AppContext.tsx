import { createActor } from "@/backend";
import {
  useActor as useCaffeineActor,
  useInternetIdentity,
} from "@caffeineai/core-infrastructure";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface LocalNote {
  id: number;
  title: string;
  uploaderName: string;
  subject: string;
  description: string;
  qualityStars: number;
  creditsAwarded: number;
  downloadCount: number;
  price: number;
  timestamp: number;
  fileId: string;
  aiScore?: number;
}

export interface LeaderboardEntry {
  name: string;
  totalEarned: number;
  totalUploads: number;
  credits: number;
}

export interface LocalUser {
  username: string;
  email: string;
  credits: number;
  isII?: boolean; // true when authenticated via Internet Identity
}

interface AppContextType {
  notes: LocalNote[];
  leaderboard: LeaderboardEntry[];
  user: LocalUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  addNote: (
    note: Omit<
      LocalNote,
      "id" | "creditsAwarded" | "downloadCount" | "timestamp"
    >,
  ) => number;
  updateNoteQuality: (id: number, stars: number) => void;
  deleteNote: (id: number) => void;
  downloadNote: (id: number) => boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  loginWithII: () => void;
  isIILoggingIn: boolean;
  isIIInitializing: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

const ADMIN_PASSWORD = "admin123";
const NOTES_STORAGE_KEY = "grow_notes_v1";

const INITIAL_NOTES: LocalNote[] = [
  // Math
  {
    id: 1,
    title: "Calculus II — Integration Techniques",
    uploaderName: "Marcus T.",
    subject: "Math",
    description:
      "Complete guide to integration by parts, partial fractions, and trigonometric substitution with solved examples.",
    qualityStars: 5,
    creditsAwarded: 90,
    downloadCount: 34,
    price: 10,
    timestamp: Date.now() - 2 * 3600000,
    fileId: "calc2",
  },
  {
    id: 2,
    title: "Linear Algebra Fundamentals",
    uploaderName: "Emma W.",
    subject: "Math",
    description:
      "Vectors, matrices, determinants, eigenvalues and eigenvectors with visual explanations.",
    qualityStars: 4,
    creditsAwarded: 70,
    downloadCount: 28,
    price: 5,
    timestamp: Date.now() - 5 * 3600000,
    fileId: "linalg",
  },
  {
    id: 3,
    title: "Statistics & Probability Mastery",
    uploaderName: "Tom H.",
    subject: "Math",
    description:
      "Distributions, hypothesis testing, Bayesian methods, and real-world data analysis.",
    qualityStars: 4,
    creditsAwarded: 70,
    downloadCount: 19,
    price: 0,
    timestamp: Date.now() - 24 * 3600000,
    fileId: "stats",
  },
  // Science
  {
    id: 4,
    title: "Organic Chemistry Reaction Mechanisms",
    uploaderName: "Priya M.",
    subject: "Science",
    description:
      "SN1/SN2 reactions, elimination, addition, and aromatic chemistry with arrow-pushing diagrams.",
    qualityStars: 5,
    creditsAwarded: 95,
    downloadCount: 47,
    price: 15,
    timestamp: Date.now() - 35 * 60000,
    fileId: "orgchem",
  },
  {
    id: 5,
    title: "Quantum Physics Explained Simply",
    uploaderName: "Sarah K.",
    subject: "Science",
    description:
      "Wave-particle duality, the Schrödinger equation, and quantum tunneling made accessible.",
    qualityStars: 5,
    creditsAwarded: 90,
    downloadCount: 22,
    price: 10,
    timestamp: Date.now() - 3 * 3600000,
    fileId: "quantum",
  },
  {
    id: 6,
    title: "Biology: Cell Division & Genetics",
    uploaderName: "Nadia F.",
    subject: "Science",
    description:
      "Mitosis, meiosis, Mendelian genetics, and DNA replication explained with diagrams.",
    qualityStars: 3,
    creditsAwarded: 50,
    downloadCount: 15,
    price: 0,
    timestamp: Date.now() - 8 * 3600000,
    fileId: "celldiv",
  },
  // English
  {
    id: 7,
    title: "Shakespeare Tragedies — Deep Analysis",
    uploaderName: "Jamie L.",
    subject: "English",
    description:
      "Hamlet, Othello, Macbeth, and King Lear — themes, symbolism, and character studies.",
    qualityStars: 4,
    creditsAwarded: 70,
    downloadCount: 31,
    price: 5,
    timestamp: Date.now() - 18 * 60000,
    fileId: "shakes",
  },
  {
    id: 8,
    title: "Creative Writing: Finding Your Voice",
    uploaderName: "Alex R.",
    subject: "English",
    description:
      "Narrative techniques, character development, dialogue, and workshop exercises.",
    qualityStars: 4,
    creditsAwarded: 65,
    downloadCount: 24,
    price: 8,
    timestamp: Date.now() - 6 * 3600000,
    fileId: "writing",
  },
  {
    id: 9,
    title: "Advanced Grammar & Style Guide",
    uploaderName: "Chris O.",
    subject: "English",
    description:
      "Complex sentence structures, punctuation mastery, academic writing conventions.",
    qualityStars: 3,
    creditsAwarded: 50,
    downloadCount: 12,
    price: 0,
    timestamp: Date.now() - 2 * 24 * 3600000,
    fileId: "grammar",
  },
  // History
  {
    id: 10,
    title: "World War II — Complete Timeline",
    uploaderName: "Alex R.",
    subject: "History",
    description:
      "Key events, battles, political decisions, and consequences of WWII with maps.",
    qualityStars: 4,
    creditsAwarded: 65,
    downloadCount: 29,
    price: 5,
    timestamp: Date.now() - 2 * 3600000,
    fileId: "ww2",
  },
  {
    id: 11,
    title: "Cold War: Geopolitics & Proxy Wars",
    uploaderName: "Luis P.",
    subject: "History",
    description:
      "US-Soviet rivalry, nuclear arms race, Korean War, Vietnam, Berlin Wall, and détente.",
    qualityStars: 5,
    creditsAwarded: 85,
    downloadCount: 38,
    price: 10,
    timestamp: Date.now() - 4 * 3600000,
    fileId: "coldwar",
  },
  {
    id: 12,
    title: "Ancient Rome: Rise & Fall",
    uploaderName: "Emma W.",
    subject: "History",
    description:
      "Republic to Empire, Julius Caesar, Roman law, engineering, and the fall of the Western Empire.",
    qualityStars: 3,
    creditsAwarded: 50,
    downloadCount: 17,
    price: 0,
    timestamp: Date.now() - 12 * 3600000,
    fileId: "rome",
  },
  // Computer Science
  {
    id: 13,
    title: "Data Structures Complete Guide",
    uploaderName: "Sarah K.",
    subject: "Computer Science",
    description:
      "Arrays, linked lists, trees, graphs, hash tables, and algorithm complexity with Python implementations.",
    qualityStars: 5,
    creditsAwarded: 100,
    downloadCount: 62,
    price: 20,
    timestamp: Date.now() - 5 * 60000,
    fileId: "dsa",
  },
  {
    id: 14,
    title: "Machine Learning Fundamentals",
    uploaderName: "Jamie L.",
    subject: "Computer Science",
    description:
      "Supervised learning, neural networks, gradient descent, and model evaluation with scikit-learn.",
    qualityStars: 5,
    creditsAwarded: 95,
    downloadCount: 55,
    price: 15,
    timestamp: Date.now() - 4 * 3600000,
    fileId: "ml",
  },
  {
    id: 15,
    title: "React & TypeScript: Modern Web Dev",
    uploaderName: "Marcus T.",
    subject: "Computer Science",
    description:
      "Hooks, context, TypeScript types, performance optimization, and testing strategies.",
    qualityStars: 4,
    creditsAwarded: 75,
    downloadCount: 41,
    price: 10,
    timestamp: Date.now() - 7 * 3600000,
    fileId: "react",
  },
  // Other
  {
    id: 16,
    title: "Personal Finance Fundamentals",
    uploaderName: "Chris O.",
    subject: "Other",
    description:
      "Budgeting, investing, compound interest, retirement planning, and tax basics for students.",
    qualityStars: 4,
    creditsAwarded: 65,
    downloadCount: 33,
    price: 5,
    timestamp: Date.now() - 1 * 3600000,
    fileId: "finance",
  },
  {
    id: 17,
    title: "Public Speaking Mastery",
    uploaderName: "Nadia F.",
    subject: "Other",
    description:
      "Confidence building, structure, delivery techniques, and handling nerves for presentations.",
    qualityStars: 3,
    creditsAwarded: 55,
    downloadCount: 21,
    price: 0,
    timestamp: Date.now() - 3 * 24 * 3600000,
    fileId: "speaking",
  },
  {
    id: 18,
    title: "Nutrition Science & Healthy Habits",
    uploaderName: "Tom H.",
    subject: "Other",
    description:
      "Macronutrients, vitamins, metabolic health, and evidence-based diet strategies.",
    qualityStars: 3,
    creditsAwarded: 50,
    downloadCount: 16,
    price: 0,
    timestamp: Date.now() - 2 * 24 * 3600000,
    fileId: "nutrition",
  },
];

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { name: "Sarah K.", totalEarned: 1840, totalUploads: 18, credits: 920 },
  { name: "Jamie L.", totalEarned: 1620, totalUploads: 16, credits: 810 },
  { name: "Priya M.", totalEarned: 1450, totalUploads: 15, credits: 725 },
  { name: "Marcus T.", totalEarned: 1280, totalUploads: 12, credits: 640 },
  { name: "Emma W.", totalEarned: 1100, totalUploads: 11, credits: 550 },
  { name: "Luis P.", totalEarned: 980, totalUploads: 9, credits: 490 },
  { name: "Alex R.", totalEarned: 860, totalUploads: 8, credits: 430 },
  { name: "Nadia F.", totalEarned: 720, totalUploads: 7, credits: 360 },
  { name: "Chris O.", totalEarned: 580, totalUploads: 6, credits: 290 },
  { name: "Tom H.", totalEarned: 440, totalUploads: 5, credits: 220 },
];

function loadNotesFromStorage(): LocalNote[] {
  try {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fall through
  }
  return INITIAL_NOTES;
}

function saveNotesToStorage(notes: LocalNote[]) {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore storage errors
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<LocalNote[]>(loadNotesFromStorage);
  const [leaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [user, setUser] = useState<LocalUser | null>(() => {
    try {
      const stored = localStorage.getItem("grow_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Internet Identity auth
  const {
    login: iiLogin,
    clear: iiLogout,
    isAuthenticated: iiIsAuthenticated,
    isInitializing: isIIInitializing,
    isLoggingIn: isIILoggingIn,
    identity,
  } = useInternetIdentity();

  // Backend actor for role checks
  const { actor } = useCaffeineActor(createActor);

  // Whether the current II principal has admin role on the backend
  const [isIIAdmin, setIsIIAdmin] = useState(false);

  // Sync II auth state into local user
  useEffect(() => {
    if (iiIsAuthenticated && identity) {
      const principal = identity.getPrincipal().toString();
      // If no local user exists for this II session, create a guest II user
      setUser((prev) => {
        if (prev?.isII) return prev; // already synced
        const storedProfile = localStorage.getItem(`grow_ii_${principal}`);
        if (storedProfile) {
          return JSON.parse(storedProfile);
        }
        const iiUser: LocalUser = {
          username: `user_${principal.slice(0, 8)}`,
          email: "",
          credits: 100,
          isII: true,
        };
        localStorage.setItem(`grow_ii_${principal}`, JSON.stringify(iiUser));
        return iiUser;
      });

      // Check backend for admin role — only set isIIAdmin if backend confirms
      if (actor) {
        actor
          .isCallerAdmin()
          .then((adminResult) => setIsIIAdmin(adminResult))
          .catch(() => setIsIIAdmin(false));
      }
    } else if (!iiIsAuthenticated && !isIIInitializing) {
      // II logged out — clear II-based user but keep local users
      setIsIIAdmin(false);
      setUser((prev) => {
        if (prev?.isII) return null;
        return prev;
      });
    }
  }, [iiIsAuthenticated, identity, isIIInitializing, actor]);

  // Admin: either hardcoded admin/admin123 OR II principal confirmed by backend
  const isAdmin = user?.username === "admin" || isIIAdmin;
  const isAuthenticated = !!user;

  // Persist notes to localStorage whenever they change
  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  const saveUser = useCallback((u: LocalUser | null) => {
    setUser(u);
    if (u && !u.isII) localStorage.setItem("grow_user", JSON.stringify(u));
    else if (!u) localStorage.removeItem("grow_user");
  }, []);

  const login = useCallback(
    (username: string, password: string): boolean => {
      if (username === "admin" && password === ADMIN_PASSWORD) {
        saveUser({ username: "admin", email: "admin@grow.edu", credits: 9999 });
        return true;
      }
      const stored = localStorage.getItem(`grow_account_${username}`);
      if (stored) {
        const acct = JSON.parse(stored);
        if (acct.password === password) {
          saveUser({
            username: acct.username,
            email: acct.email,
            credits: acct.credits ?? 100,
          });
          return true;
        }
      }
      return false;
    },
    [saveUser],
  );

  const register = useCallback(
    (username: string, email: string, password: string): boolean => {
      if (localStorage.getItem(`grow_account_${username}`)) return false;
      const acct = { username, email, password, credits: 100 };
      localStorage.setItem(`grow_account_${username}`, JSON.stringify(acct));
      saveUser({ username, email, credits: 100 });
      return true;
    },
    [saveUser],
  );

  const logout = useCallback(() => {
    if (user?.isII) {
      iiLogout();
    }
    saveUser(null);
  }, [user, iiLogout, saveUser]);

  const loginWithII = useCallback(() => {
    iiLogin();
  }, [iiLogin]);

  const addNote = useCallback(
    (
      note: Omit<
        LocalNote,
        "id" | "creditsAwarded" | "downloadCount" | "timestamp"
      >,
    ): number => {
      const credits = note.qualityStars * 20;
      const newNote: LocalNote = {
        ...note,
        id: Date.now(),
        creditsAwarded: credits,
        downloadCount: 0,
        timestamp: Date.now(),
      };
      setNotes((prev) => [newNote, ...prev]);
      if (user) {
        saveUser({ ...user, credits: user.credits + credits });
        const stored = localStorage.getItem(`grow_account_${user.username}`);
        if (stored) {
          const acct = JSON.parse(stored);
          acct.credits = (acct.credits ?? 0) + credits;
          localStorage.setItem(
            `grow_account_${user.username}`,
            JSON.stringify(acct),
          );
        }
      }
      return credits;
    },
    [user, saveUser],
  );

  const updateNoteQuality = useCallback((id: number, stars: number) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, qualityStars: stars, creditsAwarded: stars * 20 }
          : n,
      ),
    );
  }, []);

  const deleteNote = useCallback((id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const downloadNote = useCallback(
    (id: number): boolean => {
      if (!user) return false;
      const note = notes.find((n) => n.id === id);
      if (!note) return false;
      if (user.credits < note.price) return false;
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, downloadCount: n.downloadCount + 1 } : n,
        ),
      );
      if (note.price > 0)
        saveUser({ ...user, credits: user.credits - note.price });
      return true;
    },
    [user, notes, saveUser],
  );

  // Sync credits from localStorage for current user periodically
  useEffect(() => {
    if (!user || user.username === "admin") return;
    const stored = localStorage.getItem(`grow_account_${user.username}`);
    if (stored) {
      const acct = JSON.parse(stored);
      if (acct.credits !== user.credits)
        setUser((prev) => (prev ? { ...prev, credits: acct.credits } : prev));
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        notes,
        leaderboard,
        user,
        isAdmin,
        isAuthenticated,
        addNote,
        updateNoteQuality,
        deleteNote,
        downloadNote,
        login,
        register,
        logout,
        loginWithII,
        isIILoggingIn,
        isIIInitializing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
