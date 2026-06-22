import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const scrollPositions = {};

export function useScrollRestoration(restoreDelay = 320) {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    scrollPositions[prevPath.current] = window.scrollY;
    prevPath.current = location.pathname;

    const saved = scrollPositions[location.pathname];
    const timer = setTimeout(() => {
      window.scrollTo(0, saved || 0);
    }, restoreDelay);

    return () => clearTimeout(timer);
  }, [location.pathname, restoreDelay]);
}