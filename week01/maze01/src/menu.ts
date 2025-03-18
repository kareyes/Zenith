import { select, input } from '@inquirer/prompts';
import { Chunk, Effect, Option, pipe, Ref } from 'effect';
import {
  DBMazeClientService,
  getAllMazeId,
  getCurrentPositionState,
  getMazeById,
} from './service';
import { CurrentPositionState, MazeState, PlayerState } from './constant';
import readline from 'readline';
import { move } from './maze';
import { CurrentPosition, GameState } from './types';

const initialStatePlayer = (value: string) =>
  pipe(
    Ref.make(value),
    Effect.flatMap((value: Ref.Ref<string>) =>
      Effect.sync(() => new PlayerState(value)),
    ),
  );

export const runMazeMenu = pipe(
  Effect.sync(() => console.log('Welcome to the game')),
  Effect.flatMap(() =>
    Effect.promise(() =>
      input({
        message: "Enter the player's name",
        validate: (name) => (name ? true : 'Please enter a valid name'),
      }),
    ),
  ),
  Effect.tap((answer) => console.log('Hello Challenger', answer)),
  Effect.andThen(() => getAllMazeId()),
  Effect.flatMap((maze) =>
    Effect.promise(() =>
      select({
        message: 'Please choose Maze Level',
        choices: maze.map((m) => ({
          name: m.mazeName,
          value: m.maze_id,
          description: m.created_at,
        })),
      }),
    ),
  ),
  Effect.andThen((selected) => getMazeById(selected)),
  Effect.map((selected) => selected),
  DBMazeClientService,
);


export const listener = (state: GameState) =>
  pipe(
    Effect.sync(() => {
      readline.emitKeypressEvents(process.stdin);
      process.stdin.setRawMode(true);
      process.stdin.resume();
    }),
    Effect.flatMap(() =>
      Effect.async((cb) => {
        process.stdin.on('keypress', (str, key) => {
          let playerMoves: CurrentPosition = { x: 0, y: 0 };
          if (str === '\u0003') {
            process.exit();
          } else {
            switch (key.name) {
              case 'up':
                playerMoves = { x: -1, y: 0 };
                console.log('up');
                break;
              case 'down':
                playerMoves = { x: 1, y: 0 };
                console.log('down');
                break;
              case 'left':
                playerMoves = { x: 0, y: -1 };
                console.log('left');
                break;
              case 'right':
                playerMoves = { x: 0, y: 1 };
                console.log('right');
                break;
            }
            move({ playerMoves, ...state });
          }
        });
      }),
    ),
  );

// export const runPlayerMode = pipe(
//   Effect.promise(() =>
//     select({
//       message: 'Choose a player mode',
//       choices: ['Auto', 'Manual'],
//     }),
//   ),
//   Effect.tap((player) => listener()),

// );
