import { samePosition, PieceType, TeamType , Piece, Position} from "../../Constants";

import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent, tileIsOccupiedByOpponent } from "./GeneralRules";

// Bishop Function
export const bishopMove = (initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]): boolean => {
    // BISHOP MOVING AND ATTACK LOGIC
    
    for (let i = 1; i < 8; i++){

        // diagonal 
        let multiplierX = (desiredPosition.x < initialPosition.x) ? -1 : 1;
        let multiplierY = (desiredPosition.y < initialPosition.y) ? -1 : 1;
        
        let passedPosition: Position = {x: initialPosition.x + (i * multiplierX), y: initialPosition.y + (i * multiplierY)};

        if(samePosition(passedPosition, desiredPosition)){
            return tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team);
        }
        else{
            if(tileIsOccupied(passedPosition, boardState)){
                break;
            }
        }
    }

    return false;
}


export const getPossibleBishopMoves = (bishop: Piece, boardState: Piece[]): Position[] => {
    const directions: Position[] = [
        { x: 1, y: 1 },   // Up-Right
        { x: -1, y: -1 }, // Down-Left
        { x: 1, y: -1 },  // Down-Right
        { x: -1, y: 1 },  // Up-Left
    ];

    const possibleMoves: Position[] = [];

    for (const direction of directions) {
        for (let i = 1; i < 8; i++) {
            const destination: Position = {
                x: bishop.position.x + direction.x * i,
                y: bishop.position.y + direction.y * i
            };

            if (!tileIsOccupied(destination, boardState)) {
                possibleMoves.push(destination);
            } else if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
                possibleMoves.push(destination);
                break;
            } else {
                break;
            }
        }
    }

    return possibleMoves;
};
