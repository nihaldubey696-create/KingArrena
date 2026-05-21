
document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');
    
    const navPlayTrigger = document.getElementById('nav-play-trigger');
    const btnBackLobby = document.getElementById('btn-back-lobby');
    const btnResign = document.getElementById('btn-resign');
    const btnFlip = document.getElementById('btn-flip');
    
    const cardFriendFree = document.getElementById('btn-friend-free');
    const cardFriendPaid = document.getElementById('btn-friend-paid');
    const cardLobbyFree = document.getElementById('btn-lobby-free');
    const cardLobbyPaid = document.getElementById('btn-lobby-paid');

    const chessboard = document.getElementById('kingarena-board');
    let selectedSquare = null;
    let isBoardFlipped = false;

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

    const goToGameScreen = () => {
        if(homeScreen && gameScreen) {
            homeScreen.classList.remove('active');
            gameScreen.classList.add('active');
            generateBoard();
        }
    };

    const goToHomeScreen = () => {
        if(homeScreen && gameScreen) {
            gameScreen.classList.remove('active');
            homeScreen.classList.add('active');
            selectedSquare = null;
        }
    };

    if (cardFriendFree) cardFriendFree.addEventListener('click', goToGameScreen);
    if (cardFriendPaid) cardFriendPaid.addEventListener('click', goToGameScreen);
    if (cardLobbyFree) cardLobbyFree.addEventListener('click', goToGameScreen);
    if (cardLobbyPaid) cardLobbyPaid.addEventListener('click', goToGameScreen);
    if (navPlayTrigger) navPlayTrigger.addEventListener('click', goToGameScreen);
    if (btnBackLobby) btnBackLobby.addEventListener('click', goToHomeScreen);

    if (btnResign) {
        btnResign.addEventListener('click', () => {
            if (confirm("Are you sure you want to resign?")) goToHomeScreen();
        });
    }

    if (btnFlip) {
        btnFlip.addEventListener('click', () => {
            isBoardFlipped = !isBoardFlipped;
            generateBoard();
        });
    }

    function generateBoard() {
        if (!chessboard) return;
        chessboard.innerHTML = ''; 
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const actualRow = isBoardFlipped ? (7 - row) : row;
                const actualCol = isBoardFlipped ? (7 - col) : col;

                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((actualRow + actualCol) % 2 === 0 ? 'light' : 'dark');
                
                square.setAttribute('data-row', actualRow);
                square.setAttribute('data-col', actualCol);

                const pieceSymbol = currentBoardState[actualRow][actualCol];
                if (pieceSymbol !== '') {
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece');
                    pieceElement.innerText = pieceSymbol;
                    
                    const code = pieceSymbol.charCodeAt(0);
                    if (code >= 9812 && code <= 9817) {
                        pieceElement.style.color = '#ffffff';
                        pieceElement.style.filter = 'drop-shadow(1px 2px 2px #000)';
                    } else {
                        pieceElement.style.color = '#111116';
                        pieceElement.style.filter = 'drop-shadow(1px 1px 1px rgba(255,255,255,0.3))';
                    }
                    square.appendChild(pieceElement);
                }

                square.addEventListener('click', () => handleSquareTaps(actualRow, actualCol));
                chessboard.appendChild(square);
            }
        }
    }

    function handleSquareTaps(row, col) {
        const squares = document.querySelectorAll('.square');
        const clickedPiece = currentBoardState[row][col];
        
        if (selectedSquare) {
            const pRow = selectedSquare.row;
            const pCol = selectedSquare.col;

            if (pRow === row && pCol === col) {
                resetHighlights(squares);
                selectedSquare = null;
                return;
            }

            currentBoardState[row][col] = currentBoardState[pRow][pCol];
            currentBoardState[pRow][pCol] = '';

            selectedSquare = null;
            resetHighlights(squares);
            generateBoard();

            const targetSquare = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
            if (targetSquare) targetSquare.classList.add('last-move');
        } else {
            if (clickedPiece !== '') {
                selectedSquare = { row, col };
                resetHighlights(squares);
                const activeSquare = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
                if (activeSquare) activeSquare.classList.add('selected');
            }
        }
    }

    function resetHighlights(squares) {
        squares.forEach(sq => {
            sq.classList.remove('selected');
            sq.classList.remove('last-move');
        });
    }
});
