import { Context, Effect, Ref } from 'effect';
import {
  CurrentPosition,
  MazeGameData,
} from './types';
import { HOST, PORT } from '../config';

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


export class CurrentPositionState extends Context.Tag('CurrentPositionState')<
  CurrentPositionState,
  Ref.Ref<CurrentPosition>
>() {}


export class MazeDataState extends Context.Tag('MazeDataState')<
MazeDataState,
  Ref.Ref<MazeGameData>
>() {}

export const GET_SELECTED_MAZE = '/maze/:maze_id';
export const GET_ALL_MAZE = '/maze';
export const GET_ALL_MAZE_METADATA = '/maze/metadata';
export const UPDATE_SELECTED_MAZE = '/maze/update/:maze_id';

export const API_URL = Effect.gen(function* (_) {
  const host = yield* _(HOST);
  const port = yield* _(PORT);
  return `http://${host}:${port}`;
});

export const directions: CurrentPosition[] = [
  { x: 0, y: 1 }, // right
  { x: 1, y: 0 }, // down
  { x: 0, y: -1 }, // left
  { x: -1, y: 0 }, // up
];


export const RawData:MazeGameData = {
  player: '',
  maze: {
    maze_id: '',
    mazeName: '',
    created_at: '',
    numCols: 0,
    numRows: 0,
    grid: [{
      vertical: [false, false, false, false, false],
      horizontal: [false, false, false, false, false],
    }],
  },
  gameMode: '',
};


export const playerSymbols = [
  {
    name: '🐶 - Brian Griffin',
    value: '\u{1F436}',
    description:
      'Has average agility, often displaying quick reflexes in comedic situations but not particularly athletic.',
  },
  {
    name: '🐱 - Pusheen',
    value: '\u{1F431}',
    description:
      'A cute, chubby cat with limited agility, often depicted as more playful and relaxed than physically nimble.',
  },
  {
    name: '🐭 - Jerry',
    value: '\u{1F42D}',
    description:
      'Jerry is highly agile, swiftly outmaneuvering Tom with quick reflexes and clever tricks.',
  },
  {
    name: '🐼 - Pan-Pan',
    value: '\u{1F43C}',
    description:
      'Playful and energetic character with surprising agility, often darting around with quick movements.',
  },
  {
    name: '🐰 - Snowball',
    value: '\u{1F430}',
    description:
      'Snowball is incredibly agile, darting swiftly and gracefully to evade attacks and outmaneuver opponents.',
  },
];
