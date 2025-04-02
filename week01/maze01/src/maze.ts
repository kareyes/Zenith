import { Effect, pipe, Ref } from 'effect';
import { CurrentPositionState, MazeDataState } from './constant';
import { BuilderMaze } from './builder';
import { CurrentPosition, GamePlayState, GameState, Grid } from './types';
import readline from 'readline';
import { runAutoMove, validateMovement } from './gameplay';
import { clear } from './utils';

const getCurrentPosition = ({ x, y }: CurrentPosition, index: number) =>
  x === index ? y : -1;

const mapMazeLayout = ({ vertical, horizontal }: Grid, index: number) =>
  pipe(
    Effect.all({
      builderMaze: BuilderMaze,
      currentPosition: CurrentPositionState,
      mazeData: MazeDataState,
    }),
    Effect.bind('position', ({ currentPosition }) => Ref.get(currentPosition)),
    Effect.bind('maze', ({ mazeData }) => Ref.get(mazeData)),
    Effect.flatMap(({ builderMaze, position, maze }) =>
      Effect.all({
        verticalRow: builderMaze.buildVerticalRow(
          vertical,
          getCurrentPosition(position, index),
          maze.player,
        ),
        horizontalRow: builderMaze.buildHorizRow(horizontal),
      }),
    ),
    Effect.map(({ verticalRow, horizontalRow }) => [
      '|',
      ...verticalRow,
      ...horizontalRow,
    ]),
  );

const builder = pipe(
  Effect.all({
    mazeData: MazeDataState,
    builder: BuilderMaze,
  }),
  Effect.bind('state', ({ mazeData }) => Ref.get(mazeData)),
  Effect.bind('topWall', ({ builder }) => builder.buildTopWall),
  Effect.bind('mazeLayout', ({ state: { maze } }) =>
    pipe(
      maze.grid,
      Effect.forEach(mapMazeLayout),
      Effect.map((rows) => rows.flat()),
    ),
  ),
  Effect.map(({ topWall, mazeLayout }) => [...topWall, ...mazeLayout]),
  Effect.provideService(BuilderMaze, BuilderMaze.Live),
);

export const move = ({ currentPosition, maze, playerMoves }: GamePlayState) =>
  pipe(
    Effect.all({
      currPostion: Ref.get(currentPosition),
      mazeVal: Ref.get(maze),
    }),
    Effect.flatMap(({ currPostion, mazeVal }) =>
      validateMovement({
        currentPosition: currPostion,
        maze: mazeVal.maze,
        playerMoves,
      }),
    ),
    Effect.tap((newPosition) =>
      pipe(
        Ref.update(currentPosition, () => newPosition),
        Effect.zipRight(drawMaze({ currentPosition, maze })),
        Effect.zipRight(finalizePosition({ currentPosition, maze })),
      ),
    ),
    Effect.catchTag('GamePlayError', Effect.succeed),
    Effect.runPromise,
  );

const finalizePosition = (state: GameState) =>
  pipe(
    Effect.succeed(state),
    Effect.bind('position', () => Ref.get(state.currentPosition)),
    Effect.bind('mazeState', () => Ref.get(state.maze)),
    Effect.tap(({ position, mazeState: { maze } }) => {
      if (position.x === maze.numRows - 1 && position.y === maze.numCols - 1) {
        console.log(
          'Congratulations \u{1F389} \u{1F389} \u{1F389}! You have reached the end of the maze.',
        );
        process.exit();
      }
    }),
  );

const drawMaze = (state: GameState) =>
  pipe(
    builder,
    Effect.tap(() => clear()),
    Effect.tap((mazeLayout) => console.log(mazeLayout.join(''))),
    Effect.provideServiceEffect(MazeDataState, Effect.succeed(state.maze)),
    Effect.provideServiceEffect(
      CurrentPositionState,
      Effect.succeed(state.currentPosition),
    ),
  );

const listener = (state: GameState) =>
  pipe(
    Effect.sync(() => {
      readline.emitKeypressEvents(process.stdin);
      process.stdin.setRawMode(true);
      process.stdin.resume();
    }),
    Effect.flatMap(() =>
      Effect.async(() => {
        process.stdin.on('keypress', (str, key) => {
          let playerMoves: CurrentPosition = { x: 0, y: 0 };
          if (str === '\u0003') {
            process.exit();
          } else {
            switch (key.name) {
              case 'up':
                playerMoves = { x: -1, y: 0 };
                break;
              case 'down':
                playerMoves = { x: 1, y: 0 };
                break;
              case 'left':
                playerMoves = { x: 0, y: -1 };
                break;
              case 'right':
                playerMoves = { x: 0, y: 1 };
                break;
            }
            move({ playerMoves, ...state });
          }
        });
      }),
    ),
  );

export const gameStart = pipe(
  Effect.all({
    maze: MazeDataState,
    currentPosition: CurrentPositionState,
  }),
  Effect.bind('gameData', ({ maze }) => Ref.get(maze)),
  Effect.tap(({ currentPosition, maze }) =>
    drawMaze({ maze, currentPosition }),
  ),
  Effect.tap(({ currentPosition, maze, gameData }) =>
    gameData.gameMode === 'Freedom'
      ? runAutoMove({ maze, currentPosition }).pipe(Effect.runPromise)
      : listener({ maze, currentPosition }).pipe(Effect.runPromise),
  ),
  Effect.provideServiceEffect(CurrentPositionState, Ref.make({ x: 0, y: 0 })),
);
