import database from './model';

const createMaze = database.prepare(`
  INSERT INTO mazes (maze_id, numCols, numRows, grid ,created_at)
  VALUES (?, ?, ?, ?, ?)
  RETURNING maze_id, created_at
`);


const getMazeById = database.prepare(`
  SELECT * FROM mazes WHERE maze_id = ?
`);

const getAllMazeId = database.prepare(`
  SELECT maze_id FROM mazes
`);

const updateMaze = database.prepare(`
  UPDATE mazes SET grid = ? WHERE maze_id = ?
`);



export {
  createMaze,
    getMazeById,
    getAllMazeId,
    updateMaze
  };