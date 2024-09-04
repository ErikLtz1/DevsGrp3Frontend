import { Client } from "@stomp/stompjs";
import "./playerList.css";
import { useEffect } from "react";

interface Props {
  stompClient: Client | null
}


function PlayerDisplay(props: Props) {

  useEffect(() => {
    props.stompClient?.subscribe("/destroy/players", (playerList) => {
      const players = JSON.parse(playerList.body)
      console.log("here: " + players)
    } )
  }, [])

  return (
    <ul className="playerList">
      <li className="player1">
        <div style={{backgroundColor : 'blue', width : '40px', height : '40px'}}></div><h3>David</h3>
      </li>
      <li className="player2">
        <div style={{backgroundColor : 'red', width : '40px', height : '40px'}}></div><h3>Erik</h3>
      </li>
      <li className="player3">
        <div style={{backgroundColor : 'green', width : '40px', height : '40px'}}></div><h3>Mathias</h3>
      </li>
      <li className="player4">
        <div style={{backgroundColor : 'yellow', width : '40px', height : '40px'}}></div><h3>Sam</h3>
      </li>
    </ul>
  )
}

export default PlayerDisplay