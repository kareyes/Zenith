

export const SELECTED_MAZE  = "SELECT * FROM mazes WHERE maze_id = ?";
export const SELECT_METADATA = "SELECT maze_id, mazeName, created_at FROM mazes";
export const UPDATE_MAZE = "UPDATE mazes SET grid = ? WHERE maze_id = ?";


export const GET_SELECTED_MAZE = "/maze/:maze_id";
export const GET_ALL_MAZE = "/maze";
export const GET_ALL_MAZE_METADATA = "/maze/metadata";
export const UPDATE_SELECTED_MAZE = "/maze/update/:maze_id";


export const ERROR_CODE = {
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const createMaze = `
    INSERT INTO mazes (maze_id, mazeName ,numCols, numRows, grid ,created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING maze_id, created_at
  `;


//   const initMazeTable = `
// CREATE TABLE IF NOT EXISTS mazes (
//   maze_id TEXT PRIMARY KEY,
//   mazeName TEXT NOT NULL,
//   numCols INTEGER NOT NULL,
//   numRows INTEGER NOT NULL,
//   grid ARRAY NOT NULL,
//   created_at INTEGER NOT NULL
// );
// `;

// database.exec(initMazeTable);