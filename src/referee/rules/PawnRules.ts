import { PieceType, TeamType , Piece, Position, samePosition} from "../../Constants";

import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const pawnMove = (initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]): boolean => {
    const specialRow = team === TeamType.OUR ? 1 : 6;
    const pawnDirection = team === TeamType.OUR ? 1 : -1;
    
    // Forward movement
    if (initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2 * pawnDirection) {
        return !tileIsOccupied(desiredPosition, boardState) && !tileIsOccupied({ x: desiredPosition.x, y: desiredPosition.y - pawnDirection }, boardState);
    }
    
    // Normal forward movement
    if (desiredPosition.x === initialPosition.x && (desiredPosition.y - initialPosition.y === pawnDirection)) {
        return !tileIsOccupied(desiredPosition, boardState);
    }
    
    // Taking a piece diagonally
    if (Math.abs(desiredPosition.x - initialPosition.x) === 1 && desiredPosition.y - initialPosition.y === pawnDirection) {
        return tileIsOccupiedByOpponent(desiredPosition, boardState, team);
    }

    return false;
}

// export const isEnPassantMove = (initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]) : boolean =>{
//     const pawnDirection = (team === TeamType.OUR) ? 1: -1;
   
//     // upper left or upper right || bottom left or bottom right
//     // if a piece is under or above the attacked tile

//     if (type == PieceType.PAWN){
//         if ((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1)&& desiredPosition.y - initialPosition.y === pawnDirection){
//             const piece = boardState.find(p => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.enPassant);
//             if(piece){
//                 return true;
//             }
//         }
//     }
   
//    return false;
//  }


export const getPossiblePawnMoves = (pawn: Piece, boardState: Piece[]) : Position[] => {
    const possibleMoves: Position[] = [];

    const specialRow = pawn.team === TeamType.OUR ? 1 : 6;
    const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;
    const normalMove: Position = {x: pawn.position.x, y: pawn.position.y + pawnDirection};
    const specialMove: Position = {x: pawn.position.x, y: pawn.position.y + pawnDirection * 2};
    const upperLeftAttack: Position = {x: pawn.position.x - 1, y: pawn.position.y + pawnDirection};
    const upperRightAttack: Position = {x: pawn.position.x + 1, y: pawn.position.y + pawnDirection};

    const leftPosition: Position = {x: pawn.position.x - 1, y: pawn.position.y};
    const rightPosition: Position = {x: pawn.position.x + 1, y: pawn.position.y};


    if(!tileIsOccupied(normalMove, boardState)){
        possibleMoves.push({x: pawn.position.x, y: pawn.position.y + pawnDirection});

        if(pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)) {
            possibleMoves.push({x: pawn.position.x, y: pawn.position.y + pawnDirection * 2});
        }
    }
    
    if(tileIsOccupiedByOpponent(upperLeftAttack,boardState,  pawn.team)){
        possibleMoves.push(upperLeftAttack);
    }
    else if(!tileIsOccupied(upperLeftAttack, boardState)) {
        const leftPiece = boardState.find(p => samePosition(p.position, leftPosition));
        if(leftPiece != null && leftPiece.enPassant){
            possibleMoves.push(upperLeftAttack);
        }
    }
    if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)){
        possibleMoves.push(upperRightAttack);
    }
    else if(!tileIsOccupied(upperRightAttack, boardState)) {
        const rightPiece = boardState.find(p => samePosition(p.position, rightPosition));
        if(rightPiece != null && rightPiece.enPassant){
            possibleMoves.push(upperRightAttack);
        }
    }


    return possibleMoves;
}