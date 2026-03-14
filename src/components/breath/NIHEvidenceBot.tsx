import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Send, ShieldAlert, ExternalLink, Loader2 } from 'lucide-react';
import { ApiRequestError, askNihBot, NihChatCitation } from '../../services/healthApi';
import { useLanguage } from '../../context/LanguageContext';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  citations?: NihChatCitation[];
}

function normalizeBotMarkdown(text: string): string {
  return text
    .replace(/(^|\n)(\d+)\.\*\*/g, '$1$2. **')
    .trim();
}

function renderInlineBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (!boldMatch) {
      return <React.Fragment key={index}>{part}</React.Fragment>;
    }

    return (
      <strong key={index} className="font-semibold text-slate-100">
        {boldMatch[1]}
      </strong>
    );
  });
}

function renderBotContent(content: string): React.ReactNode {
  const normalized = normalizeBotMarkdown(content);
  const lines = normalized.split('\n');

  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {renderInlineBold(line)}
          {index < lines.length - 1 ? <br /> : null}
        </React.Fragment>
      ))}
    </>
  );
}

export default function NIHEvidenceBot() {
  const { isHr, language } = useLanguage();
  const introText = useMemo(() => (
    isHr
      ? 'Pozdrav. Ja sam NIH Evidence Bot. Odgovaram na pitanja o SIBO, breath testovima i IBS-u koristeci samo NIH izvore. Kako mogu pomoci?'
      : 'Hello. I am the NIH Evidence Bot. I can answer questions about SIBO, breath tests, and IBS using only verified sources from the National Institutes of Health (NIH). How can I help you today?'
  ), [isHr]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [apiError, setApiError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const quickPrompts = useMemo(
    () => (
      isHr
        ? [
            { label: 'Pozitivan H2 kriterij?', prompt: 'Sto se smatra pozitivnim H2 breath testom?' },
            { label: 'IBS povezanost?', prompt: 'Koja je povezanost izmedu IBS-a i SIBO-a?' },
            { label: 'FODMAP prehrana?', prompt: 'Kako low FODMAP prehrana pomaze?' },
          ]
        : [
            { label: 'Positive H2 criteria?', prompt: 'What is considered a positive hydrogen breath test?' },
            { label: 'IBS overlap?', prompt: 'What is the connection between IBS and SIBO?' },
            { label: 'FODMAP diet?', prompt: 'How does a low FODMAP diet help?' },
          ]
    ),
    [isHr]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ id: 'intro', role: 'bot', content: introText }]);
    }
  }, [introText, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const buildApiErrorMessage = (error: unknown) => {
    if (error instanceof ApiRequestError) {
      if (error.code === 'UPSTREAM_QUOTA_EXCEEDED') {
        return isHr
          ? 'Dosegnut je besplatni dnevni limit modela. Pokusaj kasnije.'
          : 'The free model quota has been reached. Please try again later.';
      }
      if (error.code === 'LOCAL_RATE_LIMIT') {
        return isHr
          ? 'Prebrzo saljes upite. Pricekaj par sekundi pa pokusaj opet.'
          : 'You are sending requests too quickly. Please wait a few seconds and try again.';
      }
      return error.message;
    }

    return isHr ? 'Upit nije uspio. Pokusaj ponovno.' : 'Request failed. Please try again.';
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const question = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setApiError('');
    setIsSending(true);

    try {
      const response = await askNihBot(question, language);
      const botMessage: Message = {
        id: `${Date.now()}-bot`,
        role: 'bot',
        content: response.answer,
        citations: response.citations,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const message = buildApiErrorMessage(error);
      setApiError(message);
      setMessages((prev) => [...prev, { id: `${Date.now()}-err`, role: 'bot', content: message }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const showQuickPrompts = !messages.some((message) => message.role === 'user');

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col h-full backdrop-blur-sm overflow-hidden">
      <div className="bg-slate-950/80 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              NIH Evidence Bot
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-indigo-500/30">
                NIH-Only
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isHr ? 'Odgovori temeljeni iskljucivo na NIH.gov izvorima' : 'Answers based strictly on NIH.gov sources'}
            </p>
          </div>
        </div>
      </div>

      {apiError && (
        <div className="mx-4 mt-3 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          {apiError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.role === 'bot' ? renderBotContent(msg.content) : msg.content}
              </p>
            </div>

            {msg.role === 'bot' && msg.citations && msg.citations.length > 0 && (
              <div className="mt-2 ml-2 space-y-1">
                <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> {isHr ? 'Izvori:' : 'Sources:'}
                </p>
                {msg.citations.map((cite) => (
                  <a
                    key={cite.id}
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20 w-fit"
                    title={cite.snippet}
                  >
                    [{cite.id}] {cite.title} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex items-start">
            <div className="max-w-[85%] rounded-2xl p-4 bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700 inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span className="text-sm">{isHr ? 'Generiram odgovor...' : 'Generating answer...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showQuickPrompts && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((item) => (
            <button
              key={item.label}
              onClick={() => handleQuickPrompt(item.prompt)}
              className="whitespace-nowrap text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-700"
              disabled={isSending}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 bg-slate-950/50 border-t border-slate-800">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isHr ? 'Postavi pitanje o SIBO, testovima ili prehrani...' : 'Ask about SIBO, tests, or diet...'}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            title={isHr ? 'Posalji poruku' : 'Send message'}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
