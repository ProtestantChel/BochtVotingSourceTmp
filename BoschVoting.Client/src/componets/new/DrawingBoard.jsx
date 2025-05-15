import Board from "./Board";
export default function DrawingBoard(props) {
    return (
        <div style={{ width: "100%", height: "100%"}} className="drawingBoard" >
            <Board />
        </div>
    )
}