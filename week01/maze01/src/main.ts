import { Effect, pipe, Ref } from 'effect';
import { MazeMenu } from './menu';
import { MazeDataState, RawData } from './constant';
import { gameStart } from './maze';

const main = pipe(MazeMenu, Effect.zipRight(gameStart));

main.pipe(
  Effect.provide(MazeMenu.Default),
  Effect.provideServiceEffect(MazeDataState, Ref.make(RawData)),
  Effect.runPromise,
);
