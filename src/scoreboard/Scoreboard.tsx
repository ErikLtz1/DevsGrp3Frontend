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
        const subscription = props.stompClient.subscribe("/destroy/player-scores", (message) => {
        const playerList = JSON.parse(message.body);
        setPlayers(playerList); 
      });
      const regSubscription = props.stompClient.subscribe("/destroy/player-registration", (message) => {
        const playerList = JSON.parse(message.body);
        setPlayers(playerList); 
        console.log("player 1:", playerList[0]);
      });
      
      return () => {
        subscription.unsubscribe();
        regSubscription.unsubscribe();
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
                width: "40px",
                height: "40px",
              }}
            >
              <img src={player.colour}></img>
            </td>
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