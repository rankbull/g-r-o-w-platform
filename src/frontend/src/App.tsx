import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import BrowseNotes from "./components/BrowseNotes";
import CommunitySection from "./components/CommunitySection";
import CoursesSection from "./components/CoursesSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import GrowBot from "./components/GrowBot";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import Leaderboard from "./components/Leaderboard";
import LiveUploadFeed from "./components/LiveUploadFeed";
import Navbar from "./components/Navbar";
import SubjectPreviewPage from "./components/SubjectPreviewPage";
import SubjectsSection from "./components/SubjectsSection";
import UploadNotes from "./components/UploadNotes";
import WebinarsSection from "./components/WebinarsSection";
import { AppProvider, useAppContext } from "./context/AppContext";

type RouteView = "home" | "subject-preview";

function parseHash(hash: string): {
  view: RouteView;
  subject?: string;
  section?: string;
} {
  if (hash.startsWith("#subject-")) {
    return { view: "subject-preview", subject: hash.slice(9) };
  }
  const section = hash.startsWith("#") ? hash.slice(1) : "home";
  return { view: "home", section };
}

function AppInner() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [currentView, setCurrentView] = useState<RouteView>("home");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [pendingSubject, setPendingSubject] = useState<string | null>(null);

  const { user } = useAppContext();

  // Initialize view from URL hash on first load
  useEffect(() => {
    const route = parseHash(window.location.hash);
    if (route.view === "subject-preview" && route.subject) {
      setCurrentView("subject-preview");
      setSelectedSubject(route.subject);
    }
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const route = parseHash(window.location.hash);
      if (route.view === "subject-preview" && route.subject) {
        setCurrentView("subject-preview");
        setSelectedSubject(route.subject);
      } else {
        setCurrentView("home");
        setSelectedSubject(null);
        if (route.section && route.section !== "home") {
          setTimeout(() => {
            document
              .getElementById(route.section!)
              ?.scrollIntoView({ behavior: "smooth" });
          }, 80);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // After login, if there's a pending subject redirect, navigate to it
  useEffect(() => {
    if (user && pendingSubject) {
      navigateToSubject(pendingSubject);
      setPendingSubject(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pendingSubject]);

  const navigateToSubject = (key: string) => {
    history.pushState(
      { view: "subject-preview", subject: key },
      "",
      `#subject-${key}`,
    );
    setSelectedSubject(key);
    setCurrentView("subject-preview");
  };

  const navigateToSection = (section: string) => {
    if (currentView !== "home") {
      history.pushState({ view: "home", section }, "", `#${section}`);
      setCurrentView("home");
      setSelectedSubject(null);
      setTimeout(() => {
        if (section !== "home") {
          document
            .getElementById(section)
            ?.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 80);
    } else {
      // Already on home — just scroll
      history.replaceState({ view: "home", section }, "", `#${section}`);
      if (section !== "home") {
        document
          .getElementById(section)
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBackToHome = () => {
    history.pushState({ view: "home", section: "subjects" }, "", "#subjects");
    setCurrentView("home");
    setSelectedSubject(null);
    setTimeout(() => {
      document
        .getElementById("subjects")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const handleLoginRequired = () => {
    if (selectedSubject) {
      setPendingSubject(selectedSubject);
    }
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onAdminClick={() => setAdminOpen(true)}
        authOpen={authOpen}
        onAuthClose={() => setAuthOpen(false)}
        onAuthOpen={() => setAuthOpen(true)}
        onSectionNav={navigateToSection}
      />

      {currentView === "subject-preview" && selectedSubject ? (
        <>
          <SubjectPreviewPage
            subjectKey={selectedSubject}
            onBack={handleBackToHome}
            onLoginRequired={handleLoginRequired}
          />
          <Footer />
        </>
      ) : (
        <main>
          <HeroSection />
          <HowItWorks />
          <BrowseNotes />
          <UploadNotes />
          <LiveUploadFeed />
          <Leaderboard />
          <WebinarsSection />
          <CoursesSection />
          <SubjectsSection onSubjectClick={navigateToSubject} />
          <CommunitySection />
          <FeaturesSection />
        </main>
      )}

      {currentView === "home" && <Footer />}
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
      <GrowBot />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
