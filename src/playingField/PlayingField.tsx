import { useEffect, useState } from "react"
import "./playingField.css"
import { Client } from "@stomp/stompjs"
import PlayerButtons from "./playerButtons/PlayerButtons"

interface Cell {
  x: number
  y: number
}

interface Props {
  stompClient: Client | null
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

function PlayingField(props: Props) {

  const [gridList, setGridList] = useState<Cell[]>([])
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (props.stompClient) {
        const subscription = props.stompClient.subscribe("/destroy/players", (message) => {
        const playerList = JSON.parse(message.body);
        console.log("Received players: ", playerList);
        setPlayers(playerList); 
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [props.stompClient])

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

    if (players[0] && players[0].x + ", " + players[0].y === x + ", " + y) {
      return players[0].colour;
    } else if (players[1] && players[1].x + ", " + players[1].y === x + ", " + y) {
      return players[1].colour;
    } else if (players[2] && players[2].x + ", " + players[2].y === x + ", " + y) {
      return players[2].colour;
    } else if (players[3] && players[3].x + ", " + players[3].y === x + ", " + y) {
      return players[3].colour;
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
      <PlayerButtons stompClient={props.stompClient} />
    </div>
  )
}

export default PlayingField