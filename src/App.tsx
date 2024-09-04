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
      <Header /> 
      <PlayerInput /> 
      <PlayerDisplay />
      <div className="fieldAndScoreboardDiv">
        <PlayingField /> 
        <Scoreboard />   
      </div> 
    </> 
  )
}

export default App
