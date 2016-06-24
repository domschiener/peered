contract TicTacToe {

}

contract Peered is TicTacToe {
  struct Player {
    address addr;
    // The balance
    uint balance;
  }

  struct Arbiter {
    address arbiter;
    uint[] movesPlayer1;
    uint[] movesPlayer2;
    uint[] allMoves;
    address decidedWinner;
  }

  struct Game {
    bytes32 id;
    Player player1;
    Player player2;
    // Type of Game (currently only TicTacToe)
    bytes32 type;
    bool completed;
    address winner;
    // The arbiters for the game in case of dispute. Can be multiple
    Arbiter[] arbiters;
  }

  mapping (bytes32 => Game) public games;

  function newGame(
    bytes32 _id,
    bytes32 _type,
    address[] arbiterAddr,

  ) returns (bool) {

  }
}


Two ways to use:
  - Either the person has a local node running
  - The person uses the server
  - Have idfferent trust levels for playing the game
  - One contract for each game type. But only one contract for the DAO

  Make this as a DAO. Peered will get 10% of all winnings. People can then make new proposals for what to use the funds on. e.g. add new games and so on
