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
       
    const socket = new SockJS("http://localhost:8080/connect");
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

  return (
    <>
      <Header /> 
      <PlayerInput stompClient={stompClient} /> 
      <PlayerDisplay stompClient={stompClient} />
      <div className="fieldAndScoreboardDiv">
        <PlayingField /> 
        <Scoreboard stompClient={stompClient}/>   
      </div> 
    </> 
  )
}

export default App
