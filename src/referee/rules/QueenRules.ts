import { samePosition, PieceType, TeamType , Piece, Position} from "../../Constants";

import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent, tileIsOccupiedByOpponent } from "./GeneralRules";

export const queenMove = (initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]): boolean => {
    // if (desiredPosition.x === initialPosition.x || desiredPosition.y === initialPosition.y){
    //     return this.queenMove(initialPosition, desiredPosition, type, team, boardState);
    // }
    // else{
    //     return this.queenMove(initialPosition, desiredPosition, type, team, boardState);

    // }
    for(let i = 1; i < 8; i++){
        const multiplierX = desiredPosition.x < initialPosition.x ? -1 : desiredPosition.x > initialPosition.x ? 1 : 0;

        const multiplierY = desiredPosition.y < initialPosition.y ? -1 : desiredPosition.y > initialPosition.y ? 1 : 0;
        
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

export const getPossibleQueenMoves = (queen: Piece, boardState: Piece[]): Position[] => {
    const directions: Position[] = [
        { x: 1, y: 0 },   // Right
        { x: -1, y: 0 },  // Left
        { x: 0, y: 1 },   // Up
        { x: 0, y: -1 },  // Down
        { x: 1, y: 1 },   // Up-Right
        { x: -1, y: 1 },  // Up-Left
        { x: 1, y: -1 },  // Down-Right
        { x: -1, y: -1 }, // Down-Left
    ];

    const possibleMoves: Position[] = [];

    for (const direction of directions) {
        for (let i = 1; i < 8; i++) {
            const destination: Position = {
                x: queen.position.x + direction.x * i,
                y: queen.position.y + direction.y * i
            };

            if (!tileIsOccupied(destination, boardState)) {
                possibleMoves.push(destination);
            } else if (tileIsOccupiedByOpponent(destination, boardState, queen.team)) {
                possibleMoves.push(destination);
                break;
            } else {
                break;
            }
        }
    }

    return possibleMoves;
};
