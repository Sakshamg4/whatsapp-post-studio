import React, { useRef } from 'react';
import { Loader2, Copy, Download, Trash2, Sparkles } from 'lucide-react';

interface ComposePanelProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  provider: 'groq' | 'claude' | 'gemini' | 'mistral';
  setProvider: React.Dispatch<React.SetStateAction<'groq' | 'claude' | 'gemini' | 'mistral'>>;
  onGenerate: () => void;
  showNotification: (text: string, type: 'success' | 'error') => void;
}

const ComposePanel: React.FC<ComposePanelProps> = ({
  formData,
  setFormData,
  message,
  setMessage,
  isLoading,
  provider,
  setProvider,
  onGenerate,
  showNotification
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFormat = (startTag: string, endTag: string) => {
    if (!textareaRef.current) return;
    const txtArea = textareaRef.current;
    if (txtArea.selectionStart === undefined) return;

    const start = txtArea.selectionStart;
    const end = txtArea.selectionEnd;
    
    const selectedText = message.substring(start, end);
    const replacement = `${startTag}${selectedText}${endTag}`;

    setMessage(prev => prev.substring(0, start) + replacement + prev.substring(end) + " ");
    
    setTimeout(() => {
      txtArea.focus();
      txtArea.setSelectionRange(start + startTag.length + selectedText.length + endTag.length + 1, start + startTag.length + selectedText.length + endTag.length + 1);
    }, 0);
  };
  
  const insertEmoji = (emoji: string) => {
     if (!textareaRef.current) return;
    const txtArea = textareaRef.current;
    const start = txtArea.selectionStart;
    const end = txtArea.selectionEnd;
    
    setMessage(prev => prev.substring(0, start) + emoji + prev.substring(end));
    setTimeout(() => {
      txtArea.focus();
      txtArea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const handleCopy = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      showNotification('Message copied to clipboard!', 'success');
    } catch (err) {
      showNotification('Failed to copy', 'error');
    }
  };

  const handleDownload = () => {
    if (!message) return;
    const element = document.createElement("a");
    const file = new Blob([message], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    const fileName = 'formatted-post.txt';
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    showNotification('Download started', 'success');
  };

  const handleClear = () => {
    setFormData({
      rawContent: '',
      language: 'English',
      blogTitle: '',
      blogUrl: ''
    });
    setMessage('');
    showNotification('Cleared all fields', 'success');
  };

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-wa-green rounded-full inline-block"></span>
        Post Configuration
      </h2>

      <div className="bg-[#161b22] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col gap-6 w-full shadow-lg">
        
        {/* Provider Toggle */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-[#21262d] rounded-xl p-1 border border-white/5 w-full gap-1">
          <button
            onClick={() => setProvider('groq')}
            className={`py-2 px-3 rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] ${
              provider === 'groq' 
                ? 'bg-wa-green text-[#0d1117] shadow-sm' 
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            Groq
          </button>
          <button
             onClick={() => setProvider('claude')}
             className={`py-2 px-3 rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] ${
               provider === 'claude' 
                 ? 'bg-wa-green text-[#0d1117] shadow-sm' 
                 : 'text-text-muted hover:text-white hover:bg-white/5'
             }`}
          >
            Claude
          </button>
          <button
             onClick={() => setProvider('gemini')}
             className={`py-2 px-3 rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] ${
               provider === 'gemini' 
                 ? 'bg-wa-green text-[#0d1117] shadow-sm' 
                 : 'text-text-muted hover:text-white hover:bg-white/5'
             }`}
          >
            Gemini
          </button>
          <button
             onClick={() => setProvider('mistral')}
             className={`py-2 px-3 rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] ${
               provider === 'mistral' 
                 ? 'bg-wa-green text-[#0d1117] shadow-sm' 
                 : 'text-text-muted hover:text-white hover:bg-white/5'
             }`}
          >
            Mistral
          </button>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-white/80 px-1">Paste your product post</label>
            <textarea 
              name="rawContent"
              value={formData.rawContent}
              onChange={handleChange}
              rows={12}
              placeholder="Paste any product post here — any format, any style. AI will reformat it automatically..."
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-wa-green/50 focus:ring-1 focus:ring-wa-green/50 placeholder:text-gray-500 transition-all font-sans resize-y min-h-[200px]"
            />
            <div className="text-right text-[10px] text-gray-500 font-medium px-1">
               {formData.rawContent?.length || 0} characters
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-white/80 px-1">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-white focus:outline-none focus:border-wa-green/50 focus:ring-1 focus:ring-wa-green/50 appearance-none transition-all font-sans cursor-pointer"
              >
                {['English', 'Hindi', 'Hinglish', 'Marathi', 'Tamil', 'Telugu', 'Gujarati', 'Bengali'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-white/80 px-1">Blog Title (optional)</label>
              <input 
                name="blogTitle"
                value={formData.blogTitle}
                onChange={handleChange}
                placeholder="e.g. Notion Business Plan Full Review"
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-white focus:outline-none focus:border-wa-green/50 focus:ring-1 focus:ring-wa-green/50 placeholder:text-gray-500 transition-all font-sans"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-white/80 px-1">Blog URL (optional)</label>
            <input 
              name="blogUrl"
              value={formData.blogUrl}
              onChange={handleChange}
              placeholder="https://www.premiumtoolshub.in/blog/..."
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-white focus:outline-none focus:border-wa-green/50 focus:ring-1 focus:ring-wa-green/50 placeholder:text-gray-500 transition-all font-sans"
            />
          </div>

          <button 
             onClick={onGenerate}
             disabled={isLoading || !formData.rawContent}
             className="w-full bg-wa-green hover:bg-[#1fad52] disabled:opacity-50 disabled:cursor-not-allowed text-[#0d1117] font-bold text-[15px] h-12 min-h-[48px] rounded-xl flex items-center justify-center transition-all mt-2 shadow-[0_0_15px_rgba(37,211,102,0.3)] disabled:shadow-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                 <Loader2 className="animate-spin" size={18} />
                 Reformatting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles size={18} />
                ✦ Reformat with AI
              </span>
            )}
          </button>
        </div>

        <div className="border-t border-white/10 my-1 pt-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white/90 px-1">Final Output</label>
            </div>
            
            <div className="flex overflow-x-auto whitespace-nowrap gap-1.5 bg-[#0d1117] p-1.5 rounded-lg border border-white/10 px-2 no-scrollbar w-full">
               <button onClick={() => handleFormat('*', '*')} className="px-3 min-w-[44px] min-h-[40px] rounded-md hover:bg-white/10 text-white/80 hover:text-white font-bold transition-colors">*Bold*</button>
               <button onClick={() => handleFormat('_', '_')} className="px-3 min-w-[44px] min-h-[40px] rounded-md hover:bg-white/10 text-white/80 hover:text-white italic transition-colors">_Italic_</button>
               <button onClick={() => handleFormat('~', '~')} className="px-3 min-w-[44px] min-h-[40px] rounded-md hover:bg-white/10 text-white/80 hover:text-white line-through transition-colors">~Strike~</button>
               <div className="w-[1px] h-6 bg-white/10 my-auto mx-1"></div>
               {['✅', '⚡', '🔥', '💡', '📢', '🎉', '💰', '📲'].map(emoji => (
                 <button key={emoji} onClick={() => insertEmoji(emoji)} className="px-2.5 min-w-[44px] min-h-[40px] rounded-md hover:bg-white/10 text-xl text-center leading-none transition-colors">{emoji}</button>
               ))}
            </div>

            <div className="relative w-full group">
               <textarea
                 ref={textareaRef}
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 rows={10}
                 placeholder="Generated text will appear here. You can also type manually..."
                 className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-wa-green/50 focus:ring-1 focus:ring-wa-green/50 placeholder:text-gray-500 transition-all font-sans resize-y"
               />
               <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={handleCopy} className="p-2 bg-[#21262d] text-white/70 hover:text-white rounded-lg border border-white/10 shadow-lg" title="Copy Message">
                     <Copy size={16} />
                  </button>
               </div>
            </div>
            
            <div className="text-right text-xs text-wa-green/80 font-medium px-1">
               {message.length} characters
            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-2 w-full">
               <button onClick={handleCopy} className="flex-1 min-h-[44px] bg-[#21262d] hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all">
                  <Copy size={16} /> 📋 Copy Message
               </button>
               <button onClick={handleDownload} className="flex-1 min-h-[44px] bg-[#21262d] hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all">
                  <Download size={16} /> ⬇️ Download .txt
               </button>
               <button onClick={handleClear} className="w-full md:w-auto min-h-[44px] px-6 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all">
                  <Trash2 size={16} /> Clear
               </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ComposePanel;
