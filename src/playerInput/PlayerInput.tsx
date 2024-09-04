import { Client } from '@stomp/stompjs';
import { useState } from 'react';

// interface Player {
//     username : string
//     playerNumber : number
//     shooter : boolean
//     colour : string
//     x: number,
//     y: number,
//     active : boolean
//     score : number
//   }

  interface Props {
    stompClient: Client | null
  }

function PlayerInput(props: Props) {

    const [username, setUsername] = useState<string>("")

    const sendNewPlayer = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      if (props.stompClient) {
        props.stompClient.publish({
          destination: "/app/new-player",
          body: JSON.stringify(username)
        });
      } else {
        console.log("no stomp client");
        
      }
    }

  return (
    <form onSubmit={sendNewPlayer}>
        <label>Enter your username:</label>
        <input className='usernameInput' value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <button type='submit'>Join Game</button>
    </form>
  )
}

export default PlayerInput