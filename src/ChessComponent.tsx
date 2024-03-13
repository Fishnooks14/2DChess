import React, { useState, useRef, useEffect } from "react";
import { Chess, Square } from "chess.js";

const ChessComponent: React.FC = () => {
    const chessRef = useRef(new Chess());
    let selectedSquare: string | null = null;
    let moveableSquares: string[] = [];
    const moveHandler = (
        initial: string,
        final: string,
        promotionPiece?: string
    ) => {
        const chess = chessRef.current;
        let moveOptions = {
            from: initial,
            to: final,
            promotion: promotionPiece,
        };

        //If the move is valid, it will return the all relevant information and execute move. If not, it will be null.
        const move = chess.move(moveOptions);
        console.log(move);

        selectedSquare = null;
        moveableSquares = [];

        /* update board */
        updateBoard();
    };

    const squareHandler = (move: string) => {
        if (moveableSquares.includes(move)) {
            if (selectedSquare != null) {
                moveHandler(selectedSquare, move);
            }
        } else if (move === selectedSquare) {
            selectedSquare = null;
            moveableSquares = [];
        } else {
            const squareData = chessRef.current.get(move as Square);
            if (squareData != null) {
                if (squareData.color === chessRef.current.turn()) {
                    selectedSquare = move;
                    const moves = chessRef.current
                        .moves({
                            square: move as Square,
                            verbose: true,
                        })
                        .map((move) => move.to);
                    moveableSquares = moves;
                    console.log(moveableSquares);
                }
            }
        }
    };

    const [squares, setSquares] = useState<React.ReactElement[][]>([]);

    const generateBoard = (): React.ReactElement[][] => {
        const board = [];
        for (let rank = 8; rank >= 1; rank--) {
            const row = [];
            for (let fileVal = 0; fileVal < 8; fileVal++) {
                const file = String.fromCharCode(97 + fileVal);
                const piece = chessRef.current.get((file + rank) as Square);
                const square = (
                    <button
                        key={`${file}${rank}`}
                        style={{
                            width: "50px",
                            height: "50px",
                            background:
                                (rank + file.charCodeAt(0)) % 2 === 0
                                    ? "lightgray"
                                    : "darkgray",
                        }}
                        onClick={() => squareHandler(file + rank)}
                    >
                        {piece ? piece.type : ""}
                    </button>
                );
                row.push(square);
            }
            board.push(row);
        }
        return board;
    };

    useEffect(() => {
        const newSquares = generateBoard();
        setSquares(newSquares);
    }, []);

    const updateBoard = () => {
        const newSquares = generateBoard();
        setSquares(newSquares);
    };

    return (
        <div className="flex flex-col">
            {squares.map((row) => (
                <div key={row[0].key} style={{ display: "flex" }}>
                    {row}
                </div>
            ))}
        </div>
    );
};

export default ChessComponent;
