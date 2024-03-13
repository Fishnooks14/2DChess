import React, {useState, useRef, useEffect} from 'react';
import { Chess } from 'chess.js'

interface ChessComponentThings {
  onInvalidMove: (errorMessage: string) => void;
}

const columns: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"]



const ChessComponent: React.FC<ChessComponentThings> = ({ onInvalidMove }) => {
  const chessRef = useRef(new Chess())
  const [lastMove, setLastMove] = useState<string>("0");
  const [active, setActive] = useState<boolean>(false);
  const [lastSquare, setSquare] = useState<HtmlDivElement>();

  const moveHandler = (initial: string, final: string, promotionPiece?: string) => {
    const chess = chessRef.current;
    let moveOptions = { from: initial, to: final }

    //If a promotion piece is found in the parameter, it will add the information to the object
    if (promotionPiece) {
      moveOptions.promotion = promotionPiece
    }

    //If the move is valid, it will return the all relevant information and execute move. If not, it will be null.
    console.log(moveOptions)
    const move = chess.move(moveOptions)
    
    // if (move == null) {
    //   //Creates an error message which can be accessed by the parent component
    //   onInvalidMove("Invalid")
    // } // Should automatically update board state if not invalid

    return move
  }



  const squareHandler = (square: HTmlDivElement, info: string) => {
    let row: String = String(parseInt(8 - (info[0])))
    let column: String = columns[parseInt(info[1])]
    let move: String = column + row
    if (active) {
      setActive(false)
      const nullCheck: () => void = () => moveHandler(lastMove, move);
      if (nullCheck() != null) {
        let ele: HTMLElement = document.querySelector('.board').children[6].children[4]
        setTimeout(() => {
            ele.removeChild(ele.children[0]);
            console.log(ele, ele.children[0]);
            onInvalidMove("Invalid")
        }, 0);
      }
    } else {
      setActive(true) 
      setLastMove(move)
      setSquare(square)
    }
  }

  const BoardGenerator = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const root = rootRef.current
      if (root.children.length < 1) {
        const board = document.createElement("div")
        board.classList.add("board")
        for (let i = 0; i < 8; i++) {
          const row: HTMLDivElement = document.createElement("div");
          row.classList.add("row")
          for (let j = 0; j < 8; j++) {
            const square: HTMLDivElement = document.createElement("div")
            square.setAttribute('info', String(i) + String(j)) 
            square.classList.add("square")
            if (i == 0 || i == 1 || i == 6 || i == 7) {
                const piece: HTMLDivElement = document.createElement("div")
                piece.setAttribute('info', String(i) + String(j)) 
                piece.classList.add("piece")
                square.append(piece)
            }
            let k: int
            if (i % 2 == 1) {
              k = j + 1
            } else {k = j}
            let index: int = i * 8 + k
            if (index % 2 == 0) {
              square.classList.add("dark")
            } else {
              square.classList.add("light")
            }
            square.addEventListener('click', function() {
              squareHandler(square, square.getAttribute('info'))
            })
            row.append(square)
          }
          board.append(row)
        }


        root.appendChild(board)
      }
      
    })

    return(
      <div ref={rootRef}></div>
    )
    
  }



  // const resetChess = () => {
  //   chessRef.current = new Chess()
  // }
  
  return (
    <div>
      <BoardGenerator/>
    </div>
  )


}

export default ChessComponent; 