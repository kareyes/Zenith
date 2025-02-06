import { createMaze, getMazeById, getAllMazeId, updateMaze } from './queries';
// import { mazeModel } from '../maze01';
import { mazeModel } from '../maze03';
// import { cons } from "effect/List";

// const maze = createMaze.run(
//     "003",
//     mazeModel.numCols,
//     mazeModel.numRows,
//     JSON.stringify(mazeModel.grid),
//     new Date().toISOString()
// );
// const maze = getMazeById.get("002");
// const maze = getAllMazeId.all();

const maze = updateMaze.run(JSON.stringify(mazeModel.grid), '003');
console.log(maze);

// console.log(maze.map((m) => m.maze_id));
