// * * DECLARATION * * - - - - - - - - - - - - - - - - - - - 

var content         = document.querySelector("#tictactoe");
var points          = document.querySelector("#points");

var cells           = document.querySelectorAll(".cell");
var playerDOM       = document.querySelectorAll(".player");

var hoverDiv        = document.querySelector(".hoverdiv");
var actions         = document.querySelector("#actions");
var newGameButton   = document.querySelector("#newgame");
var newRoundButton  = document.querySelector("#newround");

var possibilities   = [
  [1,2,3],
  [4,5,6],
  [7,8,9],

  [1,4,7],
  [2,5,8],
  [3,6,9],

  [1,5,9],
  [3,5,7]
];

var clickedCells    = [];
var selectedValues  = [ [], [] ];
var matches         = [ [], [] ];

var winCombination  = [];
var winner = undefined;

var message;

var players = [
  {
    name: "Human",
    points: 0
  },
  {
    name: "PC",
    points: 0
  }
];


var turn 		= 1;
var round 	= 1;

var mode = "singlePlayer";
var difficult 	= "hard";

// * * HELPER FUNCTIONS * * - - - - - - - - - - - - - - - - -
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function excludeValuesFromArray(userArray, templateArray, returnSameValues)
{
  var arr = [];

  for(var i = 0; i < templateArray.length; i++)
  {
    if(returnSameValues === false)
    {
      if(userArray.indexOf(templateArray[i]) === -1)
      {
        arr.push(templateArray[i]);
      }
    }
      else
      {
        if(userArray.indexOf(templateArray[i]) !== -1)
        {
          arr.push(templateArray[i]);
        }            
      }
  }

  return arr;
}

function random(min, max)
{

  var num = Math.floor(Math.random() * (max - min + 1)) + min;

  return num;
}

// * * CONTROL GAME STATUS FUNCTIONS * * - - - - - - - - - - - - - - - - - 
function checkIfAlreadyClicked(cell)
{
  if(clickedCells.indexOf(cell) !== -1)
  {
    return true;
  }
    else
    {
      return false;
    }
}

function checkGameStatus()
{
  for(var i = 0; i < matches[turn].length; i++)
  {
    // do we have a winner?
    if(matches[turn][i].length === 3)
    {
      winCombination = matches[turn][i];

      activateWinCombination(winCombination);

      winner = turn;

      // points
      players[turn].points += 1; 
      updatePoints();

      alertBlock("win");

      return true;
    }
  }

  if(clickedCells.length === 9)
  {
    alertBlock("draw");
    return false;
  }

}

// * * IN-GAME FUNCTIONS * * - - - - - - - - - - - - - - - - - - - - - -
  function changeTurn()
  {

    if(turn === 0)
    {
      turn = 1
    }
      else
      {
        turn = 0;
      }

    activateTurn();
  }

  function updateArrays(num)
  {
    // insert clicked cell in generals array
    clickedCells.push(num);

    // insert clicked cell in personal player array
    selectedValues[turn].push(num);

    // insert cell in all possible matches
    for(var i = 0; i < possibilities.length; i++)
    {
      if(possibilities[i].indexOf(num) !== -1)
      {
        matches[turn][i].push(num);
      }
    }
  }

  function updatePoints()
  {
    // set players points
    points.innerHTML = players[0].points + " - " + players[1].points;
  }


// * * GAME STATUS FUNCTIONS * * - - - - - - - - - - - - - - - - - - - - - -

  function resetGame()
  {
    // remember! this function does not resetting the current turn!
    // remember! this function does not resetting points!
    // remember! this function does resetting all possibilities!

    clickedCells    = [];
    selectedValues  = [ [], [] ];
    matches         = [ [], [] ];

    winCombination  = [];
    winner          = undefined;

    message         = undefined;
    
    // random possibilities
    shuffle(possibilities);

    // clear all cells
    for(var i = 0; i < cells.length; i++)
    {
      cells[i].removeAttribute("class");
      cells[i].classList.add("cell");
    }
  }

  function newRound()
  {
    resetGame();

    init();

    // pc do the first move 
    if(mode === "singlePlayer" && turn === 1)
    {
      pcBrain();
    }

    round++;

  }

  function newGame()
  {
    resetGame();

    for(var i = 0; i < players.length; i++)
    {
      players[i].points = 0;
    }

    turn = 0;
    round = 0;

    init();
  }

// * * CSS AND OTHERS * * - - - - - - - - - - - - - - - - - - - - - -

  function highlightCell(element)
  {
    element.classList.add("active");
  }

  function activateTurn()
  {
    // delete .active class
    for(var i = 0, n = players.length; i < n; i++)
    {
      playerDOM[i].classList.remove("active");
    }

    // activate current turn player
    playerDOM[turn].classList.add("active");
  }

  function activateCell(element)
  {
    element.classList.add("player-" + turn);
  }

  function activateWinCombination(winCombination)
  {
    // loop through win combination
    for(var i = 0; i < winCombination.length; i++)
    {
      // highlight the cell
      highlightCell(cells[(winCombination[i] - 1)]);
    }
  }

  function hideElement(element)
  {
    element.classList.remove("show");
    element.classList.add("hidden");
  }

  function showElement(element)
  {
    element.classList.remove("hidden");
    element.classList.add("show");
  }

  function alertBlock(string)
  {
    if(string !== false)
    {
      if(string === "win")
      {
        message = players[winner].name + " wins!";
      }
        else if(string === "draw")
        {
          message = "Draw";
        }  
    }

    // update text content
    actions.children[0].innerHTML = message;

    if(hoverDiv.classList[1] === "hidden" || undefined)
    {
      showElement(hoverDiv);
    }
      else
      {
        hideElement(hoverDiv);
      }
  }

// * * PC BRAIN  * * - - - - - - - - - - - - - - - - - - - - - -

  function randomMove()
  {
    var bestRandomMove;

    do
    {
      bestRandomMove = random(1,9);

      if(clickedCells.indexOf(bestRandomMove) === -1)
      {
        return bestRandomMove;
      }
    }
    while(clickedCells.indexOf(bestRandomMove) !== -1);

  }

  function pcFirstMove()
  {
    var firstMove;

    // First PC move
    if(selectedValues[1].length === 0)
    {
      if(clickedCells.indexOf(5) !== -1 || difficult !== "hard")
      {
        firstMove = randomMove();
      }
        else
        {
          firstMove = 5;
        }

      return firstMove;
    }
      else
      {
        return false;
      }
  }

  function detectBestAttackMove()
  {
    var bestAttackMove;

    // console.log("ATTACK!");

    // very first move
    if(pcFirstMove() !== false)
    {
      bestAttackMove = pcFirstMove();
      // console.log("first move");
      return bestAttackMove;
    }


    // win the game
    for(var i = 0; i < matches[1].length; i++)
    {
      if(matches[1][i].length === 2)
      {
        bestAttackMove = excludeValuesFromArray(matches[1][i], possibilities[i], false)[0];

        // check if the cell has not already been clicked
        if(clickedCells.indexOf(bestAttackMove) === -1)
        {
          // console.log("vinco");
          return bestAttackMove;
        }
      }
    }

    // return to defense
    for(var i = 0; i < matches[0].length; i++)
    {
      if(matches[0][i].length === 2)
      {
        var test = excludeValuesFromArray(matches[0][i], possibilities[i], false)[0];

        if(clickedCells.indexOf(test) === -1)
        {
          // console.log("return to defense");
          return false;
        }
      }
    }

    // make 2 matches
    for(var i = 0; i < matches[1].length; i++)
    {
      if(matches[1][i].length === 1)
      {
        bestAttackMove = excludeValuesFromArray(matches[1][i], possibilities[i], false)[0];
        
        // check if combination is blocked
        // check if the cell has not already been clicked
        if(clickedCells.indexOf(bestAttackMove) === -1 && matches[0][i].length !== 1)
        {
          // console.log("2 matches");
          return bestAttackMove;
        }
      }
    }

    if(clickedCells.length !== 9)
    {
      bestAttackMove = randomMove();
      return bestAttackMove;
    }

  }

  function detectBestDefenseMove()
  {
    var bestDefenseMove;

    // console.log("DEFENSE!");

    for(var i = 0; i < matches[0].length; i++)
    {
      if(matches[0][i].length === 2)
      {
        bestDefenseMove = excludeValuesFromArray(matches[0][i], possibilities[i], false)[0];

        // console.log(bestDefenseMove);
        
        // only if is not already defended (clicked cell)
        if(clickedCells.indexOf(bestDefenseMove) === -1)
        {
          // console.log("blocking the combination with cell: ", bestDefenseMove);
          return bestDefenseMove;
        }
          else {}
      }
    }
  }

  function detectBestMove()
  {
    var bestMove = detectBestAttackMove();

    if(bestMove === false)
    {
      bestMove = detectBestDefenseMove();
    }

    return bestMove;
  }

  function pcBrain()
  {
    var bestMove = detectBestMove();
		
    if(clickedCells.length === 9)
    {
      return true;
    }

    if(winner === 1)
    {
      return true;
    }

    // update arrays
    updateArrays(bestMove);

    // activate current clicked cell
    activateCell(cells[bestMove-1]);

    // check if pc wins
    checkGameStatus();

    // change turn
    if(winner === undefined)
    {
      changeTurn();
    }
  }

// * * EVENTS  * * - - - - - - - - - - - - - - - - - - - - - -
  newGameButton.addEventListener(
    "click",
    function()
    {
      newGame();
    }
  );

  newRoundButton.addEventListener(
    "click",
    function()
    {
      newRound();
    }
  );

// * * MAKE IT WORK * * - - - - - - - - - - - - - - - - - - - - - -

  function init()
  {
    // activate all cells
    for(var i = 0; i < cells.length; i++)
    {
      cells[i].addEventListener
      (
        "click",
        handleClick
      );
    }

    // set player names
    for(var i = 0; i < playerDOM.length; i++)
    {
      playerDOM[i].children[1].innerHTML = players[i].name;
    }

    // change points
    updatePoints();

    // activate the turn first
    activateTurn();

    // prevent undefined in future
    for(var i = 0; i < possibilities.length; i++)
    {
      if(matches[0][i] === undefined)
      {
        matches[0][i] = [];
      }

      if(matches[1][i] === undefined)
      {
        matches[1][i] = [];
      }
    }

    if(actions.classList[0] !== "hidden" || undefined)
    {
      hideElement(hoverDiv);
    }

    if (turn === 1) 
    {
      pcBrain();
    }

  }

  function handleClick()
  {
    var num = parseInt(this.id.replace("cell-", ""));

    // block the script
    if(checkIfAlreadyClicked(num) === true || winner !== undefined)
    {
      return true;
    }

    // update arrays
    updateArrays(num);

    // activate current clicked cell
    activateCell(this);

    checkGameStatus();

    if(winner === 0)
    {
      return true;
    }

    // change turn
    changeTurn();

    if(mode === "singlePlayer")
    {
      pcBrain();
    }
  }

  init();