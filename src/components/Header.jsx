import React, { useEffect, useState } from 'react';
import { Dice1 } from 'lucide-react';
import clsx from 'clsx';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [text, setText] = useState('');
  const fullText = 'Smart PR Analyzer';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i >= fullText.length) {
        clearInterval(timer);
        return;
      }
      setText((prev) => prev + fullText[i]);
      i++;
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full sticky top-0 z-50 flex justify-center py-3">
      <div
        className={clsx(
          'rounded-2xl px-6 py-3 shadow-md flex items-center gap-2 transition-all duration-300',
          'max-w-2xl', // ✅ Only as wide as content
          scrolled
            ? 'backdrop-blur-md bg-gray-800/70'
            : 'bg-gradient-to-r from-emerald-500 via-purple-500 to-gray-600'
        )}
      >
        <Dice1 className="w-5 h-5 text-white" />
        <h1 className="text-white font-semibold text-lg sm:text-xl tracking-wide">
          {text}
        </h1>
      </div>
    </div>
  );
};

export default Header;
