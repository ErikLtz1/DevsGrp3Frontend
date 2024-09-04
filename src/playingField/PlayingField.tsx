import { useEffect, useState } from "react"
import "./playingField.css"

interface Cell {
  x: number
  y: number
}

function PlayingField() {

  const [gridList, setGridList] = useState<Cell[]>([])

  useEffect (() => {
    createGrid()
  }, [])

  const createGrid = () => {
    const gridSize = 20

    const buildGridList = [];

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        buildGridList.push({x, y})
      }
    }

    setGridList(buildGridList)
  }


  return (
    <div className="playingFieldOuterDiv">
      <h2>Shooting Gallery</h2>
      <div className="playingFieldDiv">
        { gridList.map((cell: Cell, index) => (
          <div 
            key={index}
            id={cell.x + "," + cell.y}
            className="cell"
            style={{backgroundColor: "darkgray", width: "20px", height: "20px"}}
            data-x = {cell.x}
            data-y = {cell.y}
          >
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlayingField