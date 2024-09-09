import { Client } from "@stomp/stompjs"
import "./scoreboard.css"
import { useState, useEffect } from "react"

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

function Scoreboard(props: Props) {

  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (props.stompClient) {
        const subscription = props.stompClient.subscribe("/destroy/players", (message) => {
        const playerList = JSON.parse(message.body);
        setPlayers(playerList); 
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [props.stompClient])

  return (
    <div className="scoreboardDiv">
      <h2>Scoreboard</h2>
      <table>
        <thead>
          <tr>
            <td></td>
            <td>Player</td>
            <td>Score</td>
          </tr>
        </thead>
        <tbody>
        {players.map((player: Player, index: number) => (
          <tr key={index}>
            <td
              style={{
                backgroundColor: player.colour,
                width: "40px",
                height: "40px",
              }}
            ></td>
            <td>{player.username}</td>
            <td>{player.score}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default Scoreboard