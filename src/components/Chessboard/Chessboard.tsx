import{ useRef, useState} from 'react';
import './Chessboard.css';
import Tile from '../Tile/Tile';
import Referee from "../../referee/Referee";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE, BOARD_SIZE, BOARD_OFFSET, Position, Piece, TeamType, PieceType, initialBoardState, samePosition } from '../../Constants';
import { type } from 'os';


// TODO: Add a way to have it console.log moves as they would be recorded in the chess format
// Deal with checks and checkmates
// King movement and castling
// Clean up Queen movement and rook movement
// Add log on side of chess board with moves in chess format e.g. 1. e4 e5
// Add the rest of the user interface for the web
// Highlight which square the last move came from 
// Add stockfish or other open source bot to play against
// Finish videos


export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const [grabPosition, setGrabPosition] = useState<Position>({x : -1, y: -1});
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);


    // // Keeps track of moves in chess notation

    // const [moves, setMoves] = useState<string[]>([]); // State to keep track of moves
    
    
    // function convertToChessNotation(move: { x: number; y: number }): string {
    //     const col = HORIZONTAL_AXIS[move.x];
    //     const row = VERTICAL_AXIS.length - move.y;
    //     return `${col}${row}`;
    // }

    const referee = new Referee;

    function updateValidMoves(){
        setPieces((currentPieces) => {
            return currentPieces.map(p => {
                p.possibleMoves = referee.getValidMoves(p, currentPieces);
                return p;
            });
        });
    }
    function positionToNotation(position: Position, team: TeamType){
      
            const columnLetter = String.fromCharCode(97 + position.x); // Convert x to ASCII code and then to corresponding letter ('a' for 0, 'b' for 1, and so on)
            const rowNumber = position.y; // Chess rows are 1-indexed
        
            return `${columnLetter}${rowNumber}`;
    }
    

    function grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
        updateValidMoves();

        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if(element.classList.contains("chess-piece") && chessboard){
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const grabY = (Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - BOARD_SIZE) / GRID_SIZE)));
            setGrabPosition({
                x: grabX, 
                y: grabY
            });
            
    

            const x = e.clientX - GRID_SIZE/2;
            const y = e.clientY - GRID_SIZE/2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            
            setActivePiece(element);
            

        }
    }

    // MOVE PIECE

    function movePiece(e: React.MouseEvent){
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const minX = chessboard.offsetLeft - BOARD_OFFSET / 2;
            const minY = chessboard.offsetTop - BOARD_OFFSET / 2;

            const maxX = chessboard.offsetLeft + chessboard.clientWidth - BOARD_OFFSET;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - BOARD_OFFSET;

            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;

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
        if(activePiece && chessboard && grabPosition) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - BOARD_SIZE) / GRID_SIZE));

            const currentPiece = pieces.find(p => p.position.x === grabPosition.x && p.position.y === grabPosition.y);
            
            if(currentPiece){
                const validMove = referee.isValidMove(grabPosition, {x: x, y: y}, currentPiece.type, currentPiece.team, pieces);

                const isEnPassantMove = referee.isEnPassantMove(grabPosition, {x: x, y: y}, currentPiece.type, currentPiece.team, pieces);

                const pawnDirection = (currentPiece.team === TeamType.OUR) ? 1: -1;
                

            
                if(isEnPassantMove) {
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if(samePosition(grabPosition, piece.position)) {
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } 
                        else if(!samePosition(piece.position, {x: x, y: y-pawnDirection})){
                            if(piece.type === PieceType.PAWN){
                                piece.enPassant = false;
                            }
                            console.log(positionToNotation(piece.position, piece.team));
                            console.log(piece.position);
                            results.push(piece);
                        }
                        return results;

                    }, [] as Piece[])

                    setPieces(updatedPieces);
                }
                else if(validMove) {
                    // updates position and if a piece is attacked it gets removed
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if(samePosition(grabPosition, piece.position)){
                            // SPECIAL MOVE
                            piece.enPassant = 
                            Math.abs(grabPosition.y - y) === 2 && 
                            piece.type === PieceType.PAWN;

                            piece.position.x = x;
                            piece.position.y = y;

                            let promotionRow = (piece.team === TeamType.OUR) ? 7 : 0;

                            if (y === promotionRow && piece.type === PieceType.PAWN) {
                                modalRef.current?.classList.remove("hidden");
                                setPromotionPawn(piece);
                                console.log("Promotion");

                            }

                            results.push(piece);
                        }
                        else if(!(samePosition(piece.position, {x: x, y: y}))){
                            if(piece.type === PieceType.PAWN){
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }
                        
                        return results;
                    }, [] as Piece[])
                    
                    setPieces(updatedPieces);

                    // const notation = `${convertToChessNotation(grabPosition)} ${convertToChessNotation({
                    //     x,
                    //     y,
                    //   })}`;
                    //   setMoves((prevMoves) => [...prevMoves, notation]);
              
                    //   // Log the moves to the console
                    //   console.log(moves.join(' '));
                    
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
    function promotionTeamType(){
        return (promotionPawn?.team === TeamType.OUR) ? "w" : "b";
    }
    function promotePawn(pieceType: PieceType){
        if(promotionPawn === undefined){
            return;
        }

        const updatedPieces = pieces.reduce((results, piece) => {
            if(samePosition(piece.position, promotionPawn.position)) {
                piece.type = pieceType;
                const team = piece.team === TeamType.OUR ? "w" : "b";
                let image = ""
                switch(pieceType){
                    case PieceType.QUEEN:
                        image = "queen"
                        break;
                    case PieceType.ROOK:
                        image = "rook"
                        break;
                    case PieceType.BISHOP:
                        image = "bishop"
                        break;
                    case PieceType.KNIGHT:
                        image = "knight"
                        break;
                }
                piece.image = `assets/images/${image}_${team}.png`;
            }
            results.push(piece);
            return results;
        }, [] as Piece[]);
        
        setPieces(updatedPieces);

        modalRef.current?.classList.add("hidden");

    }
    
    let board = [];

        for(let j = VERTICAL_AXIS.length - 1; j >= 0; j--){
            for(let i = 0; i < HORIZONTAL_AXIS.length; i++){
                const number = j + i + 2;
                let image = "";
                pieces.forEach(p => {
                    if(samePosition(p.position, {x: i, y: j})){
                        image = p.image;
                    }
                  });
                let currentPiece = activePiece != null ? pieces.find(p => samePosition(p.position, grabPosition)) : undefined;
                let highlight = currentPiece?.possibleMoves ? 
                currentPiece.possibleMoves.some(p => samePosition(p, {x: i, y: j})) : false;
            
                board.push(<Tile key={`${i},${j}`} image={image} number= {number} highlight = {highlight} />);
               
        }
        const tile = board.find(t => t.key === "1, 0");
       

    }
    return (
        <>
        <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
            <div className="modal-body">
                <img onClick={() => promotePawn(PieceType.QUEEN)} src = {`/assets/images/queen_${promotionTeamType()}.png`} />
                <img onClick={() => promotePawn(PieceType.ROOK)} src = {`/assets/images/rook_${promotionTeamType()}.png`}/>
                <img onClick={() => promotePawn(PieceType.KNIGHT)} src = {`/assets/images/knight_${promotionTeamType()}.png`} />
                <img onClick={() => promotePawn(PieceType.BISHOP)} src = {`/assets/images/bishop_${promotionTeamType()}.png`} />
            </div>
        </div>
            <div
                onMouseMove={e => movePiece(e)} 
                onMouseDown={e => grabPiece(e)} 
                onMouseUp={e => dropPiece(e)}
                id="chessboard"
                ref = {chessboardRef}
            >
                {board}
            </div>
        </>
    );
}
