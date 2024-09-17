import "./globals"
import './App.css'
import Header from "./header/Header"
import PlayerInput from "./playerInput/PlayerInput"
import PlayingField from "./playingField/PlayingField"
import Scoreboard from "./scoreboard/Scoreboard"
import PlayerDisplay from "./playerDisplay/PlayerDisplay"
import { useEffect, useState } from "react"
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"

function App() {

  const [stompClient, setStompClient] = useState<Client | null>(null)

  useEffect(() => {
    sessionStorage.clear();
    if (stompClient) {
      stompClient.publish({
      destination: "/app/game-end",
    });
    }
    const socketUrl = process.env.NODE_ENV === 'development' 
      ? "http://localhost:8080/connect" 
      : "https://seal-app-a9r4z.ondigitalocean.app/connect";

    const socket = new SockJS(socketUrl);
    const client = new Client({
      webSocketFactory: () => socket as WebSocket,
      reconnectDelay: 5000,
      onConnect: () => {
        setStompClient(client);
        console.log("Connection established");
      },
      onDisconnect: () => {
        console.log("disconnected from websocket")
      }
    });

    client.activate();

  }, [])

  const resetGame = () => {
    sessionStorage.clear();
    if (stompClient) {
        stompClient.publish({
        destination: "/app/game-end",
    });
    }
    location.reload();
  }

  return (
    <>
      <button className="resetBtn" onClick={() => resetGame()}>Reset</button>
      <Header /> 
      <PlayerInput stompClient={stompClient} /> 
      <PlayerDisplay stompClient={stompClient} />
      <div className="fieldAndScoreboardDiv">
        <PlayingField stompClient={stompClient} /> 
        <Scoreboard stompClient={stompClient} />   
      </div> 
      <div>
        <ul className="credList">
          <li>
            <a href="https://www.flaticon.com/free-icons/bullets" title="bullets icons">Bullets icons created by Freepik - Flaticon</a>
          </li>
          <li>
            <a href="https://www.flaticon.com/free-icons/hunter" title="hunter icons">Hunter icons created by Freepik - Flaticon</a>
          </li>
          <li>
            <a href="https://www.flaticon.com/free-icons/spooky" title="spooky icons">Spooky icons created by Freepik - Flaticon</a>
          </li>
          <li>
            <a href="https://www.flaticon.com/free-icons/viking" title="viking icons">Viking icons created by Freepik - Flaticon</a>
          </li>
          <li>
            <a href="https://www.flaticon.com/free-icons/witch" title="witch icons">Witch icons created by Funkrataii - Flaticon</a>
          </li>
        </ul>
      </div>
    </> 
  )
}

export default App
