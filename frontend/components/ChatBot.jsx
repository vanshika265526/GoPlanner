import React, { useState, useEffect, useRef } from 'react';
import { generateChatResponse } from '../services/chatService';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      try {
        const initial = generateChatResponse('hello', {});
        setMessages([{
          id: Date.now(),
          type: 'bot',
          text: initial.response,
          quickReplies: initial.quickReplies,
        }]);
        setContext(initial.context);
      } catch (error) {
        console.error('ChatBot initialization error:', error);
        setMessages([{
          id: Date.now(),
          type: 'bot',
          text: 'Hi! 👋 I\'m your travel planning assistant. How can I help you plan your trip today?',
          quickReplies: ['Plan a trip', 'Suggest destination', 'Budget estimate'],
        }]);
      }
    }
  }, [messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (text = null) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate bot response
    const result = generateChatResponse(messageText, context);
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      text: result.response,
      quickReplies: result.quickReplies,
      suggestions: result.suggestions,
    };

    setMessages(prev => [...prev, botMessage]);
    setContext(result.context);
    setIsTyping(false);
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/40 hover:shadow-primary/60 hover:scale-110 transition-all duration-300 group"
          aria-label="Open chat"
        >
          <span className="material-symbols-outlined text-white text-2xl group-hover:scale-110 transition-transform">
            chat
          </span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[90vw] max-w-md h-[600px] max-h-[85vh] flex flex-col rounded-3xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-white/10 bg-gradient-to-r from-primary/10 to-cyan-500/10 dark:from-primary/20 dark:to-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">
                  travel_explore
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Travel Assistant</h3>
                <p className="text-xs text-slate-600 dark:text-white/60">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-white/70 text-xl">
                close
              </span>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-800/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white rounded-bl-sm border border-slate-200/50 dark:border-white/10'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  
                  {/* Quick Replies */}
                  {message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-600/50 text-slate-700 dark:text-white/80 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200/50 dark:border-white/10"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.type === 'itinerary' && (
                    <div className="mt-3 p-3 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20">
                      <p className="text-xs font-semibold text-primary dark:text-primary/80 mb-2">
                        ✨ Itinerary Ready!
                      </p>
                      <p className="text-xs text-slate-600 dark:text-white/70">
                        I've prepared a {message.suggestions.data.length}-day itinerary for {message.suggestions.destination}. 
                        Would you like to add it to your planner?
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/80 dark:bg-slate-700/80 rounded-2xl rounded-bl-sm px-4 py-3 border border-slate-200/50 dark:border-white/10">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-slate-400 dark:bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 dark:bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 dark:bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-slate-800/50">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  className="w-full px-4 py-2.5 pr-10 rounded-2xl border border-slate-300/50 dark:border-white/20 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                  style={{ maxHeight: '100px', minHeight: '44px' }}
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/30"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-white text-xl">
                  send
                </span>
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/50 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export { ChatBot };
export default ChatBot;

