import { movePiece } from './Chessboard.js';

export function loadPGN(pgnText, board, pieces) {
    console.log("Iniciando o carregamento do PGN...");
    const lines = pgnText.split('\n').filter(line => line.trim() !== '');
    const movesText = lines.filter(line => !line.startsWith('[') && !line.startsWith('1-0') && !line.startsWith('0-1') && !line.startsWith('1/2-1/2')).join(' ');

    const moves = movesText.split(/\d+\./).filter(Boolean).flatMap(move => move.trim().split(/\s+/));
    console.log("Movimentos extraídos:", moves);

    let currentPlayer = 'white';  // Alternar entre 'white' e 'black'
    
    const formattedMoves = moves.map((move, index) => {
        const moveObj = { move, id: index, from: null, to: null };

        console.log(`Processando movimento ${index + 1}:`, move);

        if (move === 'O-O' || move === 'O-O-O') {
            moveObj.from = currentPlayer === 'white' ? 'e1' : 'e8';
            moveObj.to = move === 'O-O' ? (currentPlayer === 'white' ? 'g1' : 'g8') : (currentPlayer === 'white' ? 'c1' : 'c8');
            console.log(`Roque detectado: de ${moveObj.from} para ${moveObj.to}`);
        } else {
            moveObj.to = move.slice(-2);  // Casa de destino
            console.log(`Casa de destino identificada: ${moveObj.to}`);
            moveObj.from = guessMoveFrom(moveObj.to, move, board, pieces, currentPlayer);
            if (!moveObj.from) {
                console.error(`Não foi possível determinar a origem do movimento: ${move}`);
            } else {
                console.log(`Casa de origem identificada: ${moveObj.from}`);
            }
        }

        currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
        return moveObj;
    });

    console.log("Movimentos formatados:", formattedMoves);
    return formattedMoves;
}

function guessMoveFrom(to, move, board, pieces, currentPlayer) {
    const isCapture = move.includes('x');
    const pieceType = move.length === 2 || isCapture ? 'p' : move[0].toLowerCase(); // Peão se for notação curta ou captura
    const isWhite = currentPlayer === 'white';
    
    console.log(`Tentando adivinhar origem para: ${move}. Tipo de peça: ${pieceType}, Jogador: ${currentPlayer}`);

    const possibleMoves = {
        p: (from, to) => {
            const direction = isWhite ? 1 : -1;
            const fromRank = parseInt(from[1], 10);
            const toRank = parseInt(to[1], 10);
            const fromFile = from[0];
            const toFile = to[0];

            if (isCapture) {
                // Captura diagonal de peão
                return Math.abs(fromFile.charCodeAt(0) - toFile.charCodeAt(0)) === 1 && (toRank - fromRank) === direction;
            } else {
                // Movimento simples ou duplo do peão
                return fromFile === toFile && ((toRank - fromRank) === direction || 
                       (toRank - fromRank) === direction * 2 && fromRank === (isWhite ? 2 : 7));
            }
        },
        n: (from, to) => {
            const dx = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
            const dy = Math.abs(parseInt(from[1], 10) - parseInt(to[1], 10));
            return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
        },
        b: (from, to) => {
            const dx = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
            const dy = Math.abs(parseInt(from[1], 10) - parseInt(to[1], 10));
            return dx === dy;
        },
        r: (from, to) => {
            const dx = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
            const dy = Math.abs(parseInt(from[1], 10) - parseInt(to[1], 10));
            return dx === 0 || dy === 0;
        },
        q: (from, to) => {
            const dx = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
            const dy = Math.abs(parseInt(from[1], 10) - parseInt(to[1], 10));
            return dx === dy || dx === 0 || dy === 0;
        },
        k: (from, to) => {
            const dx = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
            const dy = Math.abs(parseInt(from[1], 10) - parseInt(to[1], 10));
            return dx <= 1 && dy <= 1;
        }
    };

    let candidatePositions = Object.keys(pieces).filter(from => {
        if (!pieces[from]) return false;
        if (pieces[from][0] === (isWhite ? 'w' : 'b') && pieces[from][1] === pieceType) {
            return possibleMoves[pieceType](from, to);
        }
        return false;
    });

    console.log(`Posições candidatas para ${move}:`, candidatePositions);

    // Captura de peão: Filtra movimentos pela coluna de origem
    if (isCapture && pieceType === 'p') {
        const fromFile = move[0]; // Identifica a coluna do peão que fez a captura
        candidatePositions = candidatePositions.filter(from => from[0] === fromFile);
        console.log(`Posições filtradas para captura de peão: ${move}:`, candidatePositions);
    }

    if (candidatePositions.length === 1) {
        console.log(`Casa de origem encontrada para ${move}:`, candidatePositions[0]);
        return candidatePositions[0];
    }

    console.warn(`Movimento ambíguo: ${move}. Possíveis origens: ${candidatePositions.join(', ')}`);
    return candidatePositions.length ? candidatePositions[0] : null;
}

