import { Client } from '@stomp/stompjs'
import { useEffect, useRef, useState } from 'react'

interface Props {
    stompClient: Client | null
    localPlayer: string | null
    count: number
    playersList: Player[]
    updateButtons: (value: boolean) => void
    isActive: boolean
  }
  
  interface Player {
    username : string
    playerNumber : number
    shooter : boolean
    colour : string
    x: number,
    y: number,
    active : boolean,
    score : number
  }

  interface Bullet {
    x: number
    y: number
    count: number
  }

function PlayerButtons(props: Props) {

    const [players, setPlayers] = useState<Player[]>([]);
    const ceasefire = useRef(false);

    useEffect(() => {
        if (props.stompClient) {
            const subscription = props.stompClient.subscribe("/destroy/player-registration", (message) => {
            const playerList = JSON.parse(message.body);
            setPlayers(playerList); 
        });
            const subscriptionPlayers = props.stompClient.subscribe("/destroy/players", (message) => {
            const playerList = JSON.parse(message.body);
            setPlayers(playerList); 
        });
        
        return () => {
            subscription?.unsubscribe();
            subscriptionPlayers?.unsubscribe();
        };
        }
    }, [props.stompClient])

    useEffect(() => {
        if (props.count == 0) {
            props.updateButtons(true)
        } 
    }, [props.count])

    useEffect(() => {
      players.map((player) => {
         if (player.username == props.localPlayer && player.active === false) {
            props.updateButtons(false)    
         }
      })
    })

    function moveUp(): void {
        const clonePlayerList = [...players]
        if (props.localPlayer) {
            for (let player of clonePlayerList) {
                if (props.localPlayer && props.localPlayer === player.username && player.y >= 1) {
                    player.y -= 1
                    setPlayers(clonePlayerList)
                    sendUpdatedPlayerMovement()
                }
            }
        }
    }

    function moveDown() {
        const clonePlayerList = [...players]
        if (props.localPlayer) {
            for (let player of clonePlayerList) {
                if (props.localPlayer && props.localPlayer === player.username && player.y <= 18) {
                    player.y += 1
                    setPlayers(clonePlayerList)
                    sendUpdatedPlayerMovement()
                }
            }
        }
    }

    function sendUpdatedPlayerMovement() {
        if (props.stompClient) {
            for(const player of players) {
              if(player.username === props.localPlayer) {
                props.stompClient.publish({
                    destination: "/app/update-player-movement",
                    body: JSON.stringify(player)
                });
                break;
              }
            }
    
        } else {
            console.log("no stomp client")
        }
    }

    function fire(xNew: number, yNew: number): void {
        
        if (!ceasefire.current) {
            const newBullet: Bullet = {x: xNew + 1, y: yNew, count: 19}
    
            if (props.stompClient) {
                props.stompClient.publish({
                    destination: "/app/new-bullet",
                    body: JSON.stringify(newBullet),
                    headers: {
                        'ack': 'client-individual'
                      }
                })
            } else {
                console.log("no stomp client")
            }
            ceasefire.current = true
            setTimeout(()=>{
                ceasefire.current = false
            }, 300)
        }
        
    }

    function fireBullet(): void {
        
        if (props.localPlayer) {
            const player = players.find(p => p.username === props.localPlayer);
            if (player) {
                fire(player.x, player.y);
            }
        }
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!props.isActive) return;

            switch (event.key) {
                case 'ArrowUp':
                    event.preventDefault()
                    moveUp();
                    break;
                case 'ArrowDown':
                    event.preventDefault()
                    moveDown();
                    break;
                case ' ':
                    event.preventDefault()
                    fireBullet();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [props.isActive, players]);


  return (
    <div>
        { players.map((player) => (
            props.localPlayer == player.username && player.shooter == true ? <button type='button' key={"shoot"} disabled={!props.isActive} onClick={() => fire(player.x, player.y)}>Fire</button> : null ))}
        <button type='button' key={"up"} disabled={!props.isActive} onClick={() => moveUp()}>Up</button>
        <button type='button' key={"down"} disabled={!props.isActive} onClick={() => moveDown()}>Down</button>
    </div>
  )
}

export default PlayerButtons