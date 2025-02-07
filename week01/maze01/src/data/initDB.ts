import { createMaze, getMazeById, getAllMazeId, updateMaze , updateMazeName} from './queries';
// import { mazeModel } from '../maze01';
import { mazeModel } from '../maze03';
// import { mazeModel } from '../maze02';
// import { cons } from "effect/List";

// const maze = createMaze.run(
//     mazeModel.maze_id,
//     mazeModel.mazeName,
//     mazeModel.numCols,
//     mazeModel.numRows,
//     JSON.stringify(mazeModel.grid),
//     new Date().toISOString()
// );
// const maze = getMazeById.get("002");
const maze = getAllMazeId.all();

// const maze = updateMazeName.run(mazeModel.mazeName, mazeModel.maze_id);
console.log(maze);

// console.log(maze.map((m) => m.maze_id));
