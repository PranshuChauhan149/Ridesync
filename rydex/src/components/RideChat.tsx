"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Sparkles, Send } from "lucide-react";

type Message = {
  _id?: string;
  bookingId: string;
  sender: "user" | "driver";
  text: string;
  createdAt?: string;
};

const RideChat = ({
  currentRole,
  bookingId,
  userName,
  driverName,
}: any) => {
  const otherName = currentRole === "user" ? driverName : userName;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showAi, setShowAi] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  const { userData } = useSelector(
    (state: RootState) => state.user
  );

 const sendMessage = async () => {
  console.log({
    bookingId,
    sender: currentRole,
    text,
  });

  if (!text.trim()) return;

  try {
    await axios.post("/api/chat/send", {
      bookingId,
      sender: currentRole,
      text,
    });

    // setMessages([...messages,data]);
  } catch (error: any) {
    console.log(error?.response?.data);
  }
};

  const getAllMsgs = async () => {
    try {
      const { data } = await axios.post("/api/chat/get-all", {
        bookingId,
      });

      setMessages(data.messages || []);

      if (data.messages?.length) {
        setLastMessage(
          data.messages[data.messages.length - 1]?.text || ""
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [lastMessage, setLastMessage] = useState("");

  const getAISuggestions = async () => {
    try {
      setAiLoading(true);

      const { data } = await axios.post(
        "/api/chat/ai-suggestions",
        {
          role: currentRole,
          lastMessage,
        }
      );

      if (Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      }

      setAiLoading(false);
    } catch (error) {
      console.log(error);
      setAiLoading(false);
    }
  };

  useEffect(() => {
    getAllMsgs();
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-2xl overflow-hidden border border-zinc-100">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-zinc-100">
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white text-xs font-bold">
            {otherName?.charAt(0)?.toUpperCase()}
          </div>

          <span
            style={{
              backgroundColor: "#22c55e",
              width: "10px",
              height: "10px",
              position: "absolute",
              bottom: "-2px",
              right: "-2px",
              borderRadius: "9999px",
              border: "2px solid white",
              zIndex: 20,
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-zinc-900">
            {otherName}
          </p>

          <p
            style={{ color: "#10b981" }}
            className="text-xs mt-1"
          >
            Active Now
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-zinc-50"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
            <div className="w-16 h-16 rounded-2xl bg-zinc-200 flex items-center justify-center">
              💬
            </div>

            <p className="text-sm font-semibold text-zinc-700">
              No messages yet
            </p>

            <p className="text-xs text-zinc-500 text-center">
              Send a message to start the conversation.
            </p>
          </div>
        )}

        {messages.map((m, i) => {
          const isMine = m.sender === currentRole;

          return (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                y: 8,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.18,
              }}
              className={`flex ${
                isMine
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[72%] px-3.5 py-2.5 text-sm rounded-2xl shadow-sm ${
                  isMine
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-white border border-zinc-200 text-zinc-900 rounded-bl-sm"
                }`}
              >
                {m.text}

                <div
                  className={`mt-1 text-[10px] ${
                    isMine
                      ? "text-zinc-300"
                      : "text-zinc-500"
                  }`}
                >
                  {m.createdAt &&
                    new Date(
                      m.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Suggestions */}
    {/* AI Suggestions */}


<AnimatePresence>
  {showAi && messages.length > 0 && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        flexShrink: 0,
        borderTop: "1px solid #e4e4e7",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Sparkles
              size={14}
              style={{ color: "#8b5cf6" }}
            />

            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#71717a",
              }}
            >
              AI Suggestions
            </span>
          </div>

          <button
            type="button"
            onClick={getAISuggestions}
            disabled={aiLoading}
            style={{
              border: "none",
              background: "transparent",
              color: "#7c3aed",
              fontSize: "12px",
              fontWeight: 600,
              cursor: aiLoading ? "not-allowed" : "pointer",
              opacity: aiLoading ? 0.5 : 1,
            }}
          >
            {aiLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {suggestions.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxHeight: "220px",
              overflowY: "auto",
              paddingRight: "4px",
            }}
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setText(suggestion)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  border: "1px solid #ddd6fe",
                  background:
                    "linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%)",
                  color: "#6d28d9",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow:
                    "0 2px 8px rgba(139,92,246,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "#ede9fe";
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 14px rgba(139,92,246,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%)";
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(139,92,246,0.08)";
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "#a1a1aa",
              fontSize: "12px",
              padding: "12px 0",
            }}
          >
            Click refresh to generate suggestions.
          </p>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>
{/* Input */}
<div className="flex-shrink-0 p-3 border-t border-zinc-100 bg-black">
  <div className="flex items-center gap-2">
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && text.trim()) {
          sendMessage();
        }
      }}
      placeholder="Type a message..."
      className="flex-1 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-400 text-black"
    />

    <button
      type="button"
      onClick={sendMessage}
      disabled={!text.trim()}
      className="h-11 w-11 rounded-xl bg-black text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Send size={18} />
    </button>
  </div>
</div>
    </div>
  );
};

export default RideChat;