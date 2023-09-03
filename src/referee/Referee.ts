import { PieceType, TeamType , Piece, Position} from "../Constants";
import { pawnMove, knightMove,  bishopMove, rookMove, queenMove, kingMove, getPossiblePawnMoves, getPossibleKnightMoves, getPossibleBishopMoves, getPossibleRookMoves, getPossibleQueenMoves, getPossibleKingMoves} from "./rules";

export default class Referee {
    
    isEnPassantMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]){
        const pawnDirection = (team === TeamType.OUR) ? 1: -1;
       
        // upper left or upper right || bottom left or bottom right
        // if a piece is under or above the attacked tile

        if (type == PieceType.PAWN){
            if ((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1)&& desiredPosition.y - initialPosition.y === pawnDirection){
                const piece = boardState.find(p => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.enPassant);
                if(piece){
                    return true;
                }
            }    
        }
       return false;
    }
    
    // Valid Move Function
    isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]) {

        switch(type) {
            case PieceType.PAWN:
                return pawnMove(initialPosition, desiredPosition, type, team, boardState);
            
                case PieceType.KNIGHT:
                return knightMove(initialPosition, desiredPosition, type, team, boardState);
            
            case PieceType.BISHOP:
                return bishopMove(initialPosition, desiredPosition, type, team, boardState);
            
            case PieceType.ROOK:
                return rookMove(initialPosition, desiredPosition, type, team, boardState);
            
            case PieceType.QUEEN:
                return queenMove(initialPosition, desiredPosition, type, team, boardState);
            
            case PieceType.KING:
                return kingMove(initialPosition, desiredPosition, type, team, boardState);
        }
    }

    getValidMoves(piece: Piece, boardState: Piece[]) : Position[] {
         switch(piece.type){

            case PieceType.PAWN:
                return getPossiblePawnMoves(piece, boardState);
            case PieceType.KNIGHT:
                return getPossibleKnightMoves(piece, boardState);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(piece, boardState);
            case PieceType.ROOK:
                return getPossibleRookMoves(piece, boardState);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(piece, boardState);
            case PieceType.KING:
                return getPossibleKingMoves(piece, boardState);
            default: return [];


         }
 
    }


}