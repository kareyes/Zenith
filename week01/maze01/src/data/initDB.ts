

import { createMaze, getMazeById, getAllMazeId, updateMaze } from "./queries"
import { mazeModel} from "../maze01"
// import { cons } from "effect/List";

// const maze = createMaze.run(
//     "002",
//     mazeModel.numCols,
//     mazeModel.numRows,
//     JSON.stringify(mazeModel.grid),
//     new Date().toISOString()
// );
// const maze = getMazeById.get("002");
// const maze = getAllMazeId.all();

const maze = updateMaze.run(
    JSON.stringify(mazeModel.grid),
    "001"
);
console.log(maze);    

// console.log(maze.map((m) => m.maze_id));