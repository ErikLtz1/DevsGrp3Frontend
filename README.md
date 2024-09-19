# Destroy Game Client

## Overview

This repository contains the client-side implementation for the **Destroy** game. The client interacts with the server using WebSockets (STOMP) to handle player movements, update scores, and manage game states. This project is developed as part of a school project. The server can be found at https://github.com/ErikLtz1/backenddDev3

## Developers

- D-Hankin
- brycom
- ErikLtz1
- Samback92

# Destroy Game Rules

1\. **Objective**: Eliminate other players by hitting them with bullets.\
2\. **Player Movement**: Players move on the y-axis in the playing field grid using the buttons or keyboard.\
3\. **Round Countdown**: A timer counts down during rounds, 15 seconds per round.
4\. **Rounds**: The game is played in 4 rounds, where each player takes turns in being the shooter. At the end of each round, scores are updated.\
5\. **Scoring**: Players earn points for successfully hitting other players with bullets or for surviving the round.\
6\. **Winning**: The player with the most points at the end of the game wins.\
7\. **Round Countdown**: A timer counts down during rounds; when it reaches zero, the round ends.\

## Features

- **Real-Time Player Updates**: Receives updates on player movements, scores, and game states via WebSocket.\
- **Bullet Handling**: Manages and updates the bullet list in real-time.\
- **Round Management**: Handles the countdown and transitions between game rounds.\
- **Confetti Animation**: Displays confetti when a player wins a round.\
- **Dynamic Grid**: Displays a grid where players and bullets are represented visually.

## Setup

1\. **Clone the repository:**\
   ```bash\
   git clone <repository-url>\
   ```

2\. **Navigate to the project directory:**\
   ```bash\
   cd <project-directory>\
   ```

3\. **Install dependencies:**\
   ```bash\
   npm install\
   ```

4\. **Start the development server:**\
   ```bash\
   npm run dev\
   ```

5\. **Open your browser and navigate to the allocated port**

## Configuration

Ensure that the STOMP client is configured with the correct WebSocket endpoint in the `stompClient` prop.

## How It Works

- **WebSocket Subscriptions**: The client subscribes to various STOMP endpoints to receive updates about players, bullets, and game state.\
- **Game Mechanics**: Manages game countdowns, bullet movements, and player interactions.\
- **Round and Game End**: Handles the end of each round and determines the winner based on player scores.

## License

This project is a school project and is not intended for commercial use.
