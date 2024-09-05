import { Client } from "@stomp/stompjs";
import "./playerList.css";
import { useEffect, useState } from "react";

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


function PlayerDisplay(props: Props) {

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

  return (
    <ul className="playerList">
       {players.map((player: Player, index: number) => (
        <li key={index} className={`player${player.playerNumber}`}>
          <div
            style={{
              backgroundColor: player.colour,
              width: "40px",
              height: "40px",
            }}
          ></div>
          <h3>{player.username}</h3>
        </li>
      ))}
    </ul>
  )
}

export default PlayerDisplay