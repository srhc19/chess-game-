const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const width = 8;
let playerGo = "black";
// playerDisplay.textContent = "black";
let startPieces = localStorage.getItem("chessGameState");
console.log(JSON.parse(startPieces), "sssssssss");
if (!startPieces) {
  startPieces = [
    Rook,
    Knight,
    Bishop,
    Queen,
    King,
    Bishop,
    Knight,
    Rook,
    Pawn,
    Pawn,
    Pawn,
    Pawn,
    Pawn,
    Pawn,
    Pawn,
    Pawn,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    Pawn,
    Pawn,
    Pawn,
    Pawn,
    Pawn,
    Pawn,
    Pawn,
    Pawn,
    Rook,
    Knight,
    Bishop,
    Queen,
    King,
    Bishop,
    Knight,
    Rook,
  ];
} else {
  startPieces = JSON.parse(startPieces);
}
playerDisplay.textContent = playerGo;
function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = startPiece;
    square.firstChild?.setAttribute("draggable", true);
    square.setAttribute("square-id", i);
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "beige" : "brown");
    } else {
      square.classList.add(i % 2 === 0 ? "brown" : "beige");
    }

    if (i <= 15) {
      square.firstChild.firstChild.classList.add("black");
    }
    if (i >= 48) {
      square.firstChild.firstChild.classList.add("white");
    }
    gameBoard.append(square);
  });
}

createBoard();

const allsquare = document.querySelectorAll("#gameboard .square");

allsquare.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});
function saveGameState() {
  localStorage.setItem("chessGameState", JSON.stringify(startPieces));
  let sta = localStorage.getItem("chessGameState");
  console.log(JSON.parse(sta), "kkkkkkk");
}

let startPositionId;
let draggedElement;
function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute("square-id");

  draggedElement = e.target;
  draggedElement.setAttribute("removekey", "true");
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  let targetid = e.target.getAttribute("square-id");
  let draggedid = draggedElement.getAttribute("id");
  sendChessMove({ targetid, startPositionId, draggedid });

  saveGameState();
  e.stopPropagation();

  const correctGo = draggedElement.firstChild.classList.contains(playerGo);
  const taken = e.target.classList.contains("piece");

  const valid = checkIfValid(e.target);
  const opponentGo = playerGo === "white" ? "black" : "white";
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

  if (correctGo) {
    if (takenByOpponent && valid) {
      e.target.parentNode.append(draggedElement);

      e.target.remove();
      const svgElement = e.target.querySelector("svg");

      if (playerGo === "black") {
        changePlayer();
        document
          .getElementById("player1-conquered")
          .appendChild(svgElement.cloneNode(true));
      } else if (playerGo === "white") {
        changePlayer();
        document
          .getElementById("player2-conquered")
          .appendChild(svgElement.cloneNode(true));
      }

      return;
    }
    if (taken && !takenByOpponent) {
      infoDisplay.textContent = "you cannot go here";

      setTimeout(() => (infoDisplay.textContent = ""), 2000);
      return;
    }

    if (valid) {
      e.target.append(draggedElement);
      check();

      checkForWin();
      changePlayer();
      return;
    }
  }
  infoDisplay.textContent = "you cannot go here";
  setTimeout(() => (infoDisplay.textContent = ""), 2000);
  // e.target.append(draggedElement);
  // changePlayer();
}

function checkIfValid(target, Piece) {
  console.log(target, "target");
  const targetId =
    Number(target.getAttribute("square-id")) ||
    Number(target.parentNode.getAttribute("square-id"));

  const startId = Number(startPositionId);
  const piece = Piece ? Piece : draggedElement.id;
  console.log(piece);

  switch (piece) {
    case "pawn":
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
      if (
        (starterRow.includes(startId) && startId + width * 2 === targetId) ||
        (startId + width === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`)
            .firstChild) ||
        (startId + width - 1 === targetId &&
          document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width + 1 === targetId &&
          document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;
    case "knight":
      if (
        startId + width * 2 + 1 === targetId ||
        startId + width * 2 - 1 === targetId ||
        startId + width - 2 === targetId ||
        startId + width + 2 === targetId ||
        startId - width * 2 + 1 === targetId ||
        startId - width * 2 - 1 === targetId ||
        startId - width - 2 === targetId ||
        startId - width + 2 === targetId
      ) {
        return true;
      }
      break;
    case "bishop":
      if (
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 &&
          !document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        //--
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        //--
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        //--
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id ="${startId - width + 1}"]`)
            .firstChild) ||
        ((startId - width * 3 + 3 === targetId) === targetId &&
          !document.querySelector(`[square-id ="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        ((startId - width * 4 + 4 === targetId) === targetId &&
          !document.querySelector(`[square-id ="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        ((startId - width * 5 + 5 === targetId) === targetId &&
          !document.querySelector(`[square-id ="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        ((startId - width * 6 + 6 === targetId) === targetId &&
          !document.querySelector(`[square-id ="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        ((startId - width * 7 + 7 === targetId) === targetId &&
          !document.querySelector(`[square-id ="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        //=
        startId + width - 1 === targetId ||
        ((startId + width * 2 - 2 === targetId) === targetId &&
          !document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild) ||
        ((startId + width * 3 - 3 === targetId) === targetId &&
          !document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        ((startId + width * 4 - 4 === targetId) === targetId &&
          !document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        ((startId + width * 5 - 5 === targetId) === targetId &&
          !document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        ((startId + width * 6 - 6 === targetId) === targetId &&
          !document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 5 - 5}"]`)
            .firstChild) ||
        ((startId + width * 7 - 7 === targetId) === targetId &&
          !document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 - 5}"]`)
            .firstChild.firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 6 - 6}"]`)
            .firstChild.firstChild)
      ) {
        return true;
      }
      break;
    case "rook":
      if (
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 5}"]`)
            .firstChild) ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 6}"]`)
            .firstChild) ||
        //--
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id ="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id ="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id ="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id ="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id ="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5}"]`)
            .firstChild) ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id ="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 6}"]`)
            .firstChild) ||
        //=
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id ="${startId + 1}"]`)
            .firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id ="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 2}"]`)
            .firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id ="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 3}"]`)
            .firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id ="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 4}"]`)
            .firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id ="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 5}"]`)
            .firstChild) ||
        (startId * 7 === targetId &&
          !document.querySelector(`[square-id ="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 5}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 6}"]`)
            .firstChild) ||
        //=.firstChild
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id ="${startId - 1}"]`)
            .firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id ="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 2}"]`)
            .firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id ="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 3}"]`)
            .firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id ="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 4}"]`)
            .firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id ="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 5}"]`)
            .firstChild) ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id ="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 5}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 6}"]`).firstChild)
      ) {
        return true;
      }
      break;
    case "queen":
      if (
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id ="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        //--
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        //--
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id ="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        //--
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id ="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id ="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id ="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        (startId - width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id ="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        (startId - width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id ="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        (startId - width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id ="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        //=
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        (startId + width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        (startId + width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        (startId + width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 5 - 5}"]`)
            .firstChild.firstChild) ||
        (startId + width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id ="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 6 - 6}"]`)
            .firstChild) ||
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`) &&
          !document.querySelector(`[square-id ="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 5}"]`)
            .firstChild) ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id ="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId + width * 6}"]`)
            .firstChild) ||
        //--
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id ="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id ="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id ="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id ="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id ="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5}"]`)
            .firstChild) ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id ="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id ="${startId - width * 6}"]`)
            .firstChild) ||
        //=
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id ="${startId + 1}"]`)
            .firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id ="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 2}"]`)
            .firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id ="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 3}"]`)
            .firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id ="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 4}"]`)
            .firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id ="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 5}"]`)
            .firstChild) ||
        (startId * 7 === targetId &&
          !document.querySelector(`[square-id ="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 5}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId + 6}"]`)
            .firstChild) ||
        //=
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id ="${startId - 1}"]`)
            .firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id ="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 2}"]`)
            .firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id ="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 3}"]`)
            .firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id ="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 4}"]`)
            .firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id ="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 5}"]`)
            .firstChild) ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id ="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 5}"]`).firstChild &&
          !document.querySelector(`[square-id ="${startId - 6}"]`).firstChild)
      ) {
        return true;
      }
      break;
    case "king":
      if (
        startId + 1 === targetId ||
        startId - 1 === targetId ||
        startId + width === targetId ||
        startId - width === targetId ||
        startId + width - 1 === targetId ||
        startId + width + 1 === targetId ||
        startId - width - 1 === targetId ||
        startId - width + 1 === targetId
      ) {
        return true;
      }
  }
}

function changePlayer() {
  if (playerGo === "black") {
    reverseIds();
    playerGo = "white";
    playerDisplay.textContent = "white";
  } else {
    revertIds();
    playerGo = "black";
    playerDisplay.textContent = "black";
  }
}

function reverseIds() {
  const allsquares = document.querySelectorAll(".square");
  allsquare.forEach((square, i) => {
    square.setAttribute("square-id", width * width - 1 - i);
  });
}
function revertIds() {
  const allsquares = document.querySelectorAll(".square");
  allsquare.forEach((square, i) => {
    square.setAttribute("square-id", i);
  });
}

function checkForWin() {
  const king = Array.from(document.querySelectorAll("#king"));
  if (!king.some((king) => king.firstChild.classList.contains("white"))) {
    infoDisplay.innerHTML = "Black player wins!";
    disableDraggable();
  }
  if (!king.some((king) => king.firstChild.classList.contains("black"))) {
    infoDisplay.innerHTML = "white player wins!";
    disableDraggable();
  }

  function disableDraggable() {
    const allsquares = document.querySelectorAll(".square");
    allsquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
}

const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", (event) => {
  console.log("Connected to server");

  // socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", async (event) => {
  if (event.data instanceof Blob) {
    //  data is a Blob, read it as text
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        console.log("Received data:", data);

        updateChessboard(data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    reader.readAsText(event.data);
  } else {
    try {
      const data = JSON.parse(event.data);
      console.log("Received data:", data);

      updateChessboard(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  updateChessboard(data);
});

function sendChessMove(move) {
  console.log();
  socket.send(JSON.stringify(move));
}
function updateChessboard(move) {
  const { targetid, startPositionId, draggedid } = move;

  const squareid = document.querySelector(`[square-id="${targetid}"]`);
  const key = document.querySelector(`#${draggedid}`);
  const startbox = document.querySelector(`[square-id="${startPositionId}"]`);

  const clonedKey = key.cloneNode(true);
  clonedKey.firstChild.classList.remove("black", "white");

  const currentColor = playerGo === "black" ? "black" : "white";
  clonedKey.firstChild.classList.add(currentColor);

  squareid.append(clonedKey);

  startbox.firstChild.remove();
  checkForWin();
  changePlayer();
}

socket.addEventListener("close", (event) => {
  console.log("Server closed the connection:", event.reason);
});

function check() {
  const whiteKing = document.querySelector("#king .white");
  const blackKing = document.querySelector("#king .black");
  const squareId = whiteKing.closest(".square").getAttribute("square-id");

  const whiteWins = checkWhiteWinCondition(squareId);
  const blackWins = checkBlackWinCondition(squareId);

  if (whiteWins) {
    endGame("White player wins!");
  } else if (blackWins) {
    endGame("Black player wins!");
  }
}

function checkWhiteWinCondition(ksquareid) {
  let targetsquare = document.querySelector(`[square-id = "${ksquareid}"]`);
  const allSquares = document.querySelectorAll(".square");
  const black_array = [];
  allSquares.forEach((square) => {
    if (square.firstChild && square.firstChild.hasChildNodes()) {
      console.log(square.firstChild.firstChild);
      if (square.firstChild.firstChild.classList.contains("black")) {
        let squareid = square.getAttribute("square-id");
        let piece_name = document.querySelector(".square");
        black_array.push({ squareid, piece_name });
      }
    }
  });

  black_array.forEach((el) => {
    checkIfValid(targetsquare, el.piece_name);
    if (checkIfValid) {
      console.log("check valid");
      return true;
    }
  });
  console.log(black_array);
  return false;
}

function checkBlackWinCondition(ksquareid) {
  let targetsquare = document.querySelector(`[square-id = "${ksquareid}"]`);
  const allSquares = document.querySelectorAll(".square");
  const black_array = [];
  allSquares.forEach((square) => {
    if (square.firstChild && square.firstChild.hasChildNodes()) {
      console.log(square.firstChild.firstChild);
      if (square.firstChild.firstChild.classList.contains("white")) {
        let squareid = square.getAttribute("square-id");
        let piece_name = document.querySelector(".square");
        black_array.push({ squareid, piece_name });
      }
    }
  });

  black_array.forEach((el) => {
    checkIfValid(targetsquare, el.piece_name);
    if (checkIfValid) {
      return true;
    }
  });
  return false;
}

function endGame(message) {
  infoDisplay.textContent = message;
  disableDraggable();
}

function disableDraggable() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square) =>
    square.firstChild?.setAttribute("draggable", false)
  );
}
