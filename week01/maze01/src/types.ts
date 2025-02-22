import { Data, Schema, Effect, Cause } from 'effect';

const CellSchema = Schema.Boolean;
type Cell = typeof CellSchema.Type;

const RowSchema = Schema.Array(CellSchema);
type Row = typeof RowSchema.Type;

const GridSchema = Schema.Struct({
  vertical: RowSchema,
  horizontal: RowSchema,
});
type Grid = typeof GridSchema.Type;

const MazeSchema = Schema.Struct({
  maze_id: Schema.String,
  mazeName: Schema.String,
  numCols: Schema.Number,
  numRows: Schema.Number,
  grid: Schema.Array(GridSchema),
  created_at: Schema.String,
}).pipe(
  Schema.filter((maze) => maze.numCols === maze.grid[0].vertical.length),
  Schema.filter((maze) => maze.numRows === maze.grid.length),
  Schema.filter((maze) => maze.grid.every((row) => row.vertical.length === maze.numCols)),
  Schema.filter((maze) => maze.grid.every((row) => row.horizontal.length === maze.numCols)),
  Schema.filter((maze) => maze.grid.every((row) => row.vertical.length === row.horizontal.length)),
   
)
type Maze = typeof MazeSchema.Type;

type RawMaze = Omit<Maze, 'grid'> & { grid: string };

type PrintMaze = {
  gird: Grid[];
  lines: string[];
};

// export class MazeError extends Data.TaggedError("MazeError") {}

// class MazeError extends Error {
//     constructor(message: string, public cause?: Effect.Cause<unknown>) {
//         super(message);
//         this.name = "MazeError";
//     }

//     static fromEffect<E>(effect: Effect.Effect<unknown, E, unknown>): Effect.Effect<unknown, MazeError, unknown> {
//         return effect.mapError((error) => new MazeError("Maze operation failed", Cause.fail(error)));
//     }
// }

// export { MazeError }

export { CellSchema, RowSchema, GridSchema, MazeSchema };

export type { Cell, Row, Grid, Maze, PrintMaze, RawMaze };
