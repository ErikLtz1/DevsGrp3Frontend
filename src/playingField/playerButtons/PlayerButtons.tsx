import { Client } from '@stomp/stompjs'
import { useEffect, useState } from 'react'

interface Props {
    stompClient: Client | null
    localPlayer: string | null
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
    const [isActive] = useState<boolean>(false);

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
        console.log("banana: ", props.localPlayer)
    }, [props.localPlayer])


    function moveUp(): void {

        if (props.localPlayer) {
            for (let player of players) {
                if (props.localPlayer && props.localPlayer === player.username && player.y >= 1) {
                    player.y -= 1
                    console.log(props.localPlayer, "up " + player.y)
                    console.log(players)
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
                    console.log(props.localPlayer, "down " + player.y)
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
        <button type='button' disabled={!isActive} onClick={() => moveUp()}>Up</button>
        <button type='button' disabled={!isActive} onClick={() => moveDown()}>Down</button>
    </div>
  )
}

export default PlayerButtons

