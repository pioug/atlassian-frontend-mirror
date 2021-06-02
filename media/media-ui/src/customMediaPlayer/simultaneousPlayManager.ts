export interface Pausable {
  pause: () => any;
}

const players: Pausable[] = [];

const addPlayer = (player: Pausable) => players.push(player);

const removePlayer = (player: Pausable) => {
  const playerIndex = players.indexOf(player);
  if (playerIndex > -1) {
    players.splice(playerIndex, 1);
  }
};

export default {
  pauseOthers: (player: Pausable) => {
    players.forEach((otherPlayer) => {
      if (otherPlayer !== player) {
        otherPlayer.pause();
      }
    });
  },
  subscribe: (player: Pausable) => {
    if (players.indexOf(player) === -1) {
      addPlayer(player);
    }
  },
  unsubscribe: (player: Pausable) => {
    removePlayer(player);
  },
};
