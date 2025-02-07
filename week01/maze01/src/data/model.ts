import { DatabaseSync } from 'node:sqlite';

const database = new DatabaseSync(`${__dirname}/maze.db`);

const initMazeTable = `
CREATE TABLE IF NOT EXISTS mazes (
  maze_id TEXT PRIMARY KEY,
  mazeName TEXT NOT NULL,
  numCols INTEGER NOT NULL,
  numRows INTEGER NOT NULL,
  grid ARRAY NOT NULL,
  created_at INTEGER NOT NULL
);
`;

database.exec(initMazeTable);

export default database;
