import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const scrollPositions = {};

export function useScrollRestoration(restoreDelay = 350) {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  const saveScroll = useCallback((path) => {
    scrollPositions[path] = window.scrollY;
  }, []);

  useEffect(() => {
    saveScroll(prevPath.current);
    prevPath.current = location.pathname;

    const saved = scrollPositions[location.pathname] || 0;
    const timer = setTimeout(() => {
      window.scrollTo({ top: saved, behavior: 'instant' });
    }, restoreDelay);

    return () => clearTimeout(timer);
  }, [location.pathname, restoreDelay, saveScroll]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScroll(location.pathname);
    };
    window.addEventListener('pagehide', handleBeforeUnload);
    return () => window.removeEventListener('pagehide', handleBeforeUnload);
  }, [location.pathname, saveScroll]);
}