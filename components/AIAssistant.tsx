"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircleIcon, XIcon, SendIcon, SparklesIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
    role: "user" | "assistant";
    content: string;
};

const INITIAL_MESSAGES: Message[] = [
    { role: "assistant", content: "Hi there! 👋 My name is Jedy. How can I assist you today?" },
];

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const userMessage: Message = { role: "user", content: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmed }),
            });

            const data = await res.json();
            const reply = data?.response ?? "Sorry, something went wrong. Please try again.";

            setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, something went wrong. Please try again." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-[4.5rem] right-4 left-4 sm:left-auto sm:right-6 sm:w-[380px] sm:bottom-[5.5rem] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[520px]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground rounded-t-2xl shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                <SparklesIcon className="size-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold leading-none">Jedy</p>
                                <p className="text-xs text-primary-foreground/70 mt-0.5">AI Assistant</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-full hover:bg-primary-foreground/20 transition-colors cursor-pointer"
                            aria-label="Close chat"
                        >
                            <XIcon className="size-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3 bg-background">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex",
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed",
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                                            : "bg-secondary text-secondary-foreground rounded-2xl rounded-bl-sm border border-border/50"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-sm border border-border/50 px-4 py-3 flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                                    <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                                    <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="shrink-0 border-t border-border p-3 bg-card flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            disabled={isLoading}
                            className="flex-1 text-sm bg-background border border-input rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            className="shrink-0 size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Send message"
                        >
                            {isLoading ? (
                                <Loader2Icon className="size-4 animate-spin" />
                            ) : (
                                <SendIcon className="size-4" />
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="size-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? (
                    <XIcon className="size-6" />
                ) : (
                    <MessageCircleIcon className="size-6" />
                )}
            </button>
        </div>
    );
}
