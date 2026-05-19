import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

const SUGGESTIONS = [
  "How to upload notes?",
  "How do credits work?",
  "How to download?",
  "How do webinars work?",
  "Tell me about subjects",
  "How to earn more credits?",
];

const CHIP_IDS = [
  "growbot.chip.1",
  "growbot.chip.2",
  "growbot.chip.3",
  "growbot.chip.4",
  "growbot.chip.5",
  "growbot.chip.6",
];

function getResponse(input: string): string {
  const q = input.toLowerCase();
  if (/hello|hi|hey|greet/.test(q)) {
    return "Hey there, scholar! \u{1F44B} Welcome to G.R.O.W \u2014 the Global Resource of Online Wisdom. How can I guide you today?";
  }
  if (/upload|share note|submit note/.test(q)) {
    return "\u{1F4E4} To upload notes, scroll to the Upload Notes section. Fill in the title, subject, and content, then hit Upload. You'll instantly earn GROW Credits based on the quality rating (default 3 stars = 30 credits). The note appears live in the feed right away!";
  }
  if (/credit|earn|point|reward/.test(q)) {
    return "\u{1F48E} The GROW Credit system rewards you for sharing knowledge! Credits = 10 \u00D7 quality stars. A 3-star note earns 30 credits, a 5-star note earns 50 credits. Admins can adjust quality ratings after upload, updating your balance retroactively. Use credits to download premium notes!";
  }
  if (/download|get note|save note/.test(q)) {
    return "\u{1F4E5} To download a note, click the Download button on any note card. Credits are automatically deducted and the note saves as a .txt file to your device. Make sure you have enough credits before downloading!";
  }
  if (/webinar|meet|join|live session/.test(q)) {
    return "\u{1F3A5} G.R.O.W hosts live webinars with expert educators! Click the Join button on any webinar card to instantly open Google Meet in a new tab. No setup required \u2014 just click and learn!";
  }
  if (/subject|preview|topic|mathematics|cybersecurity|physics/.test(q)) {
    return "\u{1F4DA} The Subjects section features curated subject cards (Mathematics, Cybersecurity, Physics, and more). Click any subject card to open a preview page with sample notes and study materials. Login to access the full notes library for that subject!";
  }
  if (/leaderboard|top|rank|best|winner/.test(q)) {
    return "\u{1F3C6} The Leaderboard showcases the Top 10 credit earners on the platform. Upload high-quality notes to climb the ranks and earn special badges. Check the Leaderboard section to see where you stand!";
  }
  if (/admin|panel|manage|admin123/.test(q)) {
    return "\u{1F527} The Admin Panel lets authorized users manage note cards \u2014 add, edit, or remove them without touching code. Access it from the Navbar using login: admin / password: admin123.";
  }
  if (/help|what can you do|feature|option|guide/.test(q)) {
    return "\u{1F916} I can help you with:\n\u2022 Uploading notes & earning credits\n\u2022 Understanding the credit system\n\u2022 Downloading study materials\n\u2022 Joining webinars on Google Meet\n\u2022 Exploring subject preview pages\n\u2022 The leaderboard & rankings\n\u2022 Using the Admin Panel\n\nJust ask or tap a suggestion below!";
  }
  return "\u{1F310} I can help with: uploading notes, credits, downloading, webinars, subjects, and more! Try one of the suggestions below or ask me anything about G.R.O.W.";
}

function playBotSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 440;
    osc.type = "sine";
    gain.gain.value = 0.05;
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
    osc.onended = () => ctx.close();
  } catch (_) {
    // ignore
  }
}

export default function GrowBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const idRef = useRef(0);
  const welcomedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const nextId = useCallback(() => {
    idRef.current += 1;
    return idRef.current;
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Show welcome message once when first opened
  useEffect(() => {
    if (open && !welcomedRef.current) {
      welcomedRef.current = true;
      const wid = nextId();
      setMessages([
        {
          id: wid,
          role: "bot",
          text: "Hi! I'm your G.R.O.W Assistant. How can I help you navigate the platform today? \u{1F680}",
        },
      ]);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, nextId]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      setMessages((prev) => [...prev, { id: nextId(), role: "user", text }]);
      setInput("");
      setTyping(true);
      setTimeout(scrollToBottom, 50);

      setTimeout(() => {
        const response = getResponse(text);
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "bot", text: response },
        ]);
        setTyping(false);
        playBotSound();
        setTimeout(scrollToBottom, 50);
      }, 800);
    },
    [nextId, scrollToBottom],
  );

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage(input);
  };

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        type="button"
        data-ocid="growbot.toggle_button"
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg"
        style={{
          background: "linear-gradient(135deg, #0a0a2e 60%, #1a0a3e 100%)",
          border: "2px solid #00ffff",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 18px 4px rgba(0,255,255,0.45), 0 0 40px 8px rgba(168,85,247,0.2)",
            "0 0 28px 8px rgba(0,255,255,0.75), 0 0 55px 14px rgba(168,85,247,0.4)",
            "0 0 18px 4px rgba(0,255,255,0.45), 0 0 40px 8px rgba(168,85,247,0.2)",
          ],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2.4,
          ease: "easeInOut",
        }}
        aria-label="Open G.R.O.W Assistant"
      >
        &#x1F916;
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            data-ocid="growbot.panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col"
            style={{
              width: 320,
              height: 420,
              background: "#0a0a1a",
              border: "1.5px solid #00ffff",
              borderRadius: 14,
              boxShadow:
                "0 0 32px 4px rgba(0,255,255,0.25), 0 0 80px 10px rgba(168,85,247,0.15)",
              fontFamily: "'JetBrains Mono', monospace",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(90deg, #0d0d2b 0%, #120820 100%)",
                borderBottom: "1px solid rgba(0,255,255,0.33)",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>&#x1F916;</span>
                <span
                  style={{
                    color: "#00ffff",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.05em",
                  }}
                >
                  G.R.O.W Assistant
                </span>
                <span
                  style={{
                    background: "#a855f7",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: 4,
                    letterSpacing: "0.1em",
                  }}
                >
                  AI GUIDE
                </span>
              </div>
              <button
                type="button"
                data-ocid="growbot.close_button"
                onClick={() => setOpen(false)}
                style={{
                  color: "#00ffff",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "12px 12px 4px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0,255,255,0.2) transparent",
              }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "82%",
                  }}
                >
                  <div
                    style={{
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)"
                          : "#0f1128",
                      border:
                        msg.role === "bot"
                          ? "1px solid rgba(0,255,255,0.27)"
                          : "none",
                      color: "#e2e8ff",
                      borderRadius:
                        msg.role === "user"
                          ? "12px 12px 2px 12px"
                          : "12px 12px 12px 2px",
                      padding: "8px 12px",
                      fontSize: 12,
                      lineHeight: 1.6,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ alignSelf: "flex-start" }}
                >
                  <div
                    style={{
                      background: "#0f1128",
                      border: "1px solid rgba(0,255,255,0.27)",
                      borderRadius: "12px 12px 12px 2px",
                      padding: "10px 14px",
                      display: "flex",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#00ffff",
                          display: "block",
                        }}
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 0.9,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Suggestion chips */}
              {!typing && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 5,
                    marginTop: 2,
                  }}
                >
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      type="button"
                      key={s}
                      data-ocid={CHIP_IDS[i]}
                      onClick={() => sendMessage(s)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        background: "#0d0d2b",
                        border: "1px solid rgba(0,255,255,0.33)",
                        color: "#00ffff",
                        borderRadius: 20,
                        padding: "4px 10px",
                        fontSize: 10,
                        cursor: "pointer",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input row */}
            <div
              style={{
                borderTop: "1px solid rgba(0,255,255,0.2)",
                padding: "8px 10px",
                display: "flex",
                gap: 8,
                background: "#07071a",
              }}
            >
              <input
                ref={inputRef}
                data-ocid="growbot.input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything..."
                style={{
                  flex: 1,
                  background: "#0f1128",
                  border: "1px solid rgba(0,255,255,0.27)",
                  color: "#e2e8ff",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: "none",
                }}
              />
              <motion.button
                type="button"
                data-ocid="growbot.submit_button"
                onClick={() => sendMessage(input)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  background:
                    "linear-gradient(135deg, #00c8c8 0%, #00ffff 100%)",
                  border: "none",
                  borderRadius: 8,
                  color: "#0a0a1a",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                  padding: "6px 12px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                aria-label="Send"
              >
                &#x27A4;
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
