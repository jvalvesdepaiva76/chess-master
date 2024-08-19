// components/Chessboard.js
function posToIndices(pos) {
    if (!pos || pos.length !== 2) {
        throw new Error(`Invalid position: ${pos}`);
    }
    
    const file = pos.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - parseInt(pos[1], 10);
    return [rank, file];
}

export function createChessboard(container) {
    const board = [];
    const pieces = {};

    // Limpar o container antes de criar o tabuleiro
    container.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((i + j) % 2 === 0 ? 'white' : 'black');

            const position = String.fromCharCode('a'.charCodeAt(0) + j) + (8 - i);
            pieces[position] = null;
            container.appendChild(square);
            board.push(square);
        }
    }

    const initialPositions = {
        'a1': 'wr', 'b1': 'wn', 'c1': 'wb', 'd1': 'wq', 'e1': 'wk', 'f1': 'wb', 'g1': 'wn', 'h1': 'wr',
        'a2': 'wp', 'b2': 'wp', 'c2': 'wp', 'd2': 'wp', 'e2': 'wp', 'f2': 'wp', 'g2': 'wp', 'h2': 'wp',
        'a7': 'bp', 'b7': 'bp', 'c7': 'bp', 'd7': 'bp', 'e7': 'bp', 'f7': 'bp', 'g7': 'bp', 'h7': 'bp',
        'a8': 'br', 'b8': 'bn', 'c8': 'bb', 'd8': 'bq', 'e8': 'bk', 'f8': 'bb', 'g8': 'bn', 'h8': 'br',
    };

    for (const [position, pieceCode] of Object.entries(initialPositions)) {
        const [row, col] = posToIndices(position);
        const square = board[row * 8 + col];
        const img = document.createElement('img');
        img.src = `/assets/${pieceCode}.png`;
        img.classList.add('piece');
        square.appendChild(img);
        pieces[position] = pieceCode;
    }

    return { board, pieces };
}

// Função para mover uma peça no tabuleiro
export function movePiece(board, pieces, from, to) {
    if (!from || !to || !pieces[from]) {
        console.error(`Invalid move from ${from} to ${to}`);
        return;
    }

    const [fromRow, fromCol] = posToIndices(from);
    const [toRow, toCol] = posToIndices(to);

    const piece = pieces[from];
    pieces[to] = piece;
    pieces[from] = null;

    const fromSquare = board[fromRow * 8 + fromCol];
    const toSquare = board[toRow * 8 + toCol];
    toSquare.innerHTML = fromSquare.innerHTML;
    fromSquare.innerHTML = '';
}
