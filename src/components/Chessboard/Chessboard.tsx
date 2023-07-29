import Tile from '../Tile/Tile';
import './Chessboard.css';
import{ useRef, useState} from 'react';
import Referee from "../../referee/Referee";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

export interface Piece {
    image: string;
    x: number;
    y: number;
    type: PieceType;
    team: TeamType;
    enPassant?: boolean;
}

export enum PieceType {
    PAWN,
    BISHOP,
    KNIGHT,
    ROOK, 
    QUEEN,
    KING
}

export enum TeamType {
    OPPONENT,
    OUR
}

// const pieces: Piece[] = [];

const initialBoardState: Piece[] = [];

for(let p = 0; p < 2; p++){
    const teamType = (p === 0) ?  TeamType.OPPONENT : TeamType.OUR;
    const type = (teamType === TeamType.OPPONENT) ? "b" : "w";
    const y =  (teamType === TeamType.OPPONENT) ? 7 : 0;
    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 0, y: y, type: PieceType.ROOK, team: teamType});
    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 7, y: y, type: PieceType.ROOK, team: teamType});
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x: 1, y: y, type: PieceType.KNIGHT, team: teamType});
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x: 6, y: y, type: PieceType.KNIGHT, team: teamType});
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x: 2, y: y, type: PieceType.BISHOP, team: teamType});
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x: 5, y: y, type: PieceType.BISHOP, team: teamType});
    initialBoardState.push({image: `assets/images/queen_${type}.png`, x: 3, y: y, type: PieceType.QUEEN, team: teamType});
    initialBoardState.push({image: `assets/images/king_${type}.png`, x: 4, y: y, type: PieceType.KING, team: teamType});
}



for(let i = 0; i < 8; i++){
    initialBoardState.push({image: "assets/images/pawn_b.png", x: i, y: 6, type: PieceType.PAWN, team: TeamType.OPPONENT});
}

for(let i = 0; i < 8; i++){
    initialBoardState.push({image: "assets/images/pawn_w.png", x: i, y: 1, type: PieceType.PAWN, team: TeamType.OUR});
}

export default function Chessboard() {
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);

    const referee = new Referee;

    // let activePiece: HTMLElement | null = null;
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);


    function grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if(element.classList.contains("chess-piece") && chessboard){
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 75));
            setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 600) / 75)));
    

            const x = e.clientX - 40;
            const y = e.clientY - 40;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            // activePiece = element;
            setActivePiece(element);

        }
    }

    // MOVE PIECE

    function movePiece(e: React.MouseEvent){
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const minX = chessboard.offsetLeft - 25;
            const minY = chessboard.offsetTop -25;

            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 50;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 50;

            const x = e.clientX - 40;
            const y = e.clientY - 40;

            activePiece.style.position = "absolute";
            
            // if x is smaller than min
            if (x < minX) {
                activePiece.style.left = `${minX}px`;
            }
            // if x is greater than max
            else if(x > maxX) {
                activePiece.style.left = `${maxX}px`;
            }
            // if x within constraints
            else {
                activePiece.style.left = `${x}px`;
            }

            // if y is smaller than min
            if (y < minY) {
                activePiece.style.top = `${minY}px`;
            }
            // if y is greater than max
            else if(y > maxY) {
                activePiece.style.top = `${maxY}px`;
            }
            // if y is within constraints
            else {
                activePiece.style.top = `${y}px`;
            }
            
        }
    }

    // DROP PIECE

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 75);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 600) / 75));

            const currentPiece = pieces.find(p => p.x === gridX && p.y === gridY);

            const attackedPiece = pieces.find(p => p.x === x && p.y === y);

            if(currentPiece){
                const validMove = referee.isValidMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces);
                
                const isEnPassantMove = referee.isEnPassantMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces);

                const pawnDirection = (currentPiece.team === TeamType.OUR) ? 1: -1;
                
                if(isEnPassantMove) {
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if(piece.x === gridX && piece.y === gridY){
                            piece.enPassant = false;
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);
                        } 
                        else if(!(piece.x === x && piece.y === y - pawnDirection)){
                            if(piece.type === PieceType.PAWN){
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }
                        return results;

                    }, [] as Piece[])

                    setPieces(updatedPieces);
                }
                else if(validMove) {
                    // updates position and if a piece is attacked it gets removed
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if(piece.x === gridX && piece.y === gridY){
                            if(Math.abs(gridY - y)=== 2 && piece.type === PieceType.PAWN){
                                //Special move
                                piece.enPassant = true;
                            } else{
                                piece.enPassant = false;
                            }
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);
                        }
                        else if(!(piece.x === x && piece.y === y)){
                            if(piece.type === PieceType.PAWN){
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }
                        
                        return results;
                    }, [] as Piece[])
                    
                    setPieces(updatedPieces);

               
                }
                else {
                    // resets piece position
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
            }

          
        
            setActivePiece(null);
        }
    }

    
    let board = [];

        for(let j = verticalAxis.length - 1; j >= 0; j--){
            for(let i = 0; i < horizontalAxis.length; i++){
                const number = j + i + 2;
                let image = "";
                pieces.forEach(p => {
                    if(p.x === i && p.y === j){
                        image = p.image;
                    }
                  });
                board.push(<Tile key={`${i},${j}`} image={image} number= {number} />);
               
        }
    }
    return <div 
        onMouseMove={e => movePiece(e)} 
        onMouseDown={e => grabPiece(e)} 
        onMouseUp={e => dropPiece(e)}
        id="chessboard"
        ref = {chessboardRef}
    >
        {board}
    </div>
}
