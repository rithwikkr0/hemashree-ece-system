import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

interface GlitchTextProps {
  text: string;
  className?: string;
  triggerOnMount?: boolean;
  characters?: string;
}

const DEFAULT_CHARS = '01#$_<>[]*!~%&ΨΩλΔ∇';

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className,
  triggerOnMount = false,
  characters = DEFAULT_CHARS,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    if (!triggerOnMount && !isHovered) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 2;
    }, 25);

    return () => clearInterval(interval);
  }, [isHovered, triggerOnMount, text, characters]);

  return (
    <span
      className={clsx('inline-block font-mono cursor-default', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayText}
    </span>
  );
};
