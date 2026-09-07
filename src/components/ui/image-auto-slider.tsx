import React from 'react';

interface ImageAutoSliderProps {
  images?: string[];
}

export const ImageAutoSlider = ({ images: propImages }: ImageAutoSliderProps) => {
  // Split the 22 local certificate images into two rows
  const images = propImages || Array.from({ length: 22 }, (_, i) => `/certificates/cert-${i + 1}.webp`);
  
  const mid = Math.ceil(images.length / 2);
  const row1Images = images.slice(0, mid);
  const row2Images = images.slice(mid);

  // Duplicate images for seamless loop
  const duplicatedRow1 = [...row1Images, ...row1Images];
  const duplicatedRow2 = [...row2Images, ...row2Images];

  return (
    <>
      <style>{`
        html, body {
          overflow-x: hidden;
        }

        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .infinite-scroll-left {
          animation: scroll-left 30s linear infinite;
        }

        .infinite-scroll-right {
          animation: scroll-right 30s linear infinite;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }
      `}</style>
      
      <div className="w-full relative overflow-hidden flex flex-col items-center justify-center gap-8 py-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent z-0" />
        
        {/* Row 1: Scrolling Left */}
        <div className="relative z-10 w-full flex items-center justify-center">
          <div className="scroll-container w-full max-w-[100vw] md:max-w-7xl overflow-hidden">
            <div className="infinite-scroll-left flex gap-4 md:gap-6 w-max" dir="ltr">
              {duplicatedRow1.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 h-40 md:h-52 lg:h-64 rounded-xl overflow-hidden shadow-xl relative transition-transform duration-300 hover:scale-105 hover:brightness-110 flex items-center justify-center bg-neutral-900/50"
                >
                  <img
                    src={image}
                    alt={`Certificate ${(index % row1Images.length) + 1}`}
                    className="h-full w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="relative z-10 w-full flex items-center justify-center mt-4">
          <div className="scroll-container w-full max-w-[100vw] md:max-w-7xl overflow-hidden">
            <div className="infinite-scroll-right flex gap-4 md:gap-6 w-max" dir="ltr">
              {duplicatedRow2.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 h-40 md:h-52 lg:h-64 rounded-xl overflow-hidden shadow-xl relative transition-transform duration-300 hover:scale-105 hover:brightness-110 flex items-center justify-center bg-neutral-900/50"
                >
                  <img
                    src={image}
                    alt={`Certificate ${(index % row2Images.length) + mid + 1}`}
                    className="h-full w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
