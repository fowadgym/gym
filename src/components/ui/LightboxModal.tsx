'use client';
import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GalleryImage } from '../../types';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface LightboxModalProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function LightboxModal({ images, currentIndex, isOpen, onClose, onNavigate }: LightboxModalProps) {
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') {
      // In RTL, ArrowRight might mean previous logically, but visually it's right.
      // Assuming Arabic RTL context:
      onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    }
    if (e.key === 'ArrowLeft') {
      onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    }
  }, [currentIndex, images.length, onClose, onNavigate]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 end-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors z-50"
        aria-label="إغلاق"
      >
        <X size={32} />
      </button>

      <button 
        onClick={handlePrev}
        className="absolute top-1/2 start-4 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-colors z-50"
        aria-label="السابق"
      >
        <ChevronRight size={32} />
      </button>

      <button 
        onClick={handleNext}
        className="absolute top-1/2 end-4 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-colors z-50"
        aria-label="التالي"
      >
        <ChevronLeft size={32} />
      </button>

      <div 
        className="relative w-full max-w-5xl aspect-video mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.alt}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
