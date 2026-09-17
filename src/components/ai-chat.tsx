"use client";

import { FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";

type Reply = {
  answer: string;
  provider: string;
  warning?: string;
  sources: {
    title: string;
    slug: string;
    excerpt: string;
  }[];
  confirmation_required?: boolean;
  tool_name?: string;
  tool_arguments?: {
    plant_id?: string;
    content?: string;
  };
};

type ChatMessage =
  | {
      id: string;
      role: "user";
      content: string;
    }
  | {
      id: string;
      role: "assistant";
      reply: Reply;
    };

const suggestions = [
  "Tell me about my [plant name].",
  "What notes do I have about my [plant name]?",
  "Summarize the care history of my [plant name].",
  "Create a note for my [plant name]: I watered it today.",
  "My [plant name] has yellow leaves. What should I check?",
];

const MAX_MESSAGE_LENGTH = 4000;
const CONVERSATION_MAX_HEIGHT = 500;

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function MarkdownAnswer({ content }: { content: string }) {
  return (
    <div className="text-sm leading-7 text-stone-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 text-lg font-semibold text-stone-900">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-5 text-base font-semibold text-stone-900 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 font-semibold text-stone-900 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 last:mb-0">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1.5 pl-5 last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1.5 pl-5 last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-stone-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-stone-700">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-4 border-emerald-200 pl-4 italic text-stone-600">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-stone-100" />,
          code: ({ children, className }) => {
            const isBlockCode = className?.includes("language-");

            if (isBlockCode) {
              return (
                <pre className="my-3 overflow-x-auto rounded-xl bg-stone-900 p-4 text-xs leading-5 text-stone-100">
                  <code>{children}</code>
                </pre>
              );
            }

            return (
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-[0.9em] text-stone-800">
                {children}
              </code>
            );
          },
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function AssistantReply({
  reply,
  onConfirm,
  onCancel,
  confirming,
}: {
  reply: Reply;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirming?: boolean;
}) {
  const isConfirmationRequired =
    reply.confirmation_required &&
    reply.tool_name === "create_note" &&
    reply.tool_arguments?.content;

  return (
    <div className="rounded-2xl rounded-tl-md bg-white px-4 py-4 shadow-sm ring-1 ring-stone-200">
      <MarkdownAnswer content={reply.answer} />

      {isConfirmationRequired && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-900">
            Note to save
          </p>

          <p className="mt-1 rounded-lg bg-white/70 p-2 text-sm text-amber-950">
            {reply.tool_arguments?.content}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirming}
              className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {confirming ? "Saving..." : "Confirm and save"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={confirming}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {reply.warning && (
        <div className="mt-4 flex gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          <span aria-hidden="true">⚠️</span>
          <p>{reply.warning}</p>
        </div>
      )}

      {reply.sources.length > 0 && (
        <details className="mt-5 border-t border-stone-100 pt-4">
          <summary className="cursor-pointer text-xs font-semibold text-stone-500 transition hover:text-emerald-700">
            {reply.sources.length} guide source
            {reply.sources.length === 1 ? "" : "s"}
          </summary>

          <div className="mt-3 space-y-3">
            {reply.sources.map((source) => (
              <div key={source.slug}>
                <p className="text-xs font-semibold text-stone-700">
                  {source.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-stone-500">
                  {source.excerpt}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

export function AiChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] =
  useState<{
    reply: Reply;
    plantId: string;
    content: string;
  } | null>(null);

  const testPlantId =
    "c27adea8-9ae5-4d39-b367-541f93f22cc5";

  async function sendMessage(
    userMessage: string,
    confirmed = false,
  ) {
    const {
      data: { session },
    } = await createClient().auth.getSession();

    if (!session) {
      throw new Error("Please log in first.");
    }

    const aiServiceUrl =
      process.env.NEXT_PUBLIC_AI_SERVICE_URL;

    if (!aiServiceUrl) {
      throw new Error("The AI service URL is not configured.");
    }

    const response = await fetch(`${aiServiceUrl}/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        message: userMessage,
        plant_id: testPlantId,
        confirmed,
      }),
    });

  if (!response.ok) {
    throw new Error(
      "The plant expert could not respond right now.",
    );
  }

  return (await response.json()) as Reply;
}

  async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const trimmedMessage = message.trim();

  if (!trimmedMessage || loading) return;

  const userMessage: ChatMessage = {
    id: createMessageId(),
    role: "user",
    content: trimmedMessage,
  };

  setMessages((previousMessages) => [
    ...previousMessages,
    userMessage,
  ]);

  setMessage("");
  setLoading(true);
  setError(null);

  try {
    const reply = await sendMessage(trimmedMessage);

    const assistantMessage: ChatMessage = {
      id: createMessageId(),
      role: "assistant",
      reply,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      assistantMessage,
    ]);

    if (
    reply.confirmation_required &&
    reply.tool_name === "create_note" &&
    reply.tool_arguments?.plant_id &&
    reply.tool_arguments?.content
  ) {
    setPendingConfirmation({
      reply,
      plantId: reply.tool_arguments.plant_id,
      content: reply.tool_arguments.content,
    });
  } else {
    setPendingConfirmation(null);
  }
  } catch (cause) {
    setError(
      cause instanceof Error
        ? cause.message
        : "Unexpected error.",
    );
  } finally {
    setLoading(false);
  }
}

  function handleSuggestion(suggestion: string) {
    setMessage(suggestion);
  }

  const showEmptyState =
    messages.length === 0 && !loading && !error;

  async function confirmPendingNote() {
    if (!pendingConfirmation || loading) return;

    const { content, plantId } = pendingConfirmation;

    if (!content || !plantId) return;

    setLoading(true);
    setError(null);

    try {
      const reply = await sendMessage(
        `Save this note exactly: ${content}`,
        true,
      );

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        reply,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);

      setPendingConfirmation(null);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unexpected error.",
      );
    } finally {
      setLoading(false);
    }
  }

function cancelPendingNote() {
  if (loading) return;

  setPendingConfirmation(null);

  const cancellationReply: Reply = {
    answer: "The note was not saved.",
    provider: "none",
    sources: [],
  };

  setMessages((previousMessages) => [
    ...previousMessages,
    {
      id: createMessageId(),
      role: "assistant",
      reply: cancellationReply,
    },
  ]);
}

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-stone-100 px-5 py-4 sm:px-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
          🌿
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-stone-900">
              Plant Expert
            </h2>

            <span className="flex items-center gap-1.5 text-xs text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>

          <p className="text-sm text-stone-500">
            Your personal plant-care companion
          </p>
        </div>
      </header>

      {/* Conversation */}
      <div
        className="h-[500px] max-h-[500px] overflow-y-auto bg-stone-50/70 px-4 py-6 sm:px-6"
        style={{
          scrollbarGutter: "stable",
        }}
      >
        {showEmptyState && (
          <div className="flex min-h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-3xl">
              🌱
            </div>

            <h3 className="text-xl font-semibold text-stone-900">
              How can I help your plants?
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500">
              Ask about watering, lighting, soil, pests, or
              anything else your plants might need.
            </p>

            <div className="mt-6 flex max-w-lg flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="rounded-full border border-stone-200 bg-white px-3 py-2 text-left text-xs font-normal text-stone-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="space-y-5">
            {messages.map((chatMessage) => {
              if (chatMessage.role === "user") {
                return (
                  <div
                    key={chatMessage.id}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-emerald-700 px-4 py-3 text-sm leading-6 text-white shadow-sm">
                      {chatMessage.content}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={chatMessage.id}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm">
                    🌿
                  </div>

                  <div className="min-w-0 max-w-[90%]">
                    <p className="mb-1 text-xs font-semibold text-stone-500">
                      Plant Expert
                    </p>

                    <AssistantReply
                      reply={chatMessage.reply}
                      onConfirm={
                        pendingConfirmation?.reply === chatMessage.reply
                          ? confirmPendingNote
                          : undefined
                      }
                      onCancel={
                        pendingConfirmation?.reply === chatMessage.reply
                          ? cancelPendingNote
                          : undefined
                      }
                      confirming={loading}
                    />
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm">
                  🌿
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold text-stone-500">
                    Plant Expert
                  </p>

                  <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm ring-1 ring-stone-200">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800"
          >
            <p className="font-medium">Something went wrong</p>
            <p className="mt-1 text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-stone-100 bg-white p-4 sm:p-5">
        <form onSubmit={submit}>
          <div className="flex items-end gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-2 transition-within:border-emerald-400 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
            <textarea
              className="min-h-[44px] max-h-32 flex-1 resize-none overflow-y-auto rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200 disabled:cursor-not-allowed disabled:opacity-60"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();

                  if (!loading && message.trim()) {
                    event.currentTarget.form?.requestSubmit();
                  }
                }
              }}
              placeholder="Ask about your plants..."
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 p-0 text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              )}
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between px-1">
            <p className="text-[11px] text-stone-400">
              Plant Expert can make mistakes. Check important care
              advice.
            </p>

            <span className="hidden text-[11px] text-stone-400 sm:block">
              {message.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}