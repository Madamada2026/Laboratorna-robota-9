import React, { useState, useRef } from 'react';
import './SwipeGesture.css';

export default function SwipeGesture() {
  const [swipeData, setSwipeData] = useState({
    direction: 'Немає свайпу',
    distanceX: 0,
    distanceY: 0,
    force: 0,
    touchesCount: 0,
  });

  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const threshold = 50; // Поріг чутливості

  // Початок взаємодії (і палець, і мишка)
  const handleStart = (clientX, touchesCount) => {
    isDraggingRef.current = true;
    startPosRef.current = { x: clientX, y: startPosRef.current.y }; // спрощено для прикладу
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    isDraggingRef.current = true;
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
    setSwipeData((prev) => ({ ...prev, touchesCount: e.touches.length, direction: 'Жест розпочато...' }));
  };

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    setSwipeData((prev) => ({ ...prev, touchesCount: 1, direction: 'Жест мишкою...' }));
  };

  // Рух (і палець, і мишка)
  const handleMove = (clientX, clientY, touchesCount) => {
    if (!isDraggingRef.current) return;

    const deltaX = clientX - startPosRef.current.x;
    const deltaY = clientY - startPosRef.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const force = Math.min(Math.round((distance / threshold) * 100), 100);

    setSwipeData({
      direction: Math.abs(deltaX) > Math.abs(deltaY) 
        ? (deltaX > 0 ? 'Вправо ➔' : 'Вліво ⬅') 
        : (deltaY > 0 ? 'Вниз ⬇' : 'Вгору ⬆'),
      distanceX: Math.round(deltaX),
      distanceY: Math.round(deltaY),
      force,
      touchesCount,
    });
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY, e.touches.length);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY, 1);
  };

  // Завершення (і палець, і мишка)
  const handleEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setSwipeData((prev) => ({
      ...prev,
      direction: 'Свайп завершено',
      force: 0,
    }));
  };

  return (
    <div className="swipe-container">
      <h3>Завдання 3: Розпізнавання жестів свайпу</h3>
      
      <div 
        className="swipe-area"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        <p>Свайпайте тут ()</p>
        <div className="swipe-info">
          <p><strong>Напрямок:</strong> {swipeData.direction}</p>
          <p><strong>Кількість пальців:</strong> {swipeData.touchesCount}</p>
          <p><strong>Зміщення X:</strong> {swipeData.distanceX} px</p>
          <p><strong>Зміщення Y:</strong> {swipeData.distanceY} px</p>
        </div>

        {/* Візуальна індикація сили свайпу */}
        <div className="force-meter-bg">
          <div 
            className="force-meter-fill" 
            style={{ width: `${swipeData.force}%` }}
          ></div>
        </div>
        <span className="force-text">Сила жесту: {swipeData.force}%</span>
      </div>
    </div>
  );
}
