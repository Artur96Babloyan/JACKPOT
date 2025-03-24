'use client';

import { useEffect, useState } from 'react';

export function TelegramViewport() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateViewportHeight = () => {
      if (typeof window !== 'undefined') {
        document.documentElement.style.setProperty(
          '--tg-viewport-height',
          `${window.innerHeight}px`
        );
        document.documentElement.style.setProperty(
          '--tg-viewport-stable-height',
          `${window.innerHeight}px`
        );
      }
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    setMounted(true);
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateViewportHeight);
      }
    };
  }, []);

  // Don't render anything on the server
  if (!mounted) {
    return null;
  }

  return null;
} 