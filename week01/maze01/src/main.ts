import { Effect, Ref} from 'effect';
import { getMaze,  runPlayerModeMenu } from './menu';
import { CurrentPositionState, MazeState, mockMaze, PlayerModeState,  } from './constant';
import { BuildMazeApi } from './builder';
import { initializeMaze } from './maze';

const main = Effect.gen(function* () {
  const maze = yield* getMaze;
  const state = yield* MazeState;
  const playerMode = yield* runPlayerModeMenu
  const playModeState = yield* PlayerModeState;

  yield* Ref.update(playModeState, () => playerMode);
  yield* Ref.update(state, () => maze);
});

const initialStateMaze = Effect.succeed(mockMaze).pipe(
  Effect.flatMap((maze) => Ref.make(maze)),
);


main.pipe(
  Effect.flatMap(() => initializeMaze)
).pipe(
  Effect.provideServiceEffect(CurrentPositionState, Ref.make({x: 0, y: 0})),
  Effect.provideServiceEffect(MazeState, initialStateMaze),
  Effect.provideService(BuildMazeApi, BuildMazeApi.Live),
  Effect.provideServiceEffect(PlayerModeState, Ref.make('Auto')),
  Effect.runPromise,
);
