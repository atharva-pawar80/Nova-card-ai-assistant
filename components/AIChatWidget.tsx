
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm your NovaCart AI assistant. What are you shopping for today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();

    if (!message || isLoading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", content: message },
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("NovaCart chat error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't respond right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed right-4 top-1/2 z-[100] flex -translate-y-1/2 flex-col items-end gap-3 sm:right-6">

      {/* BIG CHAT WINDOW */}
      {isOpen && (
        <section className="mb-1 flex h-[min(700px,85vh)] w-[min(480px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl animate-in fade-in slide-in-from-right-3 duration-300">

          {/* HEADER */}
          <header className="flex shrink-0 items-center justify-between bg-neutral-900 px-5 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <BotIcon />
              </div>

              <div>
                <h2 className="text-lg font-semibold">NovaCart AI</h2>
                <p className="text-xs text-neutral-300">
                  Your personal shopping assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-lg px-3 py-1 text-2xl hover:bg-neutral-700"
            >
              ×
            </button>
          </header>

          {/* CHAT MESSAGES */}
          <div
            className="flex flex-1 flex-col gap-4 overflow-y-auto bg-neutral-50 p-5"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[95%] min-w-0 break-words rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "self-end rounded-br-sm bg-neutral-900 text-white"
                    : "self-start rounded-bl-sm border border-neutral-200 bg-white text-neutral-800"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="space-y-2 [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-bold [&_h1]:text-lg [&_h2]:text-base [&_h3]:font-semibold">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ children }) => (
                          <div className="my-3 overflow-x-auto rounded-lg">
                            <table className="w-full border-collapse text-left text-xs">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="border border-neutral-300 bg-neutral-100 p-3 font-semibold">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-neutral-300 p-3">
                            {children}
                          </td>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            ))}

            {isLoading && (
              <div className="self-start rounded-xl border bg-white px-4 py-3 text-sm text-neutral-500">
                NovaCart AI is thinking...
              </div>
            )}
          </div>

          {/* MESSAGE INPUT */}
          <form
            onSubmit={sendMessage}
            className="flex shrink-0 gap-2 border-t border-neutral-200 bg-white p-4"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about your shopping..."
              aria-label="Your message"
              maxLength={2000}
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-900"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </section>
      )}

      {/* ANIMATED GREETING */}
      {!isOpen && showGreeting && (
        <div className="relative animate-greeting">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 pr-8 text-left shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            aria-label="Open NovaCart AI greeting"
          >
            <span className="block text-sm font-semibold text-neutral-900">
              Hi there! 👋
            </span>

            <span className="block text-xs text-neutral-500">
              Need help shopping?
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowGreeting(false)}
            aria-label="Dismiss greeting"
            className="absolute right-1.5 top-1.5 text-sm text-neutral-400 hover:text-neutral-900"
          >
            ×
          </button>

          <span className="absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 border-b border-r border-neutral-200 bg-white" />
        </div>
      )}

      {/* FLOATING BOT BUTTON */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((previous) => !previous);
          setShowGreeting(false);
        }}
        aria-label={
          isOpen ? "Close shopping assistant" : "Open shopping assistant"
        }
        className="group relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-neutral-900 text-white shadow-xl transition duration-300 hover:scale-110 hover:bg-neutral-800 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-neutral-500/30 animate-bot-pulse" />

        <span className="relative transition-transform duration-300 group-hover:rotate-6">
          <BotIcon />
        </span>

        {!isOpen && (
          <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
        )}
      </button>
    </div>
  );
}

function BotIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v3" />
      <circle cx="12" cy="2.5" r="1" fill="currentColor" />
      <rect x="4" y="6" width="16" height="13" rx="4" />
      <path d="M8 19v2M16 19v2M4 12H2M22 12h-2" />
      <circle cx="9" cy="11" r="1.3" fill="currentColor" />
      <circle cx="15" cy="11" r="1.3" fill="currentColor" />
      <path d="M9 15h6" />
    </svg>
  );
}
