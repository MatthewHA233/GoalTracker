import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  texts: string[];
  typingSpeed?: number;
  delayBetweenTexts?: number;
}

export function TypewriterText({ 
  texts, 
  typingSpeed = 100,
  delayBetweenTexts = 3000 
}: TypewriterTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: number;

    if (isTyping) {
      if (displayedText.length < texts[currentTextIndex].length) {
        timeout = window.setTimeout(() => {
          setDisplayedText(texts[currentTextIndex].slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timeout = window.setTimeout(() => {
          setIsTyping(false);
        }, delayBetweenTexts);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = window.setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, typingSpeed / 2);
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, currentTextIndex, isTyping, texts, typingSpeed, delayBetweenTexts]);

  return (
    <div className="h-[1.5em] text-purple-300/60">
      {displayedText}
      <span className="animate-pulse">|</span>
    </div>
  );
}