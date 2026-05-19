import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Coins,
  Fingerprint,
  LogIn,
  LogOut,
  Menu,
  Settings,
  Sprout,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";
import { useSound } from "../hooks/useSound";

const navLinks = [
  { label: "Home", section: "home" },
  { label: "Marketplace", section: "browse" },
  { label: "Subjects", section: "subjects" },
  { label: "Webinars", section: "webinars" },
  { label: "Courses", section: "courses" },
  { label: "Community", section: "community" },
];

function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login, register } = useAppContext();
  const { playClick, playError } = useSound();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      playClick();
      toast.success(`Welcome back, ${username}!`);
      onClose();
    } else {
      playError();
      toast.error("Invalid credentials. Try admin/admin123 or register.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      playError();
      toast.error("Please fill in all fields.");
      return;
    }
    if (register(username, email, password)) {
      playClick();
      toast.success(
        `Account created! Welcome, ${username}! You have 100 credits.`,
      );
      onClose();
    } else {
      playError();
      toast.error("Username already taken.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border border-border max-w-md"
        data-ocid="auth.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl neon-text-cyan">
            Join G.R.O.W
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            Access the global knowledge ecosystem
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "login" | "register")}
        >
          <TabsList className="w-full bg-muted/40 border border-border">
            <TabsTrigger
              value="login"
              className="flex-1 font-mono text-xs"
              data-ocid="auth.login.tab"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="flex-1 font-mono text-xs"
              data-ocid="auth.register.tab"
            >
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground">
                  Username
                </Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  data-ocid="auth.username.input"
                  className="bg-muted/40 border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground">
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  data-ocid="auth.password.input"
                  className="bg-muted/40 border-border"
                />
              </div>
              <Button
                type="submit"
                className="w-full glow-cyan font-mono"
                data-ocid="auth.login.submit_button"
              >
                Login
              </Button>
              <p className="text-center text-xs text-muted-foreground font-mono">
                Admin: username=admin, password=admin123
              </p>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground">
                  Username
                </Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                  data-ocid="auth.reg.username.input"
                  className="bg-muted/40 border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground">
                  Email
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  data-ocid="auth.reg.email.input"
                  className="bg-muted/40 border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-muted-foreground">
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  data-ocid="auth.reg.password.input"
                  className="bg-muted/40 border-border"
                />
              </div>
              <Button
                type="submit"
                className="w-full glow-cyan font-mono"
                data-ocid="auth.register.submit_button"
              >
                Create Account — Get 100 Credits Free
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface NavbarProps {
  onAdminClick: () => void;
  authOpen: boolean;
  onAuthClose: () => void;
  onAuthOpen: () => void;
  onSectionNav: (section: string) => void;
}

export default function Navbar({
  onAdminClick,
  authOpen,
  onAuthClose,
  onAuthOpen,
  onSectionNav,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { playHover, playClick, playAdminAction } = useSound();
  const {
    user,
    isAdmin,
    logout,
    loginWithII,
    isIILoggingIn,
    isIIInitializing,
  } = useAppContext();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (e: React.MouseEvent, section: string) => {
    e.preventDefault();
    playClick();
    onSectionNav(section);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-primary/20"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between h-16 px-4">
        <button
          type="button"
          onClick={(e) => handleNavClick(e, "home")}
          className="flex items-center gap-2 font-display font-bold text-xl"
          data-ocid="nav.home.link"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground glow-cyan">
            <Sprout size={16} />
          </span>
          <span className="tracking-tight neon-text-cyan">G.R.O.W</span>
        </button>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.section}>
              <button
                type="button"
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                onMouseEnter={() => playHover()}
                onClick={(e) => handleNavClick(e, link.section)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold">
              <Coins size={12} />
              {user.credits} GROW
            </div>
          )}
          {user && (
            <div className="hidden md:flex items-center gap-1.5">
              {user.isII && (
                <Badge
                  variant="outline"
                  className="border-secondary/40 text-secondary font-mono text-xs px-1.5 py-0"
                >
                  <Fingerprint size={9} className="mr-0.5" /> II
                </Badge>
              )}
              <span className="font-mono text-xs text-muted-foreground truncate max-w-[90px]">
                {user.username}
              </span>
            </div>
          )}
          {isAdmin && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                playAdminAction();
                onAdminClick();
              }}
              data-ocid="nav.admin.open_modal_button"
              className="hidden md:flex items-center gap-1.5 border-secondary/50 text-secondary hover:border-secondary"
            >
              <Settings size={14} /> Admin
            </Button>
          )}
          {user ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                playClick();
                logout();
                toast.success("Logged out.");
              }}
              data-ocid="nav.logout.button"
              className="hidden md:flex items-center gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <LogOut size={14} /> Logout
            </Button>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  playClick();
                  loginWithII();
                }}
                disabled={isIILoggingIn || isIIInitializing}
                data-ocid="nav.ii_login.button"
                className="items-center gap-1.5 border-secondary/50 text-secondary hover:border-secondary hover:text-secondary"
              >
                {isIILoggingIn ? (
                  <>
                    <div className="w-3 h-3 border border-secondary/40 border-t-secondary rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Fingerprint size={14} /> Internet Identity
                  </>
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  playClick();
                  onAuthOpen();
                }}
                data-ocid="nav.login.button"
                className="items-center gap-1.5 glow-cyan"
              >
                <LogIn size={14} /> Login / Register
              </Button>
            </div>
          )}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-xl border-b border-primary/20 px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <li key={link.section}>
                <button
                  type="button"
                  data-ocid={`nav.${link.label.toLowerCase()}.link`}
                  onClick={(e) => {
                    handleNavClick(e, link.section);
                    setMobileOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md"
                >
                  {link.label}
                </button>
              </li>
            ))}
            {user ? (
              <>
                <li className="px-3 py-2">
                  <div className="flex items-center gap-1.5 text-accent font-mono text-xs font-bold">
                    <Coins size={12} /> {user.credits} GROW Credits
                  </div>
                </li>
                {isAdmin && (
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        playAdminAction();
                        onAdminClick();
                      }}
                      data-ocid="nav.admin.open_modal_button"
                      className="w-full text-left px-3 py-2 text-sm font-medium text-secondary hover:bg-muted rounded-md flex items-center gap-2"
                    >
                      <Settings size={14} /> Admin Panel
                    </button>
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    data-ocid="nav.logout.button"
                    className="w-full text-left px-3 py-2 text-sm font-medium text-destructive hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      loginWithII();
                      setMobileOpen(false);
                    }}
                    disabled={isIILoggingIn || isIIInitializing}
                    data-ocid="nav.ii_login.button"
                    className="w-full text-left px-3 py-2 text-sm font-medium text-secondary hover:bg-muted rounded-md flex items-center gap-2 disabled:opacity-50"
                  >
                    <Fingerprint size={14} />
                    {isIILoggingIn ? "Connecting..." : "Internet Identity"}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onAuthOpen();
                      setMobileOpen(false);
                    }}
                    data-ocid="nav.login.button"
                    className="w-full text-left px-3 py-2 text-sm font-medium text-primary hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <LogIn size={14} /> Login / Register
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
      <AuthModal open={authOpen} onClose={onAuthClose} />
    </header>
  );
}
