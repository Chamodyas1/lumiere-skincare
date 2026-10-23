import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  LoaderCircle,
  Plus,
  History,
  Trash2,
  Menu,
  PanelLeftClose,
  RotateCcw,
  Flower2
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/ai/chat';
const STORAGE_KEY = 'lumi_ai_conversations';

const QUICK_PROMPTS = [
  {
    title: 'Skincare Routine',
    prompt: 'Create a simple morning and evening skincare routine for my skin.'
  },
  {
    title: 'Acne & Dark Marks',
    prompt: 'How can I safely reduce acne marks and dark spots?'
  },
  {
    title: 'Ingredients Guide',
    prompt: 'Explain the benefits of vitamin C, niacinamide, and azelaic acid.'
  },
  {
    title: 'Skin Type',
    prompt: 'Help me understand my skin type and choose suitable skincare.'
  }
];

const createMessage = (role, text) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  role,
  text,
  timestamp: Date.now()
});

const createConversation = () => {
  const now = Date.now();

  return {
    id: `${now}-${Math.random().toString(36).slice(2, 9)}`,
    title: 'New Conversation',
    createdAt: now,
    updatedAt: now,
    messages: [
      createMessage(
        'model',
        "Hello! I'm Lumi, your AI Skincare Assistant. 🌸\n\nYou can speak to me in Sinhala, English, Tamil, or another language. I'll do my best to reply in the language you use.\n\nWhat would you like to know about skincare?"
      )
    ]
  };
};

const getSavedConversations = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (conversation) =>
        conversation &&
        typeof conversation.id === 'string' &&
        Array.isArray(conversation.messages)
    );
  } catch (error) {
    console.error('Unable to load chat history:', error);
    return [];
  }
};

// Remove Markdown code fences without removing the actual code inside them.
const cleanAIResponse = (text) => {
  if (typeof text !== 'string') return '';

  return text
    .replace(/^\s*```[a-zA-Z0-9_-]*[ \t]*\r?\n?/gm, '')
    .replace(/^\s*```[ \t]*$/gm, '')
    .trim();
};

const LumiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [storageWarning, setStorageWarning] = useState('');
const [conversations, setConversations] = useState(getSavedConversations);
const [activeId, setActiveId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const requestIdRef = useRef(0);
  
useEffect(() => {
  if (isOpen) {
    const freshConversation = createConversation();

    setConversations((previous) => [
      freshConversation,
      ...previous
    ]);

    setActiveId(freshConversation.id);
    setInput('');
    setError('');
    setSidebarOpen(false);
  }
}, [isOpen]);


  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ||
    null;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      setStorageWarning('');
    } catch (error) {
      console.error('Unable to save chat history:', error);
      setStorageWarning(
        'Chat history could not be saved. Your browser storage may be full.'
      );
    }
  }, [conversations]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [activeConversation?.messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen && !sidebarOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen, sidebarOpen, activeId]);

  const updateConversation = (conversationId, updater) => {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === conversationId
          ? updater(conversation)
          : conversation
      )
    );
  };

  const startNewChat = () => {
    if (loading) return;

    const conversation = createConversation();

    setConversations((previous) => [conversation, ...previous]);
    setActiveId(conversation.id);
    setInput('');
    setError('');
    setSidebarOpen(false);
  };

  const openConversation = (conversationId) => {
    if (loading) return;

    setActiveId(conversationId);
    setInput('');
    setError('');
    setSidebarOpen(false);
  };

  const deleteConversation = (event, conversationId) => {
    event.stopPropagation();

    if (loading && conversationId === activeId) return;

    const remaining = conversations.filter(
      (conversation) => conversation.id !== conversationId
    );

    if (conversationId === activeId) {
      if (remaining.length > 0) {
        setConversations(remaining);
        setActiveId(remaining[0].id);
      } else {
        const fresh = createConversation();
        setConversations([fresh]);
        setActiveId(fresh.id);
      }
    } else {
      setConversations(remaining);
    }
  };

  const clearAllHistory = () => {
    if (loading) return;

    const confirmed = window.confirm(
      'Delete all saved conversations? This action cannot be undone.'
    );

    if (!confirmed) return;

    const fresh = createConversation();

    setConversations([fresh]);
    setActiveId(fresh.id);
    setInput('');
    setError('');
    setSidebarOpen(false);
  };

  const sendMessage = async (event, providedText) => {
    if (event) event.preventDefault();

    const text = (providedText ?? input).trim();

    if (!text || loading) return;

    let conversation = activeConversation;

    if (!conversation) {
      conversation = createConversation();
      setConversations([conversation]);
      setActiveId(conversation.id);
    }

    const conversationId = conversation.id;
    const currentRequestId = ++requestIdRef.current;

    const userMessage = createMessage('user', text);

    const previousHistory = conversation.messages
      .filter(
        (message) =>
          message.role === 'user' || message.role === 'model'
      )
      .slice(-12)
      .map((message) => ({
        role: message.role,
        text: message.text
      }));

    const updatedMessages = [
      ...conversation.messages,
      userMessage
    ];

    const newTitle =
      conversation.title === 'New Conversation'
        ? text.length > 38
          ? `${text.slice(0, 38)}...`
          : text
        : conversation.title;

    updateConversation(conversationId, (current) => ({
      ...current,
      title: newTitle,
      updatedAt: Date.now(),
      messages: updatedMessages
    }));

    setInput('');
    setError('');
    setLoading(true);
    setSidebarOpen(false);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: previousHistory
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.reply) {
        throw new Error(
          data.message || 'Unable to get a response from Lumi.'
        );
      }

      if (currentRequestId !== requestIdRef.current) return;

      const assistantMessage = createMessage(
        'model',
        data.reply
      );

      updateConversation(conversationId, (current) => ({
        ...current,
        updatedAt: Date.now(),
        messages: [...current.messages, assistantMessage]
      }));
    } catch (requestError) {
      console.error('Lumi AI Error:', requestError);

      if (currentRequestId !== requestIdRef.current) return;

      setError(
        'Unable to connect to Lumi right now. Please check your connection and try again.'
      );
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';

    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-sans">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Lumi AI"
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#1e2b2b] text-white shadow-2xl transition duration-300 hover:scale-110 hover:bg-[#b48b6a]"
        >
          <MessageCircle size={29} />

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#b48b6a] text-[10px] font-bold text-white">
            AI
          </span>
        </button>
      )}

      {isOpen && (
        <div className="flex h-[min(680px,85dvh)] w-[min(760px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-[#eadfd6] bg-[#fcf8f5] shadow-2xl">
          {sidebarOpen && (
            <aside className="flex w-[min(250px,65%)] shrink-0 flex-col border-r border-[#eadfd6] bg-[#fffdfb]">
              <div className="flex items-center justify-between border-b border-[#eadfd6] p-4">
                <div className="flex items-center gap-2 font-semibold text-[#1e2b2b]">
                  <History size={18} />
                  Chat History
                </div>

                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close history"
                  className="rounded-lg p-2 text-[#1e2b2b] hover:bg-[#fcf8f5]"
                >
                  <PanelLeftClose size={19} />
                </button>
              </div>

              <div className="p-3">
                <button
                  type="button"
                  onClick={startNewChat}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e2b2b] px-3 py-3 text-sm font-medium text-white transition hover:bg-[#b48b6a] disabled:opacity-50"
                >
                  <Plus size={18} />
                  New Chat
                </button>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
                {sortedConversations.map((conversation) => (
                  <button
                    type="button"
                    key={conversation.id}
                    onClick={() => openConversation(conversation.id)}
                    disabled={loading}
                    className={`group flex w-full items-start gap-2 rounded-xl p-3 text-left transition ${
                      conversation.id === activeId
                        ? 'bg-[#f4e9e0]'
                        : 'hover:bg-[#fcf8f5]'
                    }`}
                  >
                    <MessageCircle
                      size={17}
                      className="mt-0.5 shrink-0 text-[#b48b6a]"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-[#1e2b2b]">
                        {conversation.title}
                      </span>

                      <span className="mt-1 block text-xs text-[#8d7e73]">
                        {formatDate(conversation.updatedAt)}
                      </span>
                    </span>

                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Delete conversation"
                      onClick={(event) =>
                        deleteConversation(event, conversation.id)
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === 'Enter' ||
                          event.key === ' '
                        ) {
                          event.preventDefault();
                          deleteConversation(event, conversation.id);
                        }
                      }}
                      className="rounded-md p-1 text-[#9c8c80] opacity-100 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </span>
                  </button>
                ))}

                {sortedConversations.length === 0 && (
                  <p className="px-3 py-5 text-center text-sm text-[#8d7e73]">
                    No saved conversations yet.
                  </p>
                )}
              </div>

              <div className="border-t border-[#eadfd6] p-3">
                <button
                  type="button"
                  onClick={clearAllHistory}
                  disabled={loading || conversations.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-[#8d7e73] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                >
                  <Trash2 size={15} />
                  Clear All History
                </button>

                <p className="mt-2 text-center text-[10px] text-[#9c8c80]">
                  History is saved in this browser.
                </p>
              </div>
            </aside>
          )}

          <section className="flex min-w-0 flex-1 flex-col">
            <header className="relative flex items-center justify-between overflow-hidden bg-[#1e2b2b] p-4 text-white">
              <div className="pointer-events-none absolute -right-5 -top-8 h-28 w-28 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-1 -top-2 h-20 w-20 rounded-full border border-white/10" />

              <div className="relative flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label="Toggle chat history"
                  className="shrink-0 rounded-lg p-2 transition hover:bg-white/10"
                >
                  {sidebarOpen ? (
                    <PanelLeftClose size={21} />
                  ) : (
                    <Menu size={21} />
                  )}
                </button>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#b48b6a] shadow-inner">
                  <Sparkles size={22} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold tracking-wide">
                    Lumi AI
                  </h3>
                  <p className="truncate text-xs text-[#e5d3c4]">
                    Your Personal Skincare Assistant
                  </p>
                </div>
              </div>

              <div className="relative flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={startNewChat}
                  disabled={loading}
                  aria-label="Start new chat"
                  title="New Chat"
                  className="rounded-lg p-2 transition hover:bg-white/10 disabled:opacity-50"
                >
                  <Plus size={21} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chatbot"
                  className="rounded-lg p-2 transition hover:bg-white/10"
                >
                  <X size={22} />
                </button>
              </div>
            </header>

            <div className="border-b border-[#eadfd6] bg-[#fffdfb]/95 px-4 py-2">
              <p className="flex items-center justify-center gap-2 text-center text-xs text-[#74675e]">
                <Flower2 size={14} className="text-[#b48b6a]" />
                Chat in your preferred language
                <Sparkles size={13} className="text-[#b48b6a]" />
              </p>
            </div>

            <div
              className="flex-1 space-y-4 overflow-y-auto bg-cover bg-center p-4"
              style={{
                backgroundColor: '#fcf8f5',
                backgroundImage:
                  "linear-gradient(rgba(252,248,245,0.35), rgba(252,248,245,0.35)), url('https://images.unsplash.com/photo-1518842013791-b874be246c34?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {(activeConversation?.messages || []).map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${
                    message.role === 'user'
                      ? 'flex-row-reverse'
                      : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${
                      message.role === 'user'
                        ? 'bg-[#d9a9b4] text-[#382b2d]'
                        : 'bg-[#1e2b2b] text-white'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User size={16} />
                    ) : (
                      <Bot size={17} />
                    )}
                  </div>

                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-md transition-all duration-300 ${
                      message.role === 'user'
                        ? 'whitespace-pre-wrap break-words rounded-tr-sm border border-[#e8b6c5] bg-[#f3c7d3] text-[#492c36]'
                        : 'min-w-0 rounded-tl-sm border border-[#ead8d0] bg-[#fffaf6]/95 text-[#382d2a]'
                    }`}
                  >
                    {message.role === 'user' ? (
                      message.text
                    ) : (
                      <div className="prose prose-sm max-w-none break-words prose-headings:mb-2 prose-headings:mt-3 prose-headings:font-semibold prose-headings:text-[#1e2b2b] prose-p:my-2 prose-p:leading-6 prose-strong:text-[#1e2b2b] prose-a:text-[#b48b6a] prose-li:my-1 prose-ul:my-2 prose-ol:my-2">
                        <ReactMarkdown
                          components={{
                            code({ children, className, ...props }) {
                              return (
                                <code
                                  className="rounded bg-[#f8e9ed] px-1 py-0.5 text-[#8c5265]"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                            h1({ children }) {
                              return (
                                <h1 className="text-lg font-bold text-[#1e2b2b]">
                                  {children}
                                </h1>
                              );
                            },
                            h2({ children }) {
                              return (
                                <h2 className="text-base font-bold text-[#1e2b2b]">
                                  {children}
                                </h2>
                              );
                            },
                            h3({ children }) {
                              return (
                                <h3 className="text-sm font-bold text-[#b48b6a]">
                                  {children}
                                </h3>
                              );
                            }
                          }}
                        >
                          {cleanAIResponse(message.text)}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {activeConversation?.messages.length === 1 && !loading && (
                <div className="space-y-2 pt-2">
                  <p className="flex items-center gap-2 text-xs font-medium text-[#8d7e73]">
                    <Sparkles size={14} className="text-[#b48b6a]" />
                    Try asking Lumi
                  </p>

                  {QUICK_PROMPTS.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => sendMessage(null, item.prompt)}
                      className="flex w-full items-center gap-2 rounded-xl border border-[#eadfd6] bg-white/90 p-3 text-left text-sm text-[#1e2b2b] shadow-sm transition hover:-translate-y-0.5 hover:border-[#d9a9b4] hover:bg-[#fff0f4]"
                    >
                      <Sparkles
                        size={16}
                        className="shrink-0 text-[#b48b6a]"
                      />
                      {item.title}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex items-start gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e2b2b] text-white">
                    <Bot size={17} />
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-[#eee2d9] bg-white/95 px-3 py-3 text-sm text-[#74675e] shadow-sm">
                    <LoaderCircle size={16} className="animate-spin" />
                    Lumi is thinking...
                  </div>
                </div>
              )}

              {error && (
                <div className="ml-10 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <p>{error}</p>

                  <button
                    type="button"
                    onClick={() => {
                      const lastUserMessage = [
                        ...(activeConversation?.messages || [])
                      ]
                        .reverse()
                        .find((message) => message.role === 'user');

                      if (lastUserMessage) {
                        sendMessage(null, lastUserMessage.text);
                      }
                    }}
                    disabled={loading}
                    className="mt-2 flex items-center gap-2 font-medium underline disabled:opacity-50"
                  >
                    <RotateCcw size={14} />
                    Try Again
                  </button>
                </div>
              )}

              {storageWarning && (
                <p className="text-center text-xs text-amber-700">
                  {storageWarning}
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={(event) => sendMessage(event)}
              className="border-t border-[#eadfd6] bg-[#fffdfb] p-3"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-[#e5d6cb] bg-[#fcf8f5] p-2 shadow-inner transition focus-within:border-[#b48b6a] focus-within:ring-2 focus-within:ring-[#b48b6a]/15">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      sendMessage(event);
                    }
                  }}
                  placeholder="Message Lumi in any language..."
                  aria-label="Message Lumi AI"
                  rows={1}
                  maxLength={4000}
                  disabled={loading}
                  className="max-h-28 min-h-10 min-w-0 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-[#1e2b2b] outline-none placeholder:text-[#9c8c80] disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1e2b2b] text-white shadow-sm transition hover:bg-[#b48b6a] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-center text-[10px] leading-4 text-[#8d7e73]">
                General skincare information only. Not a medical diagnosis.
              </p>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default LumiChatbot;