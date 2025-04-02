import { Data, Schema, Effect, Cause, Context, Ref } from 'effect';
import test from 'node:test';

export const CellSchema = Schema.Boolean;
export type Cell = typeof CellSchema.Type;

export const RowSchema = Schema.Array(CellSchema);
export type Row = typeof RowSchema.Type;

export const GridSchema = Schema.Struct({
  vertical: RowSchema,
  horizontal: RowSchema,
});
export type Grid = typeof GridSchema.Type;

export const MazeMetaSchema = Schema.Struct({
  maze_id: Schema.String,
  mazeName: Schema.String,
  created_at: Schema.String,
});

export const MetaArraySchema = Schema.Array(MazeMetaSchema);

export type MazeMetaArray = typeof MetaArraySchema.Type;
// export interface MazeMetaArray extends Schema.Schema.Type<typeof MetaArraySchema> {}

export type MazeMeta = typeof MazeMetaSchema.Type;

export const MazeSchema = Schema.Struct({
  ...MazeMetaSchema.fields,
  numCols: Schema.Number,
  numRows: Schema.Number,
  grid: Schema.Array(GridSchema),
});


export const ResponseMazeSchema = MazeSchema.omit('grid').pipe(
  Schema.extend(Schema.Struct({ grid: Schema.String }))
);

export type ResponseMaze = typeof ResponseMazeSchema.Type;

export const ParseMazeSchema = Schema.transform(
  ResponseMazeSchema,
  MazeSchema,
  {
    encode: (maze) => ({
      ...maze,
      grid: JSON.stringify(maze.grid),
    }),
    decode: (rawMaze) => ({
      ...rawMaze,
      grid: JSON.parse(rawMaze.grid),
    }),
  },
);

export type Maze = typeof ParseMazeSchema.Type;

export const CurrentPositionSchema = Schema.Struct({
  x: Schema.Number,
  y: Schema.Number,
});

export const GamePlaySchema = Schema.Struct({
  maze: MazeSchema,
  currentPosition: CurrentPositionSchema,
  playerMoves: CurrentPositionSchema,
});

export const PlayMovementSchema = Schema.Struct({
  dx: Schema.Number,
  dy: Schema.Number,
  currentX: Schema.Number,
  currentY: Schema.Number,
  maze: MazeSchema,

});

export type GameState = {
  maze: Ref.Ref<MazeGameData>,
  currentPosition: Ref.Ref<CurrentPosition>,
}

export type GamePlayState = GameState & {
  playerMoves: CurrentPosition,
}

 
export type PlayMovement = typeof PlayMovementSchema.Type;

export type GamePlay = typeof GamePlaySchema.Type;

export type CurrentPosition = typeof CurrentPositionSchema.Type;

export const MazeGameDataSchema = Schema.Struct({
  maze: MazeSchema,
  player: Schema.String,
  gameMode: Schema.String,
});
export type MazeGameData = typeof MazeGameDataSchema.Type;

