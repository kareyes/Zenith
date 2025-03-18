import { Context, Effect, pipe, Ref, Schema } from 'effect';
import { CurrentPosition, Maze, MazeMetaArray, MazeSchema } from './types';

export class JSONError {
  readonly _tag = 'JSONError';
}

export class FetchError {
  readonly _tag = 'FetchError';
  constructor(readonly message: string) {}
}

export class DatabaseError {
  readonly _tag = 'DatabaseError';
  constructor(readonly message: string) {}
}

export class GamePlayError {
  readonly _tag = 'GamePlayError';
  constructor(readonly message: string) {}
}

export class DBMazeClient extends Context.Tag('DBMazeClientService')<
  DBMazeClient,
  {
    getbyId(maze_id: string): Effect.Effect<Maze, DatabaseError>;
    getAllMazeId(): Effect.Effect<MazeMetaArray, DatabaseError>;
  }
>() {}

export class PlayerState {
  player: Effect.Effect<string>;
  constructor(private value: Ref.Ref<string>) {
    this.player = Ref.get(this.value);
  }
}

export class MazeState extends Context.Tag('MazeState')<
  MazeState,
  Ref.Ref<Maze>
>() {}

export class CurrentPositionState extends Context.Tag('CurrentPositionState')<
  CurrentPositionState,
  Ref.Ref<CurrentPosition>
>() {}

export const mockMaze: Maze = {
  maze_id: '1',
  mazeName: 'Test Maze',
  created_at: new Date().toISOString(),
  numCols: 1,
  numRows: 1,
  grid: [
    {
      vertical: [true, false, true, false, true],
      horizontal: [false, true, false, true, false],
    },
  ],
};

export const initialStateMaze = Ref.make(mockMaze);
