import React from 'react';
import { Send, CheckCheck, User } from 'lucide-react';

interface PreviewPanelProps {
  message: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ message }) => {
  const formatMessage = (text: string) => {
    if (!text) return null;

    // Formatting parsing:
    // *bold* -> <strong>bold</strong>
    // _italic_ -> <em>italic</em>
    // ~strike~ -> <del>strike</del>
    
    // First escape HTML
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    // Replace markdown-like syntax
    formatted = formatted.replace(/\*([^*]+)\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/_([^_]+)_/g, "<em>$1</em>");
    formatted = formatted.replace(/~([^~]+)~/g, "<del>$1</del>");
    
    // Convert newlines to breaks
    formatted = formatted.replace(/\n/g, "<br />");

    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <div className="lg:sticky lg:top-20 flex flex-col h-full lg:self-start w-full transition-all">
      <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-wa-green rounded-full inline-block"></span>
        Live Preview
      </h2>

      <div className="flex-1 min-h-[500px] flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#1a1e24] shadow-xl relative">
        {/* Header Bar */}
        <div className="bg-wa-dark px-4 py-3 flex items-center gap-3 z-10 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center overflow-hidden">
             <User size={24} className="text-white mt-2" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="font-semibold text-white truncate px-1">Your Business</span>
            <span className="text-xs text-white/80 px-1">online</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto wa-bg-pattern relative font-sans text-[15px] leading-relaxed flex flex-col items-center">
          {!message ? (
            <div className="my-auto bg-black/40 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-medium">
              Paste a post and hit Reformat ✨
            </div>
          ) : (
            <div className="max-w-[90%] md:max-w-[85%] bg-white text-[#111b21] rounded-2xl rounded-tl-sm p-3 md:p-4 shadow-sm self-start whitespace-pre-wrap word-break animate-in slide-in-from-bottom-4 fade-in duration-300 relative">
              {formatMessage(message)}
              
              <div className="flex justify-end items-end gap-1 mt-1 text-[11px] text-gray-400 font-medium pt-1">
                <span>12:34</span>
                <CheckCheck size={14} className="text-[#53bdeb] ml-0.5" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="bg-[#f0f0f0] p-3 md:p-4 flex flex-row items-center gap-2 z-10">
          <div className="flex-1 bg-white rounded-full px-4 py-2.5 text-gray-400 text-[15px] border border-gray-200">
            Type a message...
          </div>
          <div className="w-11 h-11 bg-[#00a884] rounded-full flex items-center justify-center shadow flex-shrink-0 cursor-pointer text-white">
            <Send size={18} className="translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
