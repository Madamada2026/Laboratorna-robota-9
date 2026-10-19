import React, { useRef, useState } from 'react';

export default function HandwritingRecognizer({ 
  tolerance = 0.2, 
  minPoints = 12   
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [result, setResult] = useState({ shape: "Нічого", confidence: 0 });

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPoints([]);
    setResult({ shape: "Нічого", confidence: 0 });
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches.clientX : e.clientX;
    const clientY = e.touches ? e.touches.clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e);
    setIsDrawing(true);
    setPoints([{ x, y }]);
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0056b3';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    setPoints((prev) => [...prev, { x, y }]);
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    recognizeShape();
  };

  const recognizeShape = () => {
    if (points.length < minPoints) return;

    // 1. Обчислюємо габарити (Bounding Box)
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const width = maxX - minX;
    const height = maxY - minY;
    
    if (width < 10 || height < 10) return;

    const aspectRatio = Math.min(width, height) / Math.max(width, height);

    // 2. Розрахунок довжини шляху та відстані між кінцями
    const startP = points[0];
    const endP = points[points.length - 1];
    const startEndDist = Math.hypot(endP.x - startP.x, endP.y - startP.y);
    
    let totalPathLength = 0;
    for (let i = 1; i < points.length; i++) {
      totalPathLength += Math.hypot(points[i].x - points[i-1].x, points[i].y - points[i-1].y);
    }

    // --- ПЕРЕВІРКА 1: ЛІНІЯ ---
    const lineRatio = startEndDist / totalPathLength;
    if (lineRatio > 0.82) {
      return setResult({ shape: "Лінія", confidence: Math.min(lineRatio, 1) });
    }

    // --- ПЕРЕВІРКА 2: КУТИ ТА ЗГИНЫ (Основа розпізнавання) ---
    let corners = [];
    const step = Math.max(2, Math.floor(points.length * 0.05)); // Адаптивний крок від тремтіння рук

    for (let i = step; i < points.length - step; i++) {
      const p1 = points[i - step];
      const p2 = points[i];
      const p3 = points[i + step];

      const v1x = p2.x - p1.x;
      const v1y = p2.y - p1.y;
      const v2x = p3.x - p2.x;
      const v2y = p3.y - p2.y;

      const d1 = Math.hypot(v1x, v1y);
      const d2 = Math.hypot(v2x, v2y);
      if (d1 === 0 || d2 === 0) continue;

      // Рахуємо косинус кута між векторами руху
      const dot = (v1x * v2x + v1y * v2y) / (d1 * d2);

      // Якщо кут різкий (косинус малий — різка зміна напрямку, характерна для Квадрата/Трикутника)
      if (dot < 0.70) {
        // Запобігаємо дублюванню одного й того самого кута на сусідніх точках
        if (corners.length === 0 || (i - corners[corners.length - 1]) > step * 2) {
          corners.push(i);
        }
      }
    }

    // Враховуємо замикання контуру як додатковий кут
    const isClosed = startEndDist < Math.max(width, height) * 0.4;
    const totalCorners = corners.length + (isClosed ? 1 : 0);

    // --- ФІНАЛЬНА ГЕОМЕТРИЧНА СОРТУВАЛКА ---
    let shape = "Не розпізнано";
    let confidence = 0.5;

    // Справжнє коло малюється плавно, без різких кутів (totalCorners дуже малий)
    if (totalCorners <= 1) {
      // Обчислюємо рівномірність радіусів
      const centerX = minX + width / 2;
      const centerY = minY + height / 2;
      const radii = points.map(p => Math.hypot(p.x - centerX, p.y - centerY));
      const avgRadius = radii.reduce((a, b) => a + b, 0) / radii.length;
      const deviation = radii.reduce((sum, r) => sum + Math.abs(r - avgRadius), 0) / radii.length;
      const score = 1 - (deviation / avgRadius);

      if (aspectRatio > 0.65 && score > 0.75) {
        shape = "Коло";
        confidence = 0.6 + (score * 0.35) + (tolerance * 0.1);
      } else {
        shape = "Квадрат"; // Округлений або швидкий квадрат
        confidence = 0.65;
      }
    } 
    // Якщо зафіксовано 3 явних кути повороту — це Трикутник
    else if (totalCorners === 2 || totalCorners === 3) {
      shape = "Трикутник";
      confidence = 0.7 + (tolerance * 0.2);
    } 
    // Якщо 4 або більше кутів (як на вашому малюнку) — це Квадрат
    else {
      shape = "Квадрат";
      // Чим ближче пропорція сторін до 1:1, тим вищий скор
      confidence = 0.65 + (aspectRatio * 0.25) + (tolerance * 0.1);
    }

    setResult({
      shape: shape,
      confidence: Math.min(Math.max(confidence, 0.1), 1)
    });
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <h3>Розпізнавання фігур (Touch/Mouse)</h3>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{
          border: '2px solid #333',
          borderRadius: '8px',
          backgroundColor: '#fff',
          cursor: 'crosshair',
          touchAction: 'none'
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <div style={{ marginTop: '15px' }}>
        <button onClick={clearCanvas} style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
          Очистити екран
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        <p>Результат: <span style={{ color: '#007bff' }}>{result.shape}</span></p>
        <p>Впевненість (Confidence Score): <span style={{ color: '#28a745' }}>{(result.confidence * 100).toFixed(1)}%</span></p>
      </div>
    </div>
  );
}
