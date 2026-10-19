import React, { useState, useRef } from 'react';

const generateInitialData = (count) => 
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Елемент списку № ${index + 1}`,
    description: `Опис та детальна інформація для елемента ${index + 1}`,
  }));

const ITEM_HEIGHT = 60;
const VISIBLE_COUNT = 10;

export default function VirtualizedInfiniteList() {
  const [items, setItems] = useState(() => generateInitialData(50));
  const [scrollTop, setScrollTop] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDist, setPullDist] = useState(0);

  const listInnerRef = useRef(null);
  const touchStartRef = useRef(0);
  const throttleRef = useRef(false);

  const handleScroll = () => {
    if (throttleRef.current) return;
    throttleRef.current = true;

    setTimeout(() => {
      if (listInnerRef.current) {
        const { scrollTop, clientHeight, scrollHeight } = listInnerRef.current;
        setScrollTop(scrollTop);

        if (scrollHeight - (scrollTop + clientHeight) < 100 && !loading) {
          loadMoreItems();
        }
      }
      throttleRef.current = false;
    }, 200);
  };

  const loadMoreItems = () => {
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => [
        ...prev,
        ...Array.from({ length: 20 }, (_, index) => ({
          id: prev.length + index + 1,
          title: `Елемент списку № ${prev.length + index + 1}`,
          description: `Додатково завантажений елемент ${prev.length + index + 1}`,
        })),
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleTouchStart = (e) => {
    if (listInnerRef.current && listInnerRef.current.scrollTop === 0) {
      touchStartRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (touchStartRef.current === 0) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartRef.current;
    
    if (diff > 0 && diff < 150) {
      setPullDist(diff);
    }
  };

  const handleTouchEnd = () => {
    if (pullDist > 70) {
      setRefreshing(true);
      setTimeout(() => {
        setItems(generateInitialData(30));
        setRefreshing(false);
      }, 1000);
    }
    setPullDist(0);
    touchStartRef.current = 0;
  };

  const totalHeight = items.length * ITEM_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 2);
  const endIndex = Math.min(items.length, startIndex + VISIBLE_COUNT + 5);
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * ITEM_HEIGHT;

  return (
    <div style={{ width: '600px', margin: '40px auto', border: '1px solid #ccc', borderRadius: '8px', background: '#fff', overflow: 'hidden', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Індикатор оновлення */}
      <div style={{ height: `${pullDist}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', color: '#555', fontSize: '13px', overflow: 'hidden', transition: 'height 0.1s' }}>
        {refreshing ? 'Оновлення даних...' : 'Потягніть вниз для оновлення'}
      </div>

      {/* Вікно прокрутки */}
      <div
        ref={listInnerRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ height: '450px', overflowY: 'auto', position: 'relative', width: '100%' }}
      >
        <div style={{ height: `${totalHeight}px`, width: '100%', position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', top: 0, left: 0, right: 0, width: '100%' }}>
            {visibleItems.map((item) => (
              <div key={item.id} style={{ height: `${ITEM_HEIGHT}px`, padding: '10px 20px', borderBottom: '1px solid #eee', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <strong style={{ fontSize: '14px', color: '#222' }}>{item.title}</strong>
                <span style={{ fontSize: '12px', color: '#666' }}>{item.description}</span>
              </div>
            ))}
          </div>
        </div>
        {loading && <div style={{ padding: '15px', textAlign: 'center', color: '#0066cc', background: '#f9f9f9', fontSize: '13px' }}>Завантаження нових елементів...</div>}
      </div>

    </div>
  );
}
