/*             // Prevent making a move onto the exact same grid point
            if (prevRow === row && prevCol === col) {
      /* ==========================================================================
   KINGMASTER PREMIUM ESPORTS THEME — LUXURY BLACK & NEON GLOW SYSTEM
   ========================================================================== */

:root {
    --bg-deep-black: #050507;
    --card-bg: #0d0d12;
    --sub-box-bg: #13131c;
    
    /* Neon Accent Colors */
    --accent-purple: #8257e5;
    --accent-blue: #248aff;
    --accent-green: #10b981;
    --accent-gold: #f59e0b;
    --accent-gold-gradient: linear-gradient(90deg, #f59e0b 0%, #eab308 100%);
    
    /* Text Variables */
    --text-white: #ffffff;
    --text-gray: #9ca3af;
    --text-muted: #6b7280;
    
    /* Board Variables */
    --board-light: #dec096;
    --board-dark: #8b5a2b;
}

* {
    box-sizing:
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
