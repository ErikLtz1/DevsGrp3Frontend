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
      });
      const bulletSubscription = props.stompClient?.subscribe("/destroy/bullets", (message) => {
        console.log("bullet: ", message.body);
        const bullet = JSON.parse(message.body);
        setBulletList((prevBullets) => [...prevBullets, bullet]);
      });

      return () => {
        subscription.unsubscribe();
        bulletSubscription.unsubscribe();
      };
    }

  }, [props.stompClient])

  useEffect (() => {
    createGrid()
  }, [])

  useEffect (() => {
    gameStartFunction(players)
  }, [players])

  useEffect(() => {
    const bulletMovementInterval = setInterval(() => {
      setBulletList((prevBulletList) =>
        prevBulletList
          .map((bullet) => {
            let hitPlayer = false;
            const clonePlayers = players
  
            for (let player of clonePlayers) {
              if (bullet.x === player.x && bullet.y === player.y) {
                hitPlayer = true;
                console.log("bullet hit ", player.username);
                player.active = false;
                setPlayers(clonePlayers)
                sendUpdatedPlayerList(player.username)
                break;  
              }
            }
  
            if (hitPlayer) {
              return { ...bullet, count: 0 }; 
            }
  
            return {
              ...bullet,
              x: bullet.x + 1,  
              count: bullet.count - 1,  
            };
          })
          .filter((bullet) => bullet.count > 0) 
      );
    }, 100); 
  
    return () => clearInterval(bulletMovementInterval); 
  }, [bulletList]);
  
  
  useEffect (() => {
    setLocalPlayer(sessionStorage.getItem("username"))

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
    if (players.some((player) => player.x === x && player.y === y && player.active === true)) {
      return players.find((player) => player.x === x && player.y === y)!.colour;
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
    return bulletList.some((bullet) => bullet.x === x && bullet.y === y);
  }

  function sendUpdatedPlayerList(username: string) {

    if (props.stompClient) {
        console.log("client connected!!!!!!!!!!!")
        for(const player of players) {
          if(player.username === username) {
            console.log(player)
            props.stompClient.publish({
                destination: "/app/update-player-movement",
                body: JSON.stringify(player)
            });
            break;
          }
        }

    } else {
        console.log("no stomp client")
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
