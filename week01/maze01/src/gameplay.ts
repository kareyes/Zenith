import { Effect, pipe, Ref, Schedule, Schema } from 'effect';
import { GamePlay, GameState, PlayMovement, PlayMovementSchema } from './types';
import { directions, GamePlayError } from './constant';
import { move } from './maze';

const OutofBounds = (m: PlayMovement) =>
  pipe(
    Effect.succeed(m),
    Effect.bind('newX', (m) => Effect.succeed(m.dx + m.currentX)),
    Effect.bind('newY', (m) => Effect.succeed(m.dy + m.currentY)),
    Effect.bind('condition', ({ newX, newY }) =>
      Effect.succeed(
        newX < 0 ||
          newY < 0 ||
          newX >= m.maze.numRows ||
          newY >= m.maze.numCols,
      ),
    ),
    Effect.flatMap(({ condition }) =>
      condition
        ? Effect.fail(new GamePlayError('Out of bounds'))
        : Effect.succeed(false),
    ),
  );

const WallRight = (m: PlayMovement) =>
  pipe(
    Effect.succeed(m),
    Effect.bind('condition', (m) =>
      Effect.succeed(
        m.dx === 0 &&
          m.dy === 1 &&
          m.currentY < m.maze.numCols - 1 &&
          !m.maze.grid[m.currentX].vertical[m.currentY],
      ),
    ),
    Effect.flatMap(({ condition }) =>
      condition
        ? Effect.fail(new GamePlayError('Wall to the right'))
        : Effect.succeed(false),
    ),
  );

const WallBelow = (m: PlayMovement) =>
  pipe(
    Effect.succeed(m),
    Effect.bind('condition', (m) =>
      Effect.succeed(
        m.dx === 1 &&
          m.dy === 0 &&
          m.currentX < m.maze.numRows - 1 &&
          !m.maze.grid[m.currentX].horizontal[m.currentY],
      ),
    ),
    Effect.flatMap(({ condition }) =>
      condition
        ? Effect.fail(new GamePlayError('Wall below'))
        : Effect.succeed(false),
    ),
  );

const WallLeft = (m: PlayMovement) =>
  pipe(
    Effect.succeed(m),
    Effect.bind('condition', (m) =>
      Effect.succeed(
        m.dx === 0 &&
          m.dy === -1 &&
          m.currentY > 0 &&
          !m.maze.grid[m.currentX].vertical[m.currentY - 1],
      ),
    ),
    Effect.flatMap(({ condition }) =>
      condition
        ? Effect.fail(new GamePlayError('Wall to the left'))
        : Effect.succeed(false),
    ),
  );

const WallAbove = (m: PlayMovement) =>
  pipe(
    Effect.succeed(m),
    Effect.bind('condition', (m) =>
      Effect.succeed(
        m.dx === -1 &&
          m.dy === 0 &&
          m.currentX > 0 &&
          !m.maze.grid[m.currentX - 1].horizontal[m.currentY],
      ),
    ),
    Effect.flatMap(({ condition }) =>
      condition
        ? Effect.fail(new GamePlayError('Wall above'))
        : Effect.succeed(false),
    ),
  );

const destruct = (play: GamePlay) => {
  return pipe(
    Effect.succeed(play),
    Effect.map((play) => ({
      dx: play.playerMoves.x,
      dy: play.playerMoves.y,
      currentX: play.currentPosition.x,
      currentY: play.currentPosition.y,
      maze: play.maze,
    })),
    Effect.map((movement) =>
      Schema.decodeUnknownSync(PlayMovementSchema)(movement),
    ),
  );
};

export const validateMovement = (m: GamePlay) =>
  pipe(
    destruct(m),
    Effect.flatMap((movement) =>
      OutofBounds(movement).pipe(
        Effect.andThen(() => WallAbove(movement)),
        Effect.andThen(() => WallBelow(movement)),
        Effect.andThen(() => WallLeft(movement)),
        Effect.andThen(() => WallRight(movement)),
      ),
    ),
    Effect.flatMap(() =>
      Effect.succeed({
        x: m.currentPosition.x + m.playerMoves.x,
        y: m.currentPosition.y + m.playerMoves.y,
      }),
    ),
    Effect.catchTag('GamePlayError', (err) => Effect.fail(err)),
  );

const autoMove = (m: GameState) =>
  Effect.sync(() =>
    pipe(
      Effect.succeed(m),
      Effect.bindTo('gameState'),
      Effect.bind('randomDirection', () =>
        Effect.succeed(
          directions[Math.floor(Math.random() * directions.length)],
        ),
      ),
      Effect.bind('state', ({ randomDirection, gameState }) =>
        Effect.succeed({ playerMoves: randomDirection, ...gameState }),
      ),
      Effect.tap(({ state }) => move(state)),
      Effect.flatMap(({ state }) => checkFinalPosition(state)),
    ),
  );

const checkFinalPosition = (state: GameState) =>
  pipe(
    Effect.succeed(state),
    Effect.bind('position', () => Ref.get(state.currentPosition)),
    Effect.bind('mazeState', () => Ref.get(state.maze)),
    Effect.map(({ position, mazeState:{maze} }) => {
      if (
        position.x === maze.numRows - 1 &&
        position.y === maze.numCols - 1
      ) {
        return Effect.succeed('Game Over');
      }
      return Effect.fail(new GamePlayError('Game not over'));
    }),
    Effect.flatMap((status) => status),
    Effect.catchTag('GamePlayError', (err) => Effect.succeed(err)),
  );

export const runAutoMove = (state: GameState) =>
  Effect.repeat(autoMove(state), {
    until: (action) => action.pipe(Effect.map((status) => status === "Game Over")),
    schedule: Schedule.addDelay(Schedule.forever, () => "50 millis"),
  });
