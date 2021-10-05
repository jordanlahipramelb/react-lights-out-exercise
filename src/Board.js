import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = 0.25 }) {
  const [board, setBoard] = useState(createBoard());

  // ! create the initial board for state
  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    // create array-of-arrays of true/false values
    let initialBoard = [];

    // create rows and columns within the rows with the length of nrows/ncols
    for (let y = 0; y < nrows; y++) {
      let row = [];

      for (let x = 0; x < ncols; x++) {
        // push, into the row array, a random number less than the chance any cell is lit at start of game
        row.push(Math.random() < chanceLightStartsOn);
      }
      // push the row array (which contains numbers the length of ncols/nrows) into the initial board
      initialBoard.push(row);
    }

    return initialBoard;
  }

  // ! check the board in state to determine whether the player has won.
  function hasWon() {
    // every() method returns true if all elements in an array pass a test
    return board.every((row) => row.every((cell) => !cell));
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      /** //! Make a (deep) copy of the oldBoard
       * Map through each row and spread its contents */
      const boardCopy = oldBoard.map((row) => [...row]);

      // in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y + 1, x, boardCopy);

      // return the copy
      return boardCopy;
    });
  }

  // ! if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <div>You win!</div>;
  }

  // ! make table board
  let tableBoard = [];

  // create the rows and columns of the board
  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      // define the y (col) and x (row) coordinates
      let coord = `${y}-${x}`;
      // push number of Cell components into the row array depending on its length
      row.push(
        <Cell
          key={coord} //each coordinate is unique
          isLit={board[y][x]}
          // callback function baked into prop; pass function down to child
          flipCellsAroundMe={() => flipCellsAround(coord)}
        />
      );
    }
    tableBoard.push(<tr key={y}>{row}</tr>);
  }

  return (
    <table className="Board">
      <tbody>{tableBoard}</tbody>
    </table>
  );
}

export default Board;
