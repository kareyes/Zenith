import { Effect, pipe, Ref } from 'effect';
import { CurrentPositionState, MazeState } from './constant';
import { BuildMazeApi } from './cell';
import { CurrentPosition, GamePlayState, GameState, Grid } from './types';
import { listener } from './menu';
import { runAutoMove, validateMovement } from './gameplay';
import { clear } from './utils';

const builderRow = ({ vertical, horizontal }: Grid, index: number) =>
  pipe(
    BuildMazeApi,
    Effect.bindTo('builderMaze'),
    Effect.bind('position', () => CurrentPositionState),
    Effect.bind('currentPosition', ({ position }) => Ref.get(position)),
    Effect.bind('verticalRow', ({ builderMaze, currentPosition }) =>
      builderMaze.buildVerticalRow(
        vertical,
        getCurrentPosition(currentPosition, index),
      ),
    ),
    Effect.bind('horizontalRow', ({ builderMaze }) =>
      builderMaze.buildHorizRow(horizontal),
    ),
    Effect.map(({ verticalRow, horizontalRow }) => {
      let row = [...['|'], ...verticalRow, ...horizontalRow];
      return row;
    }),
  );

const getCurrentPosition = ({ x, y }: CurrentPosition, index: number) =>
  x === index ? y : -1;

const builder = pipe(
  BuildMazeApi,
  Effect.bindTo('builderMaze'),
  Effect.bind('mazeState', () => MazeState),
  Effect.bind('maze', ({ mazeState }) => mazeState),
  Effect.bind('topWall', ({ builderMaze }) => builderMaze.buildTopWall),
  Effect.bind('layout', ({ maze }) =>
    pipe(
      maze.grid,
      Effect.forEach(builderRow),
      Effect.map((rows) => rows.flat()),
    ),
  ),
  Effect.map(({ topWall, layout }) => [...topWall, ...layout]),
);

export const move = ({ currentPosition, maze, playerMoves }: GamePlayState) =>
  pipe(
    Effect.succeed({ currentPosition, maze, playerMoves }),
    Effect.bind('positionState', ({ currentPosition }) => currentPosition),
    Effect.bind('mazeState', ({ maze }) => maze),
    Effect.bind('newPosition', ({ positionState, mazeState, playerMoves }) =>
      validateMovement({
        currentPosition: positionState,
        maze: mazeState,
        playerMoves,
      }),
    ),
    Effect.tap(({ newPosition, currentPosition }) =>
      Ref.update(currentPosition, () => newPosition),
    ),
    Effect.flatMap(() => drawMaze({ currentPosition, maze })),
    Effect.tap(() => finalizePosition({ currentPosition, maze })),
    // Effect.map((status) => status),
    Effect.catchTag('GamePlayError', (err) => Effect.succeed(err)),
    Effect.runPromise,
  );

const finalizePosition = (state: GameState) =>
  pipe(
    Effect.succeed(state),
    Effect.bind('position', () => Ref.get(state.currentPosition)),
    Effect.bind('mazeState', () => Ref.get(state.maze)),
    Effect.tap(({ position, mazeState }) => {
      if (
        position.x === mazeState.numRows - 1 &&
        position.y === mazeState.numCols - 1
      ) {
        console.log('Congratulations! You have reached the end of the maze.');
        process.exit();
      }
    }),
    // Effect.map(() => "game over"),
    //  Effect.runPromise,
  );



const drawMaze = (state: GameState) =>
  pipe(
    Effect.succeed(state),
    Effect.bind('position', () => Ref.get(state.currentPosition)),
    Effect.tap(() => clear()),
    Effect.bind('layout', () => builder),
    Effect.tap(({ layout }) => console.log(layout.join(''))),
    Effect.tap(({ position }) => console.log('current position', position)),
    Effect.provideServiceEffect(MazeState, Effect.succeed(state.maze)),
    Effect.provideServiceEffect(
      CurrentPositionState,
      Effect.succeed(state.currentPosition),
    ),
    Effect.provideService(BuildMazeApi, BuildMazeApi.Live),
  );

export const mazeInit = Effect.gen(function* () {
  const currentPosition = yield* CurrentPositionState;
  const maze = yield* MazeState;

  yield* drawMaze({ maze, currentPosition });

  // listener({ maze, currentPosition }).pipe(Effect.runPromise);
  runAutoMove({ maze, currentPosition }).pipe(Effect.runPromise);
});


