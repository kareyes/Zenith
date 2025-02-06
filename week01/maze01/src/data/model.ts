import { DatabaseSync } from 'node:sqlite';

// import { MazeSchema } from '../types';

const database = new DatabaseSync(`${__dirname}/maze.db`);

// const initDatabase = `
// CREATE TABLE IF NOT EXISTS users (
//   user_id TEXT PRIMARY KEY,
//   username TEXT NOT NULL UNIQUE,
//   password TEXT NOT NULL,
//   created_at INTEGER NOT NULL
// );

// );
// `;

const initMazeTable = `
CREATE TABLE IF NOT EXISTS mazes (
  maze_id TEXT PRIMARY KEY,
  numCols INTEGER NOT NULL,
  numRows INTEGER NOT NULL,
  grid ARRAY NOT NULL,
  created_at INTEGER NOT NULL
);
`;

database.exec(initMazeTable);

// database.exec(initDatabase);

export default database;
