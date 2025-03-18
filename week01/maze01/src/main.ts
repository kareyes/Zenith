import { pipe, Effect, Ref} from 'effect';
import { runMazeMenu } from './menu';
import { CurrentPositionState, MazeState, mockMaze,  } from './constant';
import { BuildMazeApi } from './cell';
import { mazeInit } from './maze';


if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

const main = Effect.gen(function* () {
  const maze = yield* runMazeMenu;
  const state = yield* MazeState;
  yield* Ref.update(state, () => maze);
});


const program = Effect.gen(function* () {
  yield* main;
  yield* mazeInit;
  
});

const initialStateMaze = Effect.succeed(mockMaze).pipe(
  Effect.flatMap((maze) => Ref.make(maze)),
);

const runnable = program.pipe(
  Effect.provideServiceEffect(CurrentPositionState, Ref.make({x: 0, y: 0})),
  Effect.provideServiceEffect(MazeState, initialStateMaze),
  Effect.provideService(BuildMazeApi, BuildMazeApi.Live),
);


Effect.runPromise(runnable).then(function* () {

});
