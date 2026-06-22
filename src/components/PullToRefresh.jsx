import { useRef, useState, useCallback } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

const THRESHOLD = 65;
const MAX_PULL = 90;

export default function PullToRefresh({ onRefresh, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);

  const handleTouchStart = useCallback((e) => {
    if (window.scrollY <= 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e) => {
    if (!pulling.current || isRefreshing) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.5, MAX_PULL));
    }
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;

    if (pullDistance >= THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(THRESHOLD);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
  }, [pullDistance, onRefresh]);

  const indicatorHeight = isRefreshing ? THRESHOLD : pullDistance;
  const showIndicator = indicatorHeight > 0;
  const readyToRelease = pullDistance >= THRESHOLD;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          transform: `translateY(${indicatorHeight}px)`,
          transition: pulling.current ? 'none' : 'transform 0.3s ease',
        }}
      >
        <div
          className="flex items-center justify-center overflow-hidden"
          style={{ height: indicatorHeight, marginTop: -indicatorHeight }}
        >
          {isRefreshing ? (
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          ) : (
            <ChevronDown
              className="w-5 h-5 text-slate-400 transition-transform duration-200"
              style={{ transform: readyToRelease ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          )}
        </div>
        {children}
      </div>
    </div>
  );
}