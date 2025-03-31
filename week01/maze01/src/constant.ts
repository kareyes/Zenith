import { Config, Context, Effect, pipe, Ref, Schema } from 'effect';
import { CurrentPosition, Maze, MazeMetaArray, MazeSchema } from './types';
import { HOST, PORT } from '../config';
import { ChannelTypeId } from 'effect/Channel';

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

export class PlayerModeState extends Context.Tag('PlayerModeState')<
PlayerModeState,
  Ref.Ref<string>
>() {}

export const GET_SELECTED_MAZE = "/maze/:maze_id";
export const GET_ALL_MAZE = "/maze";
export const GET_ALL_MAZE_METADATA = "/maze/metadata";
export const UPDATE_SELECTED_MAZE = "/maze/update/:maze_id";

export const API_URL = Effect.gen(function* (_) {
  const host = yield* _(HOST);
  const port = yield* _(PORT);
  return `http://${host}:${port}`;
});




export const directions: CurrentPosition[] = [
  { x: 0, y: 1 },  // right
  { x: 1, y: 0 },  // down
  { x: 0, y: -1 }, // left
  { x: -1, y: 0 }, // up
];

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

const symbols = [
  { name: 'Face', code: '\u{1F600}', output: '😁' },
  { name: 'Heart', code: '\u{2764}', output: '❤' },
  { name: 'Star', code: '\u{2B50}', output: '⭐' },
  { name: 'Dog', code: '\u{1F436}', output: '🐶' },
  { name: 'Cat', code: '\u{1F431}', output: '🐱' },
  { name: 'Mouse', code: '\u{1F42D}', output: '🐭' },
  { name: 'Cow', code: '\u{1F42E}', output: '🐮' },
  { name: 'Tiger', code: '\u{1F42F}', output: '🐯' },
  { name: 'Rabbit', code: '\u{1F430}', output: '🐰' },
  { name: 'Fox', code: '\u{1F98A}', output: '🦊' },
  { name: 'Bear', code: '\u{1F43B}', output: '🐻' },
  { name: 'Panda', code: '\u{1F43C}', output: '🐼' },
  { name: 'Koala', code: '\u{1F428}', output: '🐨' },
];

