'use client';
import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href="https://wa.me/1234567890?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%21%20%D8%A3%D9%86%D8%A7%20%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D8%A7%D9%84%D8%AA%D8%AC%D8%B1%D8%A8%D8%A9%20%D8%A7%D9%84%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 end-6 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg shadow-black/50 z-40 transition-transform hover:scale-110 flex items-center justify-center animate-bounce-slow"
      aria-label="تواصل معنا على واتساب"
    >
      <MessageCircle size={32} />
    </a>
  );
}
