import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, ShieldAlert, ExternalLink } from 'lucide-react';
import { generateNIHAnswer, RetrievedChunk } from '../../utils/nihRetrieval';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  citations?: RetrievedChunk[];
}

export default function NIHEvidenceBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: 'Hello. I am the NIH Evidence Bot. I can answer questions about SIBO, breath tests, and IBS using only verified sources from the National Institutes of Health (NIH). How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate network delay
    setTimeout(() => {
      const response = generateNIHAnswer(userMessage.content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.answer,
        citations: response.citations
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col h-full backdrop-blur-sm overflow-hidden">
      {/* Header */}
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
            <p className="text-xs text-slate-400">Answers based strictly on NIH.gov sources</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
            
            {/* Citations */}
            {msg.role === 'bot' && msg.citations && msg.citations.length > 0 && (
              <div className="mt-2 ml-2 space-y-1">
                <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Sources:
                </p>
                {msg.citations.map((cite, idx) => (
                  <a 
                    key={idx}
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20 w-fit"
                  >
                    {cite.title} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => handleQuickPrompt("What is considered a positive hydrogen breath test?")}
          className="whitespace-nowrap text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-700"
        >
          Positive H2 criteria?
        </button>
        <button 
          onClick={() => handleQuickPrompt("What is the connection between IBS and SIBO?")}
          className="whitespace-nowrap text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-700"
        >
          IBS overlap?
        </button>
        <button 
          onClick={() => handleQuickPrompt("How does a low FODMAP diet help?")}
          className="whitespace-nowrap text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-700"
        >
          FODMAP diet?
        </button>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950/50 border-t border-slate-800">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about SIBO, tests, or diet..." 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            title="Send message"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
