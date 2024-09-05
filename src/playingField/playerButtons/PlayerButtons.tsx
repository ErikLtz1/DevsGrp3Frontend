import { Client } from '@stomp/stompjs'
import { useEffect, useState } from 'react'

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
    active : boolean,
    score : number
  }

function PlayerButtons(props: Props) {

    const [players, setPlayers] = useState<Player[]>([]);
    const [localPlayer, setLocalPlayer] = useState<string | null>("");

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
        setLocalPlayer(sessionStorage.getItem("username"))
    }, [players])


    function moveUp(): void {

        if (localPlayer) {
            for (let player of players) {
                if (localPlayer && localPlayer === player.username && player.y >= 1) {
                    player.y -= 1
                    console.log(localPlayer, "up " + player.y)
                    console.log(players)
                    sendUpdatedPlayerList()
                }
            }
        } else {
            console.log("no player")
        }
    }

    function moveDown(): void {

        if (localPlayer) {
            for (let player of players) {
                if (localPlayer && localPlayer === player.username && player.y <= 18) {
                    player.y += 1
                    console.log(localPlayer, "down " + player.y)
                    sendUpdatedPlayerList()
                }
            }
        }
    }

    function sendUpdatedPlayerList() {
        if (props.stompClient) {
            props.stompClient.publish({
                destination: "/app/update-player-movement",
                body: JSON.stringify(players)
            });
        } else {
            console.log("no stomp client")
        }
    }


  return (
    <div>
        <button type='button' onClick={() => moveUp()}>Up</button>
        <button type='button' onClick={() => moveDown()}>Down</button>
    </div>
  )
}

export default PlayerButtons

