import { useEffect, useState } from "react"
import "./playingField.css"
import { Client } from "@stomp/stompjs"
import PlayerButtons from "./playerButtons/PlayerButtons"

interface Cell {
  x: number
  y: number
}

interface Bullet {
  x: number
  y: number
  count: number
}

interface Props {
  stompClient: Client | null
}

interface Player {
  username : string
  playerNumber : number
  shooter : boolean
  colour : string
  x: number,
  y: number,
  active : boolean
  score : number
}

function PlayingField(props: Props) {

  const [gridList, setGridList] = useState<Cell[]>([])
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStart, setGameStart] = useState<boolean>(false)
  const [localPlayer, setLocalPlayer] = useState<string | null>("");
  const [count, setCount] = useState<number>(5);
  const [bulletList, setBulletList] = useState<Bullet[]>([]);

  useEffect(() => {
    if (props.stompClient) {
        const subscription = props.stompClient.subscribe("/destroy/players", (message) => {
        const playerList = JSON.parse(message.body);
        console.log("Received players: ", playerList);
        setPlayers(playerList);      

        props.stompClient?.subscribe("/destroy/bullets", (message) => {
          console.log("bullet: ", message.body);
          const updatedBulletList = [...bulletList, JSON.parse(message.body)]
          setBulletList(updatedBulletList)
        });
        
      });

      return () => {
        subscription.unsubscribe();
      };
    }

  }, [props.stompClient])

  useEffect (() => {
    createGrid()
  }, [])

  useEffect (() => {
    gameStartFunction(players)
  }, [players])

  useEffect (() => {
    
    for (let bullet of bulletList) {
        for (let i = 0; i < bullet.count; i++) {
          console.log("new : ", bullet.x)
          
            setTimeout(() => {
              bullet.x += 1
            }, 500);
            bullet.count -= 1
          
        }
        const updatedBulletList = [...bulletList, bullet]
          setBulletList(updatedBulletList)
    }
  }, [bulletList])
  
  useEffect (() => {
    setLocalPlayer(sessionStorage.getItem("username"))
    console.log("session: ", sessionStorage.getItem("username"))
    console.log("here, ", gameStart)
    if (gameStart) {
      setCount(5); 
    }
  }, [gameStart])

  useEffect(() => {
    if (count > 0 && gameStart) {
      const timer = setTimeout(() => setCount(count - 1), 1000);

      return () => clearTimeout(timer);
    }
  }, [count, gameStart]);

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
    } else if (checkForBullet(x, y)) {
        return "purple";
    } else {
      return "darkgrey";
    }
  }

  const gameStartFunction = (players: any) => {
    console.log(players.length)
    if (players.length == 4) {
      setGameStart(true)
    } else {
      console.log(players);
    }
  }
  
  function checkForBullet(x: number, y: number) {
    for (let bullet of bulletList) {
      if (bullet.x == x && bullet.y == y) {
        console.log("bullet true")
        return true;
      } 
    }
  }

  return (
    <div className="playingFieldOuterDiv">
      <h2>Shooting Gallery</h2>
        { gameStart ? <div className="countdown">
      <h1>{count > 0 ? count : "Destroy!"}</h1> 
    </div> : null}
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
        <PlayerButtons stompClient={props.stompClient} localPlayer={localPlayer} count={count} playersList={players}/>
    </div>
  )
}

export default PlayingField
