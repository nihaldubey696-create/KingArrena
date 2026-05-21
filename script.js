
/* ==========================================================================
   KINGMASTER PREMIUM ESPORTS — PHASE 1 SYSTEM LOGIC (FIXED)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Screen Sections
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');
    
    // Bottom Navigation Play Button
    const navPlayTrigger = document.getElementById('nav-play-trigger');
    
    // Top Bar Back Button in Game Screen
    const btnBackLobby = document.getElementById('btn-back-lobby');
    const btnResign = document.getElementById('btn-resign');
    const btnFlip = document.getElementById('btn-flip');
    
    // Dashboard Clickable Sub-Mode Cards
    const cardFriendFree = document.getElementById('btn-friend-free');
    const cardFriendPaid = document.getElementById('btn-friend-paid');
    const cardLobbyFree = document.getElementById('btn-lobby-free');
    const cardLobbyPaid = document.getElementById('btn-lobby-paid');

    // Chess Board Variables
    const chessboard = document.getElementById('kingarena-board');
    let selectedSquare = null;
    let isBoardFlipped = false;

    // Classic Chess Starting Layout Matrix
    const initialBoardLayout = [
        ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'], 
        ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'], 
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'], 
        ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']  
    ];

    let currentBoardState = JSON.parse(JSON.stringify(initialBoardLayout));

    // ==================== SCREEN SWITCHING SYSTEMS ====================

    // Open Chess Arena & Render Board
    const openGameArena = () => {
        if(homeScreen && gameScreen) {
            homeScreen.classList.remove('active');
            gameScreen.classList.add('active');
            generatePremiumBoard();
        }
    };

    // Return back to Main Menu Lobby
    const returnToLobby = () => {
        if(homeScreen && gameScreen) {
            gameScreen.classList.remove('active');
            homeScreen.classList.add('active');
            selectedSquare = null;
        }
    };

    // Attaching Click Events to Home Cards
    if (cardFriendFree) cardFriendFree.addEventListener('click', openGameArena);
    if (cardFriendPaid) cardFriendPaid.addEventListener('click', openGameArena);
    if (cardLobbyFree) cardLobbyFree.addEventListener('click', openGameArena);
    if (cardLobbyPaid) cardLobbyPaid.addEventListener('click', openGameArena);
    
    // Attaching Click Event to Bottom Nav 'Play' Icon
    if (navPlayTrigger) navPlayTrigger.addEventListener('click', openGameArena);

    // Game Control Actions
    if (btnBackLobby) btnBackLobby.addEventListener('click', returnToLobby);
    
    if (btnResign) {
        btnResign.addEventListener('click', () => {
            if (confirm("Are you sure you want to resign this match?")) {
                returnToLobby();
            }
        });
    }

    if (btnFlip) {
        btnFlip.addEventListener('click', () => {
            isBoardFlipped = !isBoardFlipped;
            generatePremiumBoard();
        });
    }

    // ==================== DYNAMIC BOARD GENERATION ====================

    function generatePremiumBoard() {
        if (!chessboard) return;
        chessboard.innerHTML = ''; // Reset Board View
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                
                // Flip calculation logic
                const actualRow = isBoardFlipped ? (7 - row) : row;
                const actualCol = isBoardFlipped ? (7 - col) : col;

                const square = document.createElement('div');
                square.classList.add('square');
                
                // Wooden grid colors layout rule
                if ((actualRow + actualCol) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }

                square.setAttribute('data-row', actualRow);
                square.setAttribute('data-col', actualCol);

                // Setup Piece Symbols inside Squares
                const pieceSymbol = currentBoardState[actualRow][actualCol];
                if (pieceSymbol !== '') {
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece');
                    pieceElement.innerText = pieceSymbol;
                    
                    // Contrast Coloring
                    const charCode = pieceSymbol.charCodeAt(0);
                    if (charCode >= 9812 && charCode <= 9817) {
                        pieceElement.style.color = '#ffffff'; // White Team
                        pieceElement.style.filter = 'drop-shadow(1px 2px 2px #000)';
                    } else {
                        pieceElement.style.color = '#111116'; // Black Team
                        pieceElement.style.filter = 'drop-shadow(1px 1px 1px rgba(255,255,255,0.3))';
                    }
                    
                    square.appendChild(pieceElement);
                }

                // Click handler for making active moves
                square.addEventListener('click', () => handleSquareClicks(actualRow, actualCol));
                chessboard.appendChild(square);
            }
        }
    }

    // ==================== PIECE INTERACTION & MOVEMENT ====================

    function handleSquareClicks(row, col) {
        const squares = document.querySelectorAll('.square');
        const clickedPiece = currentBoardState[row][col];
        
        // Scenario A: If a piece is already selected, click means try to move it
        if (selectedSquare) {
            const prevRow = selectedSquare.row;
            const prevCol = selectedSquare.col;

            // If clicked the exact same spot, deselect it
            if (prevRow === row && prevCol === col) {
                clearVisualHighlights(squares);
                selectedSquare = null;
                return;
            }

            // Move token data state transition
            currentBoardState[row][col] = currentBoardState[prevRow][prevCol];
            currentBoardState[prevRow][prevCol] = '';

            selectedSquare = null;
            clearVisualHighlights(squares);
            generatePremiumBoard();

            // Highlight Target Move Destination Box
            const targetSquare = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
            if (targetSquare) targetSquare.classList.add('last-move');
            
        } else {
            // Scenario B: Select a piece if clicked on a non-empty tile
            if (clickedPiece !== '') {
                selectedSquare = { row, col };
                clearVisualHighlights(squares);

                const activeSquare = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
                if (activeSquare) activeSquare.classList.add('selected');
            }
        }
    }

    function clearVisualHighlights(squares) {
        squares.forEach(sq => {
            sq.classList.remove('selected');
            sq.classList.remove('last-move');
        });
    }
});
