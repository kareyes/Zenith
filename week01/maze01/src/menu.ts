import { select } from '@inquirer/prompts';
import { Effect, pipe, Ref, Schema } from 'effect';
import { MazeAPI } from './apiServices';
import { MazeDataState, playerSymbols } from './constant';
import { MazeGameDataSchema } from './types';


export const getMaze = Effect.gen(function* () {
  const mazeAPI = yield* MazeAPI;
  const maze = yield* mazeAPI.getAllMaze();
  const selected = yield* Effect.promise(() =>
    select({
      message: 'Choose your labyrinth tier:',
      choices: maze.map((m) => ({
        name: m.mazeName,
        value: m.maze_id,
        description: m.created_at,
      })),
    }),
  );
  const mazeById = yield* mazeAPI.getMazeById(selected);
  return mazeById;
}).pipe(Effect.provide(MazeAPI.Default));

export const selectPlayerCharacter = Effect.gen(function* () {
  const selected = yield* Effect.promise(() =>
    select({
      message: 'Select your player character:',
      choices: playerSymbols,
    }),
  );
  return selected as string;
});

export const gameModeOption = pipe(
  Effect.promise(() =>
    select({
      message: 'Pick your gameplay mode:',
      choices: ['Freedom', 'Guided'],
    }),
  ),
  Effect.map((selected) => selected as string),
);

export class MazeMenu extends Effect.Service<MazeMenu>()('MazeMenu', {
  dependencies: [MazeAPI.Default],
  effect: pipe(
    Effect.all({
      player: selectPlayerCharacter,
      maze: getMaze,
      gameMode: gameModeOption,
    }),
    Effect.map(({ player, maze, gameMode }) =>
      Schema.decodeUnknownSync(MazeGameDataSchema)({
        player,
        maze,
        gameMode,
      }),
    ),
    Effect.tap((mazeData) =>
      Effect.gen(function* () {
        const maze = yield* MazeDataState;
        yield* Ref.set(maze, mazeData);
      }),
  ),
)}) {}
