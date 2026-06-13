import { useState, useRef, useEffect } from 'react';
import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react';

interface SplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

/**
 * SplitLayout provides a split view for code editors and the preview.
 * It supports drag-to-resize, and responds dynamically to screen size:
 * - Desktop: Side-by-side resizing (horizontal flex)
 * - Mobile: Top-and-bottom resizing (vertical flex)
 */
export function SplitLayout({ left, right }: SplitLayoutProps) {
  const [splitOffset, setSplitOffset] = useState<number>(50); // percentage (15 to 85)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect and monitor mobile viewport changes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startResize = (e: ReactPointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      
      let newOffset: number;
      if (isMobile) {
        // Vertical split resizing (top / bottom)
        newOffset = ((e.clientY - containerRect.top) / containerRect.height) * 100;
      } else {
        // Horizontal split resizing (left / right)
        newOffset = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      }

      // Constrain split offset between 15% and 85% to prevent complete panel collapse
      if (newOffset >= 15 && newOffset <= 85) {
        setSplitOffset(newOffset);
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    // Listen on window object so dragging is smooth if cursor leaves splitter bounds
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, isMobile]);

  // Derive styles dynamically based on size orientation
  const sizeStyle = isMobile
    ? {
        topHeight: `calc(${splitOffset}% - 4px)`,
        bottomHeight: `calc(${100 - splitOffset}% - 4px)`,
      }
    : {
        leftWidth: `calc(${splitOffset}% - 4px)`,
        rightWidth: `calc(${100 - splitOffset}% - 4px)`,
      };

  return (
    <div 
      ref={containerRef} 
      className={`split-layout-container ${isMobile ? 'vertical' : 'horizontal'}`}
    >
      <div 
        className="split-pane pane-first" 
        style={isMobile ? { height: sizeStyle.topHeight } : { width: sizeStyle.leftWidth }}
      >
        {left}
      </div>
      
      <div 
        className={`split-resizer ${isDragging ? 'dragging' : ''}`}
        onPointerDown={startResize}
        role="separator"
        aria-valuenow={Math.round(splitOffset)}
        aria-valuemin={15}
        aria-valuemax={85}
        title={isMobile ? 'Drag vertically to resize' : 'Drag horizontally to resize'}
      />
      
      <div 
        className="split-pane pane-second" 
        style={isMobile ? { height: sizeStyle.bottomHeight } : { width: sizeStyle.rightWidth }}
      >
        {right}
        {/* Transparent overlay blocks interactions with iframe while dragging to ensure smooth movement */}
        {isDragging && <div className="iframe-drag-overlay" />}
      </div>
    </div>
  );
}
