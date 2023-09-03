import {TeamType , Piece, Position} from "../../Constants";

export const tileIsEmptyOrOccupiedByOpponent = (position: Position, boardState: Piece[], team: TeamType): boolean => {
    return !tileIsOccupied(position, boardState) || tileIsOccupiedByOpponent(position, boardState, team);
}

export const tileIsOccupied = (position: Position, boardState: Piece[]): boolean => {
    const piece = boardState.find(p => p.position.x === position.x && p.position.y === position.y);
    if(piece){
        return true;
    }
    else {
        return false;
    }
}

export const tileIsOccupiedByOpponent = (position: Position, boardState: Piece[], team: TeamType): boolean => {
    const piece = boardState.find(p => p.position.x === position.x && p.position.y === position.y && p.team !== team);
    if (piece) {
        return true;
    }
    else{
        return false;
    }
}