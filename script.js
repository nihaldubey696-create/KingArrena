/* ==========================================================================
   KINGMASTER PREMIUM ESPORTS — PHASE 1 SYSTEM LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Screens Tracking Elements
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');
    
    // Navigation Triggers
    const navPlayTrigger = document.getElementById('nav-play-trigger');
    const btnBackLobby = document.getElementById('btn-back-lobby');
    const btnResign = document.getElementById('btn-resign');
    const btnFlip = document.getElementById('btn-flip');
    
    // Quick Match Action Boxes
    const actionButtons = [
        'btn-friend-free', 'btn-friend-paid', 
        'btn-lobby-free', 'btn-lobby-paid'
    ];

    // Board Element & Logic Mapping Coordinates
    const chessboard = document.getElementById('kingarena-board');
    let selectedSquare = null;
    let isBoardFlipped = false;

    // Standard Chess Logic Starting Matrix Setup
    const initialBoardLayout = [
        ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'], // Black Back Row
        ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'], // Black Pawns
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'], // White Pawns
        ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']  // White Back Row
    ];

    let currentBoardState = JSON.parse(JSON.stringify(initialBoardLayout));

    // ==================== SCREEN SWITCHING SYSTEMS ====================

    // Open Chess Arena function
    const openGameArena = () => {
        homeScreen.classList.remove('active');
        gameScreen.classList.add('active');
        generatePremiumBoard();
    };

    // Close Chess Arena and return to Lobby
    const returnToLobby = () => {
        gameScreen.classList.remove('active');
        homeScreen.classList.add('active');
        selectedSquare = null;
    };

    // 1. Bottom Menu Navigation 'Play' Icon Click
    if (navPlayTrigger) {
        navPlayTrigger.addEventListener('click', openGameArena);
    }

    // 2. Direct Game Mode Click Targets (Free & Paid Cards Setup)
    actionButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', openGameArena);
    });

    // 3. Game Top Bar 'Lobby' Back Button
    if (btnBackLobby) {
        btnBackLobby.addEventListener('click', returnToLobby);
    }

    // 4. Match Resign Action
    if (btnResign) {
        btnResign.addEventListener('click', () => {
            if (confirm("Are you sure you want to resign this match?")) {
                returnToLobby();
            }
        });
    }

    // ==================== REAL TIME BOARD MATRIX RENDERER ====================

    function generatePremiumBoard() {
        if (!chessboard) return;
        chessboard.innerHTML = ''; // Clear Old Framework
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                // Calculation vectors for Board flip system rotation
                const actualRow = isBoardFlipped ? (7 - row) : row;
                const actualCol = isBoardFlipped ? (7 - col) : col;

                const square = document.createElement('div');
                square.classList.add('square');
                
                // Classic Alternate Dark & Light Grid formula
                if ((actualRow + actualCol) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }

                square.setAttribute('data-row', actualRow);
                square.setAttribute('data-col', actualCol);

                // Print Chess Token Text Symbol
                const pieceSymbol = currentBoardState[actualRow][actualCol];
                if (pieceSymbol !== '') {
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece');
                    pieceElement.innerText = pieceSymbol;
                    
                    // Design Color Contrast tuning for clean UI view
                    const charCode = pieceSymbol.charCodeAt(0);
                    if (charCode >= 9812 && charCode <= 9817) {
                        pieceElement.style.color = '#ffffff'; // White Pieces
                        pieceElement.style.filter = 'drop-shadow(1px 2px 2px #000)';
                    } else {
                        pieceElement.style.color = '#111116'; // Black Pieces
                        pieceElement.style.filter = 'drop-shadow(1px 1px 1px rgba(255,255,255,0.3))';
                    }
                    
                    square.appendChild(pieceElement);
                }

                // Add standard mobile click handling action listeners
                square.addEventListener('click', () => handleSquareClicks(actualRow, actualCol));
                chessboard.appendChild(square);
            }
        }
    }

    // Flip View Command Action Handler
    if (btnFlip) {
        btnFlip.addEventListener('click', () => {
            isBoardFlipped = !isBoardFlipped;
            generatePremiumBoard();
        });
    }

    // ==================== MOVE CONTROL LOGIC HANDLING ====================

    function handleSquareClicks(row, col) {
        const squares = document.querySelectorAll('.square');
        const clickedPiece = currentBoardState[row][col];
        
        // Scenario A: Move piece to clicked square coords if a tile was highlighted already
        if (selectedSquare) {
            const prevRow = selectedSquare.row;
            const prevCol = selectedSquare.col;

            if (prevRow === row && prevCol === col) {
                clearVisualHighlights(squares);
                selectedSquare = null;
                return;
            }

            // Move token data state transition execution
            currentBoardState[row][col] = currentBoardState[prevRow][prevCol];
            currentBoardState[prevRow][prevCol] = '';

            selectedSquare = null;
            clearVisualHighlights(squares);
            generatePremiumBoard();

            // Highlight Target Move End Boundary Box
            const targetSquare = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
            if (targetSquare) targetSquare.classList.add('last-move');
            
        } else {
            // Scenario B: Highlight target square coordinate

