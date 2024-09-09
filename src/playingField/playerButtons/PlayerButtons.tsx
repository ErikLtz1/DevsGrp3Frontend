import { Client } from '@stomp/stompjs'
import { useEffect, useState } from 'react'

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

    useEffect(() => {
        if (props.stompClient) {
            const subscription = props.stompClient.subscribe("/destroy/players", (message) => {
            const playerList = JSON.parse(message.body);
            setPlayers(playerList); 
        });
        
        return () => {
            subscription.unsubscribe();
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
        const clonePlayerList = players
        if (props.localPlayer) {
            for (let player of clonePlayerList) {
                if (props.localPlayer && props.localPlayer === player.username && player.y >= 1) {
                    player.y -= 1
                    setPlayers(clonePlayerList)
                    sendUpdatedPlayerList()
                }
            }
        } else {
            console.log("no player")
        }
    }

    function moveDown(): void {
        
        if (props.localPlayer) {
            for (let player of players) {
                if (props.localPlayer && props.localPlayer === player.username && player.y <= 18) {
                    player.y += 1
                    sendUpdatedPlayerList()
                }
            }
        }
    }

    function sendUpdatedPlayerList() {
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
        const newBullet: Bullet = {x: xNew + 1, y: yNew, count: 19}

        if (props.stompClient) {
            props.stompClient.publish({
                destination: "/app/new-bullet",
                body: JSON.stringify(newBullet)
            })
        } else {
            console.log("no stomp client")
        }
    }

  return (
    <div>
        { players.map((player) => (
            props.localPlayer == player.username && player.shooter == true ? <button type='button' disabled={!props.isActive} onClick={() => fire(player.x, player.y)}>Fire</button> : null ))}
        <button type='button' disabled={!props.isActive} onClick={() => moveUp()}>Up</button>
        <button type='button' disabled={!props.isActive} onClick={() => moveDown()}>Down</button>
    </div>
  )
}

export default PlayerButtons

