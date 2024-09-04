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
    position : string
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
    position : "0, 10",
    active : true,
    score : 0
  })
  const [player2, /*setPlayer2*/] = useState<Player>({
    username : "",
    playerNumber : 2,
    shooter : false,
    colour : "red",
    position : "19, 4",
    active : true,
    score : 0
  })
  const [player3, /*setPlayer3*/] = useState<Player>({
    username : "",
    playerNumber : 3,
    shooter : true,
    colour : "green",
    position : "19, 10",
    active : true,
    score : 0
  })
  const [player4, /* setPlayer4 */] = useState<Player>({
    username : "",
    playerNumber : 4,
    shooter : true,
    colour : "yellow",
    position : "19, 16",
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
    console.log(player1.position, player1.colour, x, y)
    if (player1.position === x + ", " + y) {
      console.log(player1.position, player1.colour, x, y)
      return player1.colour;
    } else if (player2.position === x + ", " + y) {
      return player2.colour;
    } else if (player3.position === x + ", " + y) {
      return player3.colour;
    } else if (player4.position === x + ", " + y) {
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