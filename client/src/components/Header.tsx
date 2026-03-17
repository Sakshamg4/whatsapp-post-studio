import React from 'react';
import { Bot } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0d1117]/80 border-b border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-wa-green flex items-center justify-center text-[#0d1117]">
            <Bot size={18} fill="currentColor" />
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight text-white">
            WA <span className="text-wa-green">Studio</span>
          </h1>
        </div>
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-wa-green/10 text-wa-green border border-wa-green/20">
            AI Powered
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
