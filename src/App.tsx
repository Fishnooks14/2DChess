
import './App.css'
import React from 'react';
import ChessComponent from './ChessComponent';

function App() {
  const handleInvalid = () => {
    console.error("Invalid")
  }

  return (
    <>
      <ChessComponent onInvalidMove = {handleInvalid} />
    </>
  )
}

export default App
