import { samePosition, PieceType, TeamType , Piece, Position} from "../../Constants";

import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const kingMove = (initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]): boolean => {
    // Basic king movement
    const multiplierX = desiredPosition.x < initialPosition.x ? -1 : desiredPosition.x > initialPosition.x ? 1 : 0;

    const multiplierY = desiredPosition.y < initialPosition.y ? -1 : desiredPosition.y > initialPosition.y ? 1 : 0;
    
    let passedPosition: Position = {x: initialPosition.x + (1 * multiplierX), y: initialPosition.y + (1 * multiplierY)};

    if(samePosition(passedPosition, desiredPosition)){
        return tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team);
    }

    return false;
}

export const getPossibleKingMoves = (king: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];
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

    for (const direction of directions) {
        const destination: Position = {
            x: king.position.x + direction.x,
            y: king.position.y + direction.y
        };

        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
            possibleMoves.push(destination);
        }
    }
    
    return possibleMoves;
}
