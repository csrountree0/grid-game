import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [gridSize, setGridSize] = useState(7)
  const [gameGrid, setGameGrid] = useState(Array(gridSize).fill().map(() => Array(gridSize).fill(false)))
  const [displayGrid, setDisplayGrid] = useState(Array(gridSize).fill().map(() => Array(gridSize).fill(false)))
  const [rowClues, setRowClues] = useState(Array(gridSize).fill('0'))
  const [colClues, setColClues] = useState(Array(gridSize).fill('0'))
  const [isWon, setIsWon] = useState(false)

  useEffect(() => {
    generateGrid()
  }, [gridSize])

  // check win condition
  const checkWin = (newDisplayGrid) => {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const isCorrect = (newDisplayGrid[i][j] && !gameGrid[i][j]) || (!newDisplayGrid[i][j] && gameGrid[i][j])
        if (!isCorrect) return false
      }
    }
    return true
  }

  // generate the game grid and calculate hints
  const generateGrid = () => {
    const newGameGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(false)) 
    for(let i = 0; i < gridSize; i++){
      for(let j = 0; j < gridSize; j++){
        newGameGrid[i][j] = Math.random() < 0.60
      }
    }
    setGameGrid(newGameGrid)
    
    // reset display grid and win state
    setDisplayGrid(Array(gridSize).fill().map(() => Array(gridSize).fill(false)))
    setIsWon(false)

    // calculate clues based on cells to click (false cells)
    const newRowClues = Array(gridSize).fill('')
    const newColClues = Array(gridSize).fill('')

    // check rows for cells to click (false cells)
    for(let i = 0; i < gridSize; i++){
      let count = 0
      let rowClue = []
      for(let j = 0; j < gridSize; j++){
        if(!newGameGrid[i][j]){
          count++
        } else if(count > 0) {
          rowClue.push(count)
          count = 0
        }
      }
      if(count > 0) rowClue.push(count)
      newRowClues[i] = rowClue.join(' ') || '0'
    }

    // check columns for cells to click (false cells)
    for(let j = 0; j < gridSize; j++){
      let count = 0
      let colClue = []
      for(let i = 0; i < gridSize; i++){
        if(!newGameGrid[i][j]){
          count++
        } else if(count > 0) {
          colClue.push(count)
          count = 0
        }
      }
      if(count > 0) colClue.push(count)
      newColClues[j] = colClue.join(' ') || '0'
    }

    setRowClues(newRowClues)
    setColClues(newColClues)
  }

  // toggle the cell in display grid and check if it matches game grid
  const toggleCell = (row, col) => {
    if (isWon) return
    
    const newDisplayGrid = [...displayGrid]
    newDisplayGrid[row][col] = !newDisplayGrid[row][col]
    setDisplayGrid(newDisplayGrid)

    if (checkWin(newDisplayGrid)) {
      setIsWon(true)
    }
  }

  // update the grid size
  const updateGridSize = (size) => {
    let isNew = size !== gridSize
    setGridSize(size)
    setGameGrid(Array(size).fill().map(() => Array(size).fill(false)))
    setDisplayGrid(Array(size).fill().map(() => Array(size).fill(false)))
    setRowClues(Array(size).fill('0'))
    setColClues(Array(size).fill('0'))
    setIsWon(false)
    if (!isNew) generateGrid()
  }

  // get cell class based on game state
  const getCellClass = (row, col) => {
    const isClicked = displayGrid[row][col]
    const shouldBeClicked = !gameGrid[row][col]

    
    if (isClicked) {
      return shouldBeClicked ? 'bg-indigo-500' : 'bg-red-500' // right or wrong
    }
    
    return 'bg-gray-700 hover:bg-gray-600' // base
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Grid Game</h1>
        
        {isWon && (
          <div className="text-center text-green-500 font-bold mb-4">
            Congratulations! You won!
          </div>
        )}
        
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
            <div className="w-14 h-14" /> 
            <div className="flex gap-2 mb-2 ml-2">
              {colClues.map((clue, i) => (
                <div 
                  key={`col-${i}`} 
                  className="w-14 h-14 flex items-center justify-center bg-gray-900 rounded text-sm"
                >
                  {clue}
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
                  className="w-14 h-14 flex items-center justify-center bg-gray-900 rounded text-sm"
                >
                  {clue}
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
              {displayGrid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`w-14 h-14 rounded cursor-pointer transition-all duration-200 ${getCellClass(rowIndex, colIndex)}`}
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
