export function loadPGN(pgnText) {
    // Dividir as linhas do texto
    const lines = pgnText.split('\n').filter(line => line.trim() !== '');
    
    // Filtrar as linhas que não começam com "[" (metadados) ou números (jogadas)
    const movesText = lines.filter(line => !line.startsWith('[') && !line.startsWith('1-0') && !line.startsWith('0-1') && !line.startsWith('1/2-1/2')).join(' ');

    // Dividir em jogadas e remover as numerações
    const moves = movesText.split(/\d+\./).filter(Boolean).flatMap(move => move.trim().split(/\s+/));

    const formattedMoves = moves.map((move, index) => {
        // Assumindo que a entrada é uma jogada como 'e4', 'Nf3', 'O-O', etc.
        const moveObj = { move, id: index, from: null, to: null };

        // Movimentos básicos e capturas
        if (/^[a-h][1-8]$/.test(move.slice(0, 2))) {
            moveObj.to = move.slice(0, 2);
            if (move.length === 2) {
                // Exemplos: e4, d5
                moveObj.from = guessMoveFrom(moveObj.to, moveObj.move);
            } else if (move.length === 4) {
                // Exemplos: e2e4, g1f3
                moveObj.from = move.slice(2, 4);
            }
        } else if (move === 'O-O' || move === 'O-O-O') {
            // Roque
            moveObj.from = move === 'O-O' ? 'e1' : 'e1';  // Exemplo para o roque do lado do rei
            moveObj.to = move === 'O-O' ? 'g1' : 'c1';   // Exemplo para o roque do lado da rainha
        } else {
            // Capturas
            const captureMatch = move.match(/^([a-h])x([a-h][1-8])$/);
            if (captureMatch) {
                moveObj.from = guessMoveFrom(captureMatch[2], moveObj.move);
                moveObj.to = captureMatch[2];
            }
        }

        return moveObj;
    });

    return formattedMoves;
}

function guessMoveFrom(to, move) {
    // Aqui precisaria ter uma lógica para adivinhar a origem da peça
    // com base no estado atual do tabuleiro, o que é mais complexo.
    // Para um exemplo simples, assumimos que é uma jogada simples como 'e2e4'.
    // O código real precisa da implementação completa de detecção de movimento.
    return 'e2'; // Exemplo genérico (não correto para todas as jogadas)
}
