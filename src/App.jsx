import React from 'react';
import TextEditorWithShortcuts from './TextEditorWithShortcuts';
import KanbanBoard from './KanbanBoard';

export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <TextEditorWithShortcuts />
      <hr style={{ margin: '40px 0' }} />
      <KanbanBoard />
    </div>
  );
}
