illegalMove = function(gameMove, chosenCell, gamesData) {
  //  Rigorous error checking, in case someone tries to be smart and enter game
  //  moves via the console

  //
  //  gameMove does not fit schema
  //
  if (chosenCell.length !== 6)
    return true;

  if (chosenCell.slice(0, 5) !== "cell-")
    return true;

  if (!parseInt(chosenCell[5]))
    return true;

  //
  //  gameMove is already played
  //  triple check (player moves, opponent moves, shared moves)
  //
  if (!gamesData.allMoves)
    return false;

  if (gamesData.allMoves.indexOf(gameMove) > -1)
    return true;

  if (gamesData.myMoves) {
    if (gamesData.myMoves.indexOf(gameMove) > -1)
      return true;
  }

  if (gamesData.opponentMoves) {
    if (gamesData.opponentMoves.indexOf(gameMove) > -1)
      return true;
  }
}

hasPlayerWon = function(gameMove, playerMoves) {
  //
  // TODO: Find a better way to determine the winner
  //  This is pretty inefficient
  //
  var possibilities = {
    0: {
      combo: [1,2,3],
      found: 0
    },
    1: {
      combo: [4,5,6],
      found: 0
    },
    2: {
      combo: [7,8,9],
      found: 0
    },
    3: {
      combo: [1,4,7],
      found: 0
    },
    4: {
      combo: [2,5,8],
      found: 0
    },
    5: {
      combo: [3,6,9],
      found: 0
    },
    6: {
      combo: [1,5,9],
      found: 0
    },
    7: {
      combo: [3,5,7],
      found: 0
    }
  }

  playerMoves.push(gameMove);

  if (playerMoves < 3)
    return false;

  var playerWon = false;
  // We iterate over all combinations to see if there is a match
  playerMoves.forEach(function(el) {
    for (var i = 0; i < 8; i++) {
      if (possibilities[i].combo.indexOf(el) > -1) {
        possibilities[i].found += 1;

        if (possibilities[i].found === 3) {
          playerWon = true;
        }
      }
    }
  });
  return playerWon;
}
