import { useState } from 'react'
import './App.css'

function App() {
  const [gridSize, setGridSize] = useState(7)
  const [grid, setGrid] = useState(Array(gridSize).fill().map(() => Array(gridSize).fill(false)))
  const [rowClues, setRowClues] = useState(Array(gridSize).fill().map(() => [0, 0]))
  const [colClues, setColClues] = useState(Array(gridSize).fill().map(() => [0, 0]))

  // toggle the cell
  const toggleCell = (row, col) => {
    const newGrid = [...grid]
    newGrid[row][col] = !newGrid[row][col]
    setGrid(newGrid)
  }

  // update the grid size
  const updateGridSize = (size) => {
    setGridSize(size)
    setGrid(Array(size).fill().map(() => Array(size).fill(false)))
    setRowClues(Array(size).fill().map(() => [0, 0]))
    setColClues(Array(size).fill().map(() => [0, 0]))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Grid Game</h1>
        
        {/* Grid size buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {[5, 7, 10].map((size) => (
            <button
              key={size}
              onClick={() => updateGridSize(size)}
              className={`px-4 py-2 rounded cursor-pointer ${
                gridSize === size 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col">
          {/* Top row with column clues */}
          <div className="flex">
            <div className="w-12 h-12" /> 
            <div className="flex gap-2 mb-2 ml-2">
              {colClues.map((clue, i) => (
                <div 
                  key={`col-${i}`} 
                  className="w-12 h-12 flex items-center justify-center bg-gray-900 rounded text-sm"
                >
                  {clue.join('\n')}
                </div>
              ))}
            </div>
          </div>

          {/* Main grid with row clues */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              {rowClues.map((clue, rowIndex) => (
                <div 
                  key={`row-clue-${rowIndex}`}
                  className="w-12 h-12 flex items-center justify-center bg-gray-900 rounded text-sm"
                >
                  {clue.join('\n')}
                </div>
              ))}
            </div>

            {/* Game grid */}
            <div 
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`
              }}
            >
              {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`w-12 h-12 rounded cursor-pointer transition-all duration-200
                      ${cell ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => toggleCell(rowIndex, colIndex)}
                  />
                ))
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
