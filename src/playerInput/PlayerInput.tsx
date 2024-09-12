import { Client } from '@stomp/stompjs';
import { useState } from 'react';
import "./playerInput.css";

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
          body: username
        });
        sessionStorage.setItem("username", username)
        setUsername("");
      } else {
        console.log("no stomp client");  
      }
    }

  return (
    <>
    { !sessionStorage.getItem("username") ? 
      <form className='inputForm' onSubmit={sendNewPlayer}>
        <label>Enter your username:</label>
        <input className='usernameInput' value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <button type='submit'>Join Game</button>
    </form> 
    : 
    null }
    </>
  )
}

export default PlayerInput