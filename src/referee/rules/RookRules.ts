import { samePosition, PieceType, TeamType , Piece, Position} from "../../Constants";

import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent, tileIsOccupiedByOpponent } from "./GeneralRules";
 
 // Rook function
 export const rookMove = (initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]) : boolean =>{
    // ROOK MOVING AND ATTACK LOGIC
    for (let i = 1; i < 8; i++){
        // Vertical Movement
        let passedPosition;
        if(initialPosition.x === desiredPosition.x){
            let multiplier = (desiredPosition.y < initialPosition.y) ? -1 : 1;
            passedPosition = {x: initialPosition.x, y: initialPosition.y + (i * multiplier)};
        }
        // Horizontal
        else if(initialPosition.y === desiredPosition.y){
            let multiplier = (desiredPosition.x < initialPosition.x) ? -1 : 1;
            passedPosition= {x: initialPosition.x + (i * multiplier), y: initialPosition.y};

        }
        if(passedPosition) {
            if (samePosition(passedPosition, desiredPosition)) {
                return tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team);
            }
            else if (tileIsOccupied(passedPosition, boardState)){
                break;
            }
        }
    }
    
    return false;

}

export const getPossibleRookMoves = (rook: Piece, boardState: Piece[]): Position[] => {
    const directions: Position[] = [
        { x: 0, y: 1 },   // Up
        { x: 1, y: 0 },   // Right
        { x: 0, y: -1 },  // Down
        { x: -1, y: 0 },  // Left
    ];

    const possibleMoves: Position[] = [];

    for (const direction of directions) {
        for (let i = 1; i < 8; i++) {
            const destination: Position = {
                x: rook.position.x + direction.x * i,
                y: rook.position.y + direction.y * i
            };

            if (!tileIsOccupied(destination, boardState)) {
                possibleMoves.push(destination);
            } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
                possibleMoves.push(destination);
                break;
            } else {
                break;
            }
        }
    }

    return possibleMoves;
};
