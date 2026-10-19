import React from 'react';
import VirtualizedInfiniteList from './VirtualizedInfiniteList';
import './App.css';

function App() {
  return (
    <div className="App" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <VirtualizedInfiniteList />
    </div>
  );
}

export default App;
