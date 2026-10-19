import React, { useState } from 'react';

// Початкові дані для Kanban-дошки
const initialTasks = [
  {
    id: 'task-1',
    title: 'Аналіз вимог',
    description: 'Опрацювати ТЗ для нових модулів системи',
    priority: 'High',
    status: 'todo',
  },
  {
    id: 'task-2',
    title: 'Розробка макета UI',
    description: 'Створити дизайни для роздруківки та адаптиву',
    priority: 'Medium',
    status: 'inProgress',
  },
  {
    id: 'task-3',
    title: 'Налаштування Git',
    description: 'Створити репозиторій та налаштувати гілки',
    priority: 'Low',
    status: 'done',
  },
  {
    id: 'task-4',
    title: 'Написання тесті',
    description: 'Покрити юніт-тестами основні компоненти',
    priority: 'Medium',
    status: 'todo',
  },
];

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'inProgress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Кольорове кодування для пріоритетів
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return { bg: '#ffebe9', color: '#cf222e', border: '#ff8182' };
      case 'Medium':
        return { bg: '#fff8c5', color: '#9a6700', border: '#d4a72c' };
      case 'Low':
        return { bg: '#dafbe1', color: '#1a7f37', border: '#4ac26b' };
      default:
        return { bg: '#f6f8fa', color: '#57606a', border: '#d0d7de' };
    }
  };

  // Drag & Drop обробники
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, targetColumnId, targetTaskId = null) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTaskId) return;

    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const draggedIndex = updatedTasks.findIndex((t) => t.id === draggedTaskId);
      if (draggedIndex === -1) return prevTasks;

      const [draggedTask] = updatedTasks.splice(draggedIndex, 1);
      draggedTask.status = targetColumnId;

      if (targetTaskId && targetTaskId !== draggedTaskId) {
        const targetIndex = updatedTasks.findIndex((t) => t.id === targetTaskId);
        updatedTasks.splice(targetIndex, 0, draggedTask);
      } else {
        updatedTasks.push(draggedTask);
      }

      return updatedTasks;
    });

    setDraggedTaskId(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Завдання 2: Drag-and-Drop Kanban Board</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);
          const isOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              style={{
                backgroundColor: isOver ? '#eef6ff' : '#f4f5f7',
                border: isOver ? '2px dashed #007bff' : '2px solid transparent',
                borderRadius: '8px',
                padding: '15px',
                minHeight: '400px',
                transition: 'background-color 0.2s, border 0.2s',
              }}
            >
              <h3 style={{ marginTop: 0, borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                {column.title} ({columnTasks.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {columnTasks.map((task) => {
                  const pStyle = getPriorityStyle(task.priority);
                  const isDragging = draggedTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragOver={(e) => handleDragOver(e, column.id)}
                      onDrop={(e) => {
                        e.stopPropagation();
                        handleDrop(e, column.id, task.id);
                      }}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        padding: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        cursor: 'grab',
                        opacity: isDragging ? 0.4 : 1,
                        borderLeft: `5px solid ${pStyle.border}`,
                        transition: 'transform 0.15s ease, opacity 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px' }}>{task.title}</h4>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 'bold',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: pStyle.bg,
                            color: pStyle.color,
                            border: `1px solid ${pStyle.border}`,
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>
                        {task.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
