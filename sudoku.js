class SumikkoSudoku {
    constructor() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.selectedNumber = null;
        this.mistakes = 0;
        this.maxMistakes = 3;
        this.startTime = null;
        this.timerInterval = null;
        this.isGameComplete = false;
        
        this.characters = ['🐻', '🐧', '🍤', '🦕', '🍱', '🌟', '💤', '🍀', '🌙'];
        
        this.initializeGame();
        this.bindEvents();
    }

    initializeGame() {
        this.createGrid();
        this.generateNewGame();
    }

    createGrid() {
        const gridElement = document.getElementById('sudoku-grid');
        gridElement.innerHTML = '';
        
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => this.selectCell(i));
            gridElement.appendChild(cell);
        }
    }

    bindEvents() {
        document.getElementById('new-game').addEventListener('click', () => this.generateNewGame());
        document.getElementById('hint').addEventListener('click', () => this.showHint());
        document.getElementById('play-again').addEventListener('click', () => this.generateNewGame());
        
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = parseInt(e.target.dataset.number);
                this.selectNumber(number);
            });
        });
        
        document.querySelector('.erase-btn').addEventListener('click', () => this.eraseCell());
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    generateNewGame() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.mistakes = 0;
        this.isGameComplete = false;
        this.selectedCell = null;
        this.selectedNumber = null;
        
        document.getElementById('game-complete').classList.add('hidden');
        document.getElementById('mistakes').textContent = '0';
        
        this.generateSolution();
        this.createPuzzle();
        this.updateDisplay();
        this.startTimer();
    }

    generateSolution() {
        this.fillGrid(this.solution);
    }

    fillGrid(grid) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    this.shuffleArray(numbers);
                    
                    for (let num of numbers) {
                        if (this.isValidMove(grid, row, col, num)) {
                            grid[row][col] = num;
                            
                            if (this.fillGrid(grid)) {
                                return true;
                            }
                            
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    createPuzzle() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                this.grid[row][col] = this.solution[row][col];
            }
        }
        
        const difficulty = document.getElementById('difficulty-select').value;
        let cellsToRemove;
        
        switch (difficulty) {
            case 'easy': cellsToRemove = 40; break;
            case 'medium': cellsToRemove = 50; break;
            case 'hard': cellsToRemove = 60; break;
            default: cellsToRemove = 50;
        }
        
        const positions = [];
        for (let i = 0; i < 81; i++) {
            positions.push(i);
        }
        this.shuffleArray(positions);
        
        for (let i = 0; i < cellsToRemove; i++) {
            const pos = positions[i];
            const row = Math.floor(pos / 9);
            const col = pos % 9;
            this.grid[row][col] = 0;
        }
    }

    selectCell(index) {
        if (this.isGameComplete) return;
        
        const row = Math.floor(index / 9);
        const col = index % 9;
        
        if (this.solution[row][col] !== this.grid[row][col] && this.grid[row][col] !== 0) return;
        if (this.grid[row][col] !== 0 && this.solution[row][col] === this.grid[row][col]) return;
        
        this.selectedCell = { row, col, index };
        this.updateCellSelection();
        
        if (this.selectedNumber) {
            this.makeMove(row, col, this.selectedNumber);
        }
    }

    selectNumber(number) {
        this.selectedNumber = number;
        this.updateNumberSelection();
        
        if (this.selectedCell) {
            this.makeMove(this.selectedCell.row, this.selectedCell.col, number);
        }
    }

    makeMove(row, col, number) {
        if (this.isGameComplete) return;
        if (this.solution[row][col] === this.grid[row][col] && this.grid[row][col] !== 0) return;
        
        if (this.solution[row][col] === number) {
            this.grid[row][col] = number;
            this.updateDisplay();
            this.checkGameComplete();
        } else {
            this.mistakes++;
            document.getElementById('mistakes').textContent = this.mistakes;
            this.showError(row, col);
            
            if (this.mistakes >= this.maxMistakes) {
                this.gameOver();
            }
        }
        
        this.selectedCell = null;
        this.selectedNumber = null;
        this.updateCellSelection();
        this.updateNumberSelection();
    }

    eraseCell() {
        if (!this.selectedCell || this.isGameComplete) return;
        
        const { row, col } = this.selectedCell;
        if (this.solution[row][col] === this.grid[row][col] && this.grid[row][col] !== 0) return;
        
        this.grid[row][col] = 0;
        this.updateDisplay();
    }

    showHint() {
        if (this.isGameComplete) return;
        
        const emptyCells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.row][randomCell.col] = this.solution[randomCell.row][randomCell.col];
            this.updateDisplay();
            this.checkGameComplete();
        }
    }

    isValidMove(grid, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num || grid[x][col] === num) {
                return false;
            }
        }
        
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }
        
        return true;
    }

    updateDisplay() {
        const cells = document.querySelectorAll('.cell');
        
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            const cell = cells[i];
            
            if (this.grid[row][col] !== 0) {
                cell.textContent = this.characters[this.grid[row][col] - 1];
                if (this.solution[row][col] === this.grid[row][col]) {
                    cell.classList.add('given');
                } else {
                    cell.classList.remove('given');
                }
            } else {
                cell.textContent = '';
                cell.classList.remove('given');
            }
            
            cell.classList.remove('error', 'highlight');
        }
    }

    updateCellSelection() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        if (this.selectedCell) {
            const cell = document.querySelector(`[data-index="${this.selectedCell.index}"]`);
            if (cell) {
                cell.classList.add('selected');
            }
        }
    }

    updateNumberSelection() {
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        if (this.selectedNumber) {
            const btn = document.querySelector(`[data-number="${this.selectedNumber}"]`);
            if (btn) {
                btn.classList.add('selected');
            }
        }
    }

    showError(row, col) {
        const index = row * 9 + col;
        const cell = document.querySelector(`[data-index="${index}"]`);
        if (cell) {
            cell.classList.add('error');
            setTimeout(() => {
                cell.classList.remove('error');
            }, 1000);
        }
    }

    checkGameComplete() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    return;
                }
            }
        }
        
        this.isGameComplete = true;
        this.stopTimer();
        document.getElementById('game-complete').classList.remove('hidden');
    }

    gameOver() {
        alert('ゲームオーバー！間違いが3回になりました。新しいゲームを始めてください。');
        this.generateNewGame();
    }

    startTimer() {
        this.startTime = Date.now();
        this.stopTimer();
        
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    handleKeyPress(e) {
        if (this.isGameComplete) return;
        
        if (e.key >= '1' && e.key <= '9') {
            const number = parseInt(e.key);
            this.selectNumber(number);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            this.eraseCell();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
                   e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            this.handleArrowKey(e.key);
        }
    }

    handleArrowKey(key) {
        if (!this.selectedCell) return;
        
        let { row, col } = this.selectedCell;
        
        switch (key) {
            case 'ArrowUp': row = Math.max(0, row - 1); break;
            case 'ArrowDown': row = Math.min(8, row + 1); break;
            case 'ArrowLeft': col = Math.max(0, col - 1); break;
            case 'ArrowRight': col = Math.min(8, col + 1); break;
        }
        
        const newIndex = row * 9 + col;
        this.selectCell(newIndex);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SumikkoSudoku();
});