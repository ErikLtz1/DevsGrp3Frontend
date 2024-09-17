import { useEffect, useState } from "react"
import "./playingField.css"
import { Client } from "@stomp/stompjs"
import PlayerButtons from "./playerButtons/PlayerButtons"
import { startConfetti, stopConfetti } from "./confetti.ts"

interface Cell {
  x: number
  y: number
}

interface Bullet {
  x: number
  y: number
  count: number
}

interface Props {
  stompClient: Client | null
}

interface Player {
  username : string
  playerNumber : number
  shooter : boolean
  colour : string
  x: number,
  y: number,
  active : boolean
  score : number
}

function PlayingField(props: Props) {

  const [gridList, setGridList] = useState<Cell[]>([])
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStart, setGameStart] = useState<boolean>(false)
  const [localPlayer, setLocalPlayer] = useState<string | null>("");
  const [count, setCount] = useState<number>(5);
  const [bulletList, setBulletList] = useState<Bullet[]>([]);
  const [roundCount, setRoundCount] = useState<number>(15);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [roundNumber, setRoundNumber] = useState<number>(0);
  const [winner, setWinner] = useState<string>("")
  const [explosion, setExplosion] = useState<string>("")

  useEffect(() => {
    if (props.stompClient) {
        const subscription = props.stompClient.subscribe("/destroy/players", (message) => {
          
          const playerList = JSON.parse(message.body);
          setPlayers(playerList);     
        });
        const bulletSubscription = props.stompClient?.subscribe("/destroy/bullets", (message) => {
          const bullet = JSON.parse(message.body);
          setBulletList((prevBullets) => [...prevBullets, bullet]);
        });
        const playerDisplaySubscription = props.stompClient.subscribe("/destroy/player-registration", (message) => {
          
          const playerDisplayList = JSON.parse(message.body);
          gameStartFunction(playerDisplayList)
          setPlayers(playerDisplayList);
          setLocalPlayer(sessionStorage.getItem("username"))
        })
        const newGameSubscription = props.stompClient?.subscribe("/destroy/new-game", (message) => {
          
          setPlayers(JSON.parse(message.body));
          setRoundNumber(0)
          roundEnd()
        });
        const scoreSubscription = props.stompClient.subscribe("/destroy/player-scores", (message) => {
          
          setPlayers(JSON.parse(message.body)); 
        });
        const finalScoreConfirmationSubscription = props.stompClient?.subscribe("/destroy/final-score-confirmation", (message) => {
          
          if (message.body.length > 0) {
            console.log("Players at final score confirmation:", players);
            findWinner(JSON.parse(message.body));
          }
        });

      return () => {
        subscription?.unsubscribe();
        bulletSubscription?.unsubscribe();
        playerDisplaySubscription?.unsubscribe();
        newGameSubscription?.unsubscribe();
        scoreSubscription?.unsubscribe();
        finalScoreConfirmationSubscription?.unsubscribe();
      };
    }

  }, [props.stompClient])

  useEffect (() => {
    createGrid()
  }, [])
  
  const gameStartFunction = (players: Player[]) => {
    if (players.length == 4) {
      setGameStart(true)
    } 
  }

  useEffect(() => {
    const bulletMovementInterval = setInterval(() => {
      setBulletList((prevBulletList) =>
        prevBulletList
          .map((bullet) => {
            let hitPlayer = false;
            
            const clonePlayers = players.map((player: Player) => {
              return {...player}
            })
  
            for (let player of clonePlayers) {
              if (bullet.x === player.x && bullet.y === player.y && player.active === true) {
                getExplosion()
                hitPlayer = true;
                player.active = false;


                clonePlayers.forEach((shooter) => {
                  if (shooter.shooter === true) {
                    shooter.score += 1;
                    sendUpdatedPlayerScore(shooter)
                  }
                })
                sendUpdatedPlayerActive(player)

                break;  
              }
            }
  
            if (hitPlayer) {
              return { ...bullet, count: 0 }; 
            }
  
            return {
              ...bullet,
              x: bullet.x + 1,  
              count: bullet.count - 1,  
            };
          })
          .filter((bullet) => bullet.count > 0) 
      );
    }, 100); 
  
    return () => clearInterval(bulletMovementInterval); 
  }, [bulletList, players]);
  
  useEffect (() => {
    if (gameStart) {
      setRoundNumber((prevRoundNumber) => prevRoundNumber + 1)
    }
  }, [gameStart])

  useEffect(() => {
    if (roundNumber < 5) {
      if (count > 0 && gameStart) {
        const timer = setTimeout(() => setCount(count - 1), 1000);
  
        return () => clearTimeout(timer);
      }
    }
  }, [count, gameStart]);

  useEffect(() => {
    if (roundNumber < 5) {
      if (count === 0) {
        const roundTimer = setTimeout(() => setRoundCount(roundCount - 1), 1000)
  
        if (roundCount === 0) {
          roundEnd()
        }
  
        return () => clearTimeout(roundTimer)
      }
    }
  }, [count, roundCount])

  const createGrid = () => {
    const gridSize = 20

    const buildGridList = [];

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        buildGridList.push({x, y})
      }
    }

    setGridList(buildGridList)
  }

  useEffect (() => {
    console.log("winner updated", winner)
    if (winner !== "") {
      startConfetti()
      setTimeout(() => {stopConfetti(), setWinner(""), newGame()}, 7000)
    }
  }, [winner])

  const getExplosion = () => {
    setExplosion(`url("/explosion.gif")`)
    setTimeout(() => {setExplosion("")}, 1500)
  }

  function getColour(x: number, y: number) {

    if (players.length === 4) {
      const colour = players.find((player) => player.x === x && player.y === y && player.active === true)?.colour
      
      if (colour) {
        return {
          backgroundImage: `url(${colour})`,
          backgroundSize: "cover",
          backgroundColor: "darkgrey",
          width: "25px", 
          height: "25px"
        }
      } else if (players.find((player) => player.x === x && player.y === y && player.active === false)) {
        
        return {
          backgroundImage: explosion,
          backgroundSize: "cover",
          backgroundColor: "darkgrey",
          width: "25px", 
          height: "25px"
        }
      } else if (checkForBullet(x, y)) {
        return {
          backgroundImage: `url("/bullet.png")`,
          backgroundSize: "cover",
          backgroundColor: "darkgrey",
          width: "25px", 
          height: "25px"
        }
      } else {
        return { 
          backgroundImage: '',
          backgroundSize: "",
          backgroundColor: "darkgrey",
          width: "25px", 
          height: "25px"
        }
      }
    }
  }
  
  function checkForBullet(x: number, y: number) {
    return bulletList.some((bullet) => bullet.x === x && bullet.y === y);
  }

  function sendUpdatedPlayerActive(player: Player) {

    if (props.stompClient) {      
      props.stompClient.publish({
          destination: "/app/update-player-active",
          body: JSON.stringify(player),
          headers: {
            'ack': 'client-individual'
          }
      })
    } else {
      console.log("no stomp client")
    }
  }

  function sendUpdatedPlayerScore(player: Player) {

    if (props.stompClient) {      
      props.stompClient.publish({
          destination: "/app/update-player-score",
          body: JSON.stringify(player),
          headers: {
            'ack': 'client-individual'
          }
      })
    } else {
      console.log("no stomp client")
    }
  }
  
  function roundEnd() {
    if (roundNumber < 4) {
        setGameStart(false)
        setIsActive(false)
        setBulletList([])
        setRoundCount(15)
        
        const clonePlayers = players.map((player: Player) => {
          return {...player}
        })
        
        if (props.stompClient) {
          for(const player of clonePlayers) {
            if(player.username === localPlayer) {
              
              if(player.active === true && !player.shooter && roundNumber !== 0) {
                player.score += 1;
                sendUpdatedPlayerScore(player);
              }

              props.stompClient.publish({
                destination: "/app/new-round",
                body: JSON.stringify(player)
              })
              break;
            }
          }

          /****** ROUND START NOW WAITS FOR ALL PLAYERS TO BE PROCESSED BY SERVER ******/
          const newRoundSubscription = props.stompClient.subscribe("/destroy/round-start-confirmation", (message) => {
            const confirmation = message.body;
            if (confirmation === "Round start") {
              setTimeout(() => {
                setCount(5);
                setGameStart(true);
                newRoundSubscription.unsubscribe();
              }, 1000);
            }
          });
        } else {
          console.log("no stomp client")
        }
        
    } else {
      console.log("Ending round, current players: ", players);
      setGameStart(false)
      setIsActive(false)
      setBulletList([])
      setCount(0)
      setRoundCount(0)
      const clonePlayers = players.map((player: Player) => {
        return {...player}
      })
      if (props.stompClient) {
        for(const player of clonePlayers) {
          if(player.username === localPlayer) {
  
            if(player.active === true && !player.shooter) {
              player.score += 1
              sendUpdatedPlayerScore(player)
            }
            if(!player.shooter) {
              sendFinalScoreConfirmation(player.username)
            }
            
          }
        }
        
      } else {
        console.log("no stomp client")
      }
    }
  }

  /****** WINNER NOW WAITS FOR ALL PLAYERS TO BE PROCESSED BY SERVER ******/
  const findWinner = (finalPlayerList: Player[]) => {
    console.log("Finding winner...");
    console.log("Current players state: ", players);
  
    let highestScoreNames: string[] = []; 
    let highscore = 0;
  
    for(const player of finalPlayerList) {
      console.log("Checking player: ", player.username, "Score: ", player.score);
  
      if (player.score > highscore) {
        highscore = player.score;
        highestScoreNames = [player.username];
      } else if (player.score === highscore) {
        highestScoreNames.push(player.username);
      }
    }
    
    const highestScoreString = highestScoreNames.join(" and ");
    console.log("Winners: ", highestScoreString);
    setWinner(highestScoreString);
  }

  const updateButtons = (value: boolean) => {
    setIsActive(value)
  }

  const newGame = () => {
    if(props.stompClient) {
      props.stompClient.publish({
        destination: "/app/new-game",
        body: JSON.stringify("new game")
      })
    }
  }
  
  function sendFinalScoreConfirmation(username: string) {
    if (props.stompClient) {
      props.stompClient.publish({
        destination: "/app/final-score",
        body: JSON.stringify(username)
      })
    }
  }

  return (
    <div className="playingFieldOuterDiv">
      <h2>Shooting Gallery</h2>
        { gameStart && roundNumber < 5 ? <div className="countdown">
                        <h2>{count > 0 ? "Round " + roundNumber + "\nbegins in " + count + " seconds." : "Destroy!"}</h2>
                        <h2>{ count === 0 ? "Time left: " + roundCount : null }</h2> 
                      </div> : null}
        { winner !== "" ? <div className="winnerDiv"><h1 className="winner" >{"The Winner is " + winner + "\nA new game will start in 5 seconds!"}</h1> </div> : null}
        <div className="playingFieldDiv">
          { gridList.map((cell: Cell, index) => (
            <div 
              key={index}
              id={cell.x + ", " + cell.y}
              className="cell"
              style={getColour(cell.x, cell.y)}
              data-x = {cell.x}
              data-y = {cell.y}
            >
            </div>
          ))}
      </div>
        <PlayerButtons stompClient={props.stompClient} localPlayer={localPlayer} count={count} playersList={players} updateButtons = {updateButtons} isActive = {isActive}/>
    </div>
  )
}

export default PlayingField


