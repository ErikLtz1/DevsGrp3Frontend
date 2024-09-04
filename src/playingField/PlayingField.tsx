import { useEffect, useState } from "react"
import "./playingField.css"

interface Cell {
  x: number
  y: number
}

interface Player {
    username : string
    playerNumber : number
    shooter : boolean
    colour : string
    x: string,
    y: string,
    active : boolean
    score : number
  }

function PlayingField() {

  const [gridList, setGridList] = useState<Cell[]>([])
  const [player1, /*setPlayer1*/] = useState<Player>({
    username : "",
    playerNumber : 1,
    shooter : true,
    colour : "blue",
    x: "0",
    y: "",
    active : true,
    score : 0
  })
  const [player2, /*setPlayer2*/] = useState<Player>({
    username : "",
    playerNumber : 2,
    shooter : false,
    colour : "red",
    x: "19",
    y: "4",
    active : true,
    score : 0
  })
  const [player3, /*setPlayer3*/] = useState<Player>({
    username : "",
    playerNumber : 3,
    shooter : true,
    colour : "green",
    x: "19",
    y: "10",
    active : true,
    score : 0
  })
  const [player4, /* setPlayer4 */] = useState<Player>({
    username : "",
    playerNumber : 4,
    shooter : true,
    colour : "yellow",
    x: "19",
    y: "14",
    active : true,
    score : 0
  })

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


  function getColour(x: number, y: number) {

    if (player1.x + ", " + player1.y === x + ", " + y) {
      return player1.colour;
    } else if (player2.x + ", " + player2.y === x + ", " + y) {
      return player2.colour;
    } else if (player3.x + ", " + player3.y === x + ", " + y) {
      return player3.colour;
    } else if (player4.x + ", " + player4.y === x + ", " + y) {
      return player4.colour;
    } else {
      return "darkgrey";
    }
    

  }

  return (
    <div className="playingFieldOuterDiv">
      <h2>Shooting Gallery</h2>
      <div className="playingFieldDiv">
        { gridList.map((cell: Cell, index) => (
          <div 
            key={index}
            id={cell.x + ", " + cell.y}
            className="cell"
            style={{backgroundColor: getColour(cell.x, cell.y), 
            width: "20px", 
            height: "20px"}}
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