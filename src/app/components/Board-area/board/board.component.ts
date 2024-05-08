import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  public gameOn: boolean = true;
  public winner: string;
  public boardMat: string[][];
  ngOnInit(): void {
    this.boardMat = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  }
  public restart() {
    this.gameOn = true;
    this.winner = '';
    this.boardMat = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  }

  public input(event: any) {
    // Place 'x' on the clicked cell

    let row = event.target.classList[0];
    let col = event.target.classList[1];

    if (col === 'nil') col = 0;
    else if (col === 'one') col = 1;
    else if (col === 'two') col = 2;

    if (this.boardMat[row][col] === '') {
      this.boardMat[row][col] = 'x';

      if (this.checkWinCondition('x')) {
        console.log('x won');
        this.winner = 'x';
        this.gameOn = false;
        return;
      }

      // Introduce a delay before the computer makes its move
      setTimeout(() => {
        // Check if the computer can win next turn
        const winMove = this.canWinNextTurn('o');
        if (winMove) {
          // If the computer can win, place 'o' to win
          this.boardMat[winMove.row][winMove.col] = 'o';
        } else {
          // If the computer cannot win, check if the player can win next turn
          console.log('looking to block winning move...');

          const blockMove = this.canWinNextTurn('x');
          if (blockMove) {
            // If the player can win, block their move
            this.boardMat[blockMove.row][blockMove.col] = 'o';
          } else {
            // If neither player can win next turn, make a random move
            console.log('found no winning moves to block- placing random');
            this.makeRandomMove();
          }
        }
        console.log(this.boardMat);
        if (this.checkWinCondition('x')) {
          console.log('x won');
          this.winner = 'x';
          this.gameOn = false;
        } else if (this.checkWinCondition('o')) {
          console.log('o won');
          this.winner = 'o';
          this.gameOn = false;
        }
      }, 100);
    }
  }
  private checkDraw(): boolean {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.boardMat[row][col] === '') {
          return false; // If any cell is empty, game is not a draw
        }
      }
    }
    return true; // If all cells are filled and no one has won, it's a draw
  }
  private makeRandomMove() {
    // Generate random row and column until an empty cell is found or the game is not a draw
    let row, col;
    do {
      row = Math.floor(Math.random() * 3);
      col = Math.floor(Math.random() * 3);
    } while (this.boardMat[row][col] !== '' && !this.checkDraw());

    // If the game is still on (not a draw), place 'o' in the random empty cell
    if (this.gameOn) {
      console.log(row, col);
      this.boardMat[row][col] = 'o';
    }

    // Check for draw after making a move
    let draw = this.checkDraw();
    if (draw) {
      console.log('Draw');
      this.winner = 'draw';
      this.gameOn = false;
    }
  }

  private canWinNextTurn(symbol: string): { row: number; col: number } | null {
    // Iterate through each cell on the board
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        // If the cell is empty, simulate placing the symbol in that cell
        if (this.boardMat[row][col] === '') {
          this.boardMat[row][col] = symbol;
          if (this.checkWinCondition(symbol)) {
            // Check if the simulated move results in a win

            // If it does, return the row and column of that cell
            this.boardMat[row][col] = ''; // Reset the board state
            console.log(row, col);
            return { row, col };
          }

          // Reset the board state for the next simulation
          this.boardMat[row][col] = '';
        }
      }
    }

    // If no winning move is found, return null
    return null;
  }

  private checkWinCondition(symbol: string): boolean {
    // check rows
    for (let i = 0; i < 3; i++) {
      if (
        this.boardMat[i][0] === symbol &&
        this.boardMat[i][0] === this.boardMat[i][1] &&
        this.boardMat[i][0] === this.boardMat[i][2]
      ) {
        return true;
      }
    }

    // check columns
    for (let i = 0; i < 3; i++) {
      if (
        this.boardMat[0][i] === symbol &&
        this.boardMat[0][i] === this.boardMat[1][i] &&
        this.boardMat[0][i] === this.boardMat[2][i]
      ) {
        return true;
      }
    }

    // check diagonals
    if (
      this.boardMat[0][0] === symbol &&
      this.boardMat[0][0] === this.boardMat[1][1] &&
      this.boardMat[0][0] === this.boardMat[2][2]
    ) {
      return true;
    }

    if (
      this.boardMat[0][2] === symbol &&
      this.boardMat[0][2] === this.boardMat[1][1] &&
      this.boardMat[0][2] === this.boardMat[2][0]
    ) {
      return true;
    }

    return false; // If no win condition is met, return false
  }
}
