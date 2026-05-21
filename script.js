/* ==========================================================================
   KINGARENA PREMIUM ESPORTS CHESS — PHASE 1 GAME LOGIC & CORE UI
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const timeCards = document.querySelectorAll('.time-card');
    const matchModal = document.getElementById('match-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalGameMode = document.getElementById('modal-game-mode');
    
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');
    
    const startFreeMatchBtn = document.getElementById('start-free-match');
    const startPaidMatchBtn = document.getElementById('start-paid-match');
    const btnResign = document.getElementById('btn-resign');
    const btnFlip = document.getElementById('btn-flip');
    
    const chessboard = document.getElementById('kingarena-board');
    const moveListContainer = document.getElementById('move-list');

    // Game State variables
    let selectedSquare = null;
    let isBoardFlipped = false;
    let activeTimeControl = "3+0";
    let activeTimeType = "Blitz";

    // 1. Initial Classic Chess Piece Layout Setup (Unicode for Clean Rendering)
    const initialBoardLayout = [
        ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'], // Row 0 (Black Pieces)
        ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'], // Row 1 (Black Pawns)
        ['', '', '', '', '', '', '', ''],         // Row 2
        ['', '', '', '', '', '', '', ''],         // Row 3
        ['', '', '', '', '', '', '', ''],         // Row 4
        ['', '', '', '', '', '', '', ''],         // Row 5
        ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'], // Row 6 (White Pawns)
        ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']  // Row 7 (White Pieces)
    ];

    let currentBoardState = JSON.parse(JSON.stringify(initialBoardLayout));

    // ==================== UI INTERACTION & MODALS ====================

    // Time Card Selection -> Open Premium Bottom Popup
    timeCards.forEach(card => {
        card.addEventListener('click', () => {
            activeTimeControl = card.getAttribute('data-time');
            activeTimeType = card.getAttribute('data-type');
            modalGameMode.innerText = `${activeTimeControl} • ${activeTimeType}`;
            matchModal.classList.add('open');
        });
    });

    // Close Popup Modal
    const closeModal = () => matchModal.classList.remove('open');
    closeModalBtn.addEventListener('click', closeModal);
    matchModal.addEventListener('click', (e) => {
        if (e.target === matchModal) closeModal();
    });

    // Switch Screen From Home to Real Chess Arena
    const launchGameArena = () => {
        closeModal();
        homeScreen.classList.remove('active');
        gameScreen.classList.add('active');
        generatePremiumBoard();
    };

    startFreeMatchBtn.addEventListener('click', launchGameArena);
    startPaidMatchBtn.addEventListener('click', launchGameArena);

    // Resign Button -> Return Back to Main Lobby Menu
    btnResign.addEventListener('click', () => {
        if(confirm("Are you sure you want to resign this match?")) {
            gameScreen.classList.remove('active');
            homeScreen.classList.add('active');
            selectedSquare = null;
        }
    });

    // ==================== CORE DYNAMIC CHESSBOARD GENERATION ====================

    function generatePremiumBoard() {
        chessboard.innerHTML = ''; // Reset Board Layout
        
        // Loop Rows and Columns
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                // Determine display rows based on board flip angle
                const actualRow = isBoardFlipped ? (7 - row) : row;
                const actualCol = isBoardFlipped ? (7 - col) : col;

                const square = document.createElement('div');
                square.classList.add('square');
                
                // Color Formula for Alternate Wooden Layout Design
                if ((actualRow + actualCol) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }

                square.setAttribute('data-row', actualRow);
                square.setAttribute('data-col', actualCol);

                // Fetch Piece symbol from data state array matrix
                const pieceSymbol = currentBoardState[actualRow][actualCol];
                if (pieceSymbol !== '') {
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece');
                    pieceElement.innerText = pieceSymbol;
                    
                    // Style pieces to stand out with clear text sizing
                    pieceElement.style.fontSize = '36px';
                    pieceElement.style.color = (pieceSymbol.charCodeAt(0) >= 9812 && pieceSymbol.charCodeAt(0) <= 9817) ? '#fff' : '#000';
                    pieceElement.style.filter = 'drop-shadow(2px 3px 2px rgba(0,0,0,0.4))';
                    
                    square.appendChild(pieceElement);
                }

                // Add Click Listener to capture move dynamics
                square.addEventListener('click', () => handleSquareSelection(actualRow, actualCol));
                chessboard.appendChild(square);
            }
        }
    }

    // Flip Board View Option Action
    btnFlip.addEventListener('click', () => {
        isBoardFlipped = !isBoardFlipped;
        generatePremiumBoard();
    });

    // ==================== CORE MATCH CHESSPLAY INTERACTION ====================

    function handleSquareSelection(row, col) {
        const squares = document.querySelectorAll('.square');
        const clickedPiece = currentBoardState[row][col];
        
        // Step A: If a piece was already clicked previously -> Try to Move
        if (selectedSquare) {
            const prevRow = selectedSquare.row;
            const prevCol = selectedSquare.col;

            // Prevent making a move onto the exact same grid point
            if (prevRow === row && prevCol === col) {
                clearHighlights(squares);
                selectedSquare = null;
                return;
            }

            // Move Execution Sequence Update
            const movingPieceSymbol = currentBoardState[prevRow][prevCol];
            currentBoardState[row][col] = movingPieceSymbol;
            currentBoardState[prevRow][prevCol] = '';

            // Update Graphical History Log List Panel UI
            logEsportsMove(movingPieceSymbol, prevRow, prevCol, row, col);

            // Reset selection values and regenerate screen state mapping
            selectedSquare = null;
            clearHighlights(squares);
            generatePremiumBoard();

            // Highlight the target square destination boundary point
            const targetSquare = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
            if (targetSquare) targetSquare.classList.add('last-move');
            
        } else {
            // Step B: Select target piece if clicked coordinate contains an active token symbol
            if (clickedPiece !== '') {
                selectedSquare = { row, col };
                clearHighlights(squares);

                // Apply premium accent color ring border around selected icon base box
                const activeSquare = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
                if (activeSquare) activeSquare.classList.add('selected');
            }
        }
    }

    function clearHighlights(squares) {
        squares.forEach(sq => {
            sq.classList.remove('selected');
            sq.classList.remove('last-move');
        });
    }

    // Classic Notation Logging Formula Converter for Side Action Panel
    function logEsportsMove(piece, fromR, fromC, toR, toC) {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        
        const moveNotation = `${files[toC]}${ranks[toR]}`;
        
        const moveBadge = document.createElement('span');
        moveBadge.style.background = '#1a1a24';
        moveBadge.style.padding = '2px 6px';
        moveBadge.style.borderRadius = '4px';
        moveBadge.style.border = '1px solid #333';
        moveBadge.innerText = moveNotation;
        
        moveListContainer.appendChild(moveBadge);
        moveListContainer.scrollTop = moveListContainer.scrollHeight; // Auto Scroll
    }
});
