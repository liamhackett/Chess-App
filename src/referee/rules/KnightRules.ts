import { PieceType, TeamType , Piece, Position} from "../../Constants";

import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

// Knight Function
export const knightMove = (initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]): boolean => {
    // KNIGHT MOVING LOGIC
    // 8 Different moving patterns
    for(let i = -1; i < 2; i+=2){
        for(let j = -1; j < 2; j+=2){
            if (desiredPosition.y - initialPosition.y === i * 2){
                if (desiredPosition.x - initialPosition.x === j){
                    return tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team);
                    
                }
            }
            else if (desiredPosition.x - initialPosition.x === i * 2){
                if(desiredPosition.y - initialPosition.y === j){
                    return tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team);
                }
            }
        }
    }
    return false;
}

export const getPossibleKnightMoves = (knight: Piece, boardState: Piece[]) : Position[] => {
    const possibleMoves: Position[] = [];

    for(let i = -1; i < 2; i+=2){
        for(let j = -1; j < 2; j+=2){
            const verticalMove: Position = {x: knight.position.x + j, y: knight.position.y + i * 2};
            const horizontalMove: Position = {x: knight.position.x + i * 2, y: knight.position.y + j};
            if(tileIsEmptyOrOccupiedByOpponent(verticalMove, boardState, knight.team)){
                possibleMoves.push(verticalMove);
            }
            if(tileIsEmptyOrOccupiedByOpponent(horizontalMove, boardState, knight.team)){
                possibleMoves.push(horizontalMove);
            }
        }
    }


    return possibleMoves;
}