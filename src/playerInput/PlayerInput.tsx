import { Client } from '@stomp/stompjs';
import { useState } from 'react';
import SockJS from 'sockjs-client';

// interface Player {
//     username : string
//     playerNumber : number
//     shooter : boolean
//     colour : string
//     position : string
//     active : boolean
//     score : number
//   }

function PlayerInput() {

    const [username, setUsername] = useState<string>("")
    const [/*stompClient*/, setStompClient] = useState<Client | null>(null)

    const submitNewPlayer = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const socket = new SockJS("http://localhost:8080/connect");
        const client = new Client({
          webSocketFactory: () => socket as any,
          reconnectDelay: 5000,
          onConnect: () => {
            //sendNewPlayer()
            console.log("Connection established");
          },
          onDisconnect: () => {
            console.log("disconnected from websocket")
          }
        });

        client.activate();
        setStompClient(client);
    }

  return (
    <form onSubmit={submitNewPlayer}>
        <label>Enter your username:</label>
        <input className='usernameInput' value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <button type='submit'>Join Game</button>
    </form>
  )
}

export default PlayerInput