# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Sumikko Gurashi themed Sudoku web game. It's a pure client-side application using HTML, CSS, and vanilla JavaScript with no build process or dependencies.

## Running the Application

Open `index.html` directly in a web browser. No server or build process required.

## Code Architecture

### Core Files
- `index.html` - Main HTML structure with game UI
- `style.css` - Complete styling with Sumikko Gurashi theme and responsive design
- `sudoku.js` - Contains the `SumikkoSudoku` class with all game logic

### Game Architecture
The application is built around a single JavaScript class `SumikkoSudoku` that manages:
- Sudoku puzzle generation and solving using backtracking algorithm
- Game state (grid, solution, selected cells, timer, mistakes)
- UI interactions (cell selection, number input, keyboard controls)
- Game flow (new game, hints, completion detection)

### Character System
Uses emoji characters instead of numbers 1-9:
`['🐻', '🐧', '🍤', '🦕', '🍱', '🌟', '💤', '🍀', '🌙']`

### Key Methods
- `generateSolution()` - Creates valid 9x9 sudoku solution using backtracking
- `createPuzzle()` - Removes cells based on difficulty to create playable puzzle
- `makeMove()` - Handles user input validation and mistake tracking
- `isValidMove()` - Validates sudoku rules (row, column, 3x3 box)

## Current Configuration

- Claude Code permissions are configured in `.claude/settings.local.json`
- Currently allows: `Bash(find:*)`, `Bash(ls:*)`