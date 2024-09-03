import "./globals"
import './App.css'
import Header from "./header/Header"
import PlayerInput from "./playerInput/PlayerInput"
import PlayingField from "./playingField/PlayingField"
import Scoreboard from "./scoreboard/Scoreboard"
import PlayerDisplay from "./playerDisplay/PlayerDisplay"

function App() {

  return (
    <>
      <h1>Game Time</h1>
      <Header /> 
      <PlayerInput /> 
      <PlayerDisplay /> 
      <PlayingField /> 
      <Scoreboard /> 
    </> 
  )
}

export default App
