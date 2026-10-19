import React, { useState, useRef, useEffect } from 'react';

export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [tool, setTool] = useState('brush'); // brush, eraser, line, rectangle
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Ініціалізація контексту Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 700;
    canvas.height = 450;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    // Заповнюємо білим фоном за замовчуванням
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    setCtx(context);
    saveState(context);
  }, []);

  const saveState = (context) => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setHistory((prev) => [...prev, dataUrl]);
    setRedoStack([]);
  };

  // Отримання координат події (миша чи палець)
  const getEventPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const pos = getEventPos(e);
    setIsDrawing(true);
    setStartPos(pos);

    if (ctx) {
      setSnapshot(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    e.preventDefault();
    const pos = getEventPos(e);

    if (tool === 'brush' || tool === 'eraser') {
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = lineWidth;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (snapshot) {
      // Для фігур (лінія, прямокутник) відновлюємо знімок і малюємо наживо
      ctx.putImageData(snapshot, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.fillStyle = color;

      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === 'rectangle') {
        const width = pos.x - startPos.x;
        const height = pos.y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      }
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    if (e) e.preventDefault();
    setIsDrawing(false);
    if (ctx) {
      saveState(ctx);
    }
  };

  // Функціональність Undo / Redo
  const handleUndo = () => {
    if (history.length <= 1) return;
    const lastState = history[history.length - 1];
    setRedoStack((prev) => [lastState, ...prev]);
    
    const newHistory = history.slice(0, history.length - 1);
    setHistory(newHistory);

    const img = new Image();
    img.src = newHistory[newHistory.length - 1];
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[0];
    setRedoStack(redoStack.slice(1));
    setHistory((prev) => [...prev, nextState]);

    const img = new Image();
    img.src = nextState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  // Експорт у PNG
  const handleExport = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ width: '700px', margin: '20px auto', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: '8px', padding: '15px', background: '#f9f9f9', boxSizing: 'border-box' }}>
      
      {/* Панель інструментів */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setTool('brush')} style={{ fontWeight: tool === 'brush' ? 'bold' : 'normal' }}>Пензель</button>
        <button onClick={() => setTool('eraser')} style={{ fontWeight: tool === 'eraser' ? 'bold' : 'normal' }}>Ластик</button>
        <button onClick={() => setTool('line')} style={{ fontWeight: tool === 'line' ? 'bold' : 'normal' }}>Лінія</button>
        <button onClick={() => setTool('rectangle')} style={{ fontWeight: tool === 'rectangle' ? 'bold' : 'normal' }}>Прямокутник</button>

        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          Колір:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          Товщина: {lineWidth}
          <input type="range" min="1" max="30" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} />
        </label>
      </div>

      {/* Сам Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ border: '1px solid #999', cursor: 'crosshair', background: '#fff', display: 'block', touchAction: 'none' }}
      />

      {/* Панель управління історією та експортом */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <button onClick={handleUndo} disabled={history.length <= 1}>Назад (Undo)</button>
        <button onClick={handleRedo} disabled={redoStack.length === 0}>Вперед (Redo)</button>
        <button onClick={handleExport} style={{ marginLeft: 'auto', background: '#007bff', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Експорт у PNG</button>
      </div>

    </div>
  );
}
