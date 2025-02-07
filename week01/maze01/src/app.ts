import { Console, Effect, pipe, Schema } from 'effect';
import {
  type Maze,
  type Grid,
  MazeSchema,
  RawMaze,
} from './types';
import { createInterface } from 'readline/promises';
import { getAllMazeId, getSelectedID } from './data/queries';
import readline from 'readline';

let currentPosition = [0, 0];
let path = [currentPosition];
let activeMaze: Maze;

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

const question = async (query: string) => {
  const answer = await rl.question(query);
  return answer;
};

const clear = () => {
  process.stdout.write('\u001b[H\u001b[2J\u001b[3J');
};

const promptMazeOpt = pipe(
  Effect.try({
    try: () => getAllMazeId.all() as Maze[],
    catch: () => new Error('error fetching maze options'),
  }),
  Effect.map((options) => {
    console.log('Please choose a Maze:');
    options.forEach((option, index) => {
      console.log(`${index + 1}. ${option.mazeName}`);
    });
    return options;
  }),
  Effect.flatMap((options) =>
    Effect.promise(() => question('Enter the number of your choice: ')).pipe(
      Effect.map((choice) => options[parseInt(choice) - 1].maze_id),
    ),
  ),
);

const getSelectedModel = (maze_id: string): Effect.Effect<Maze, Error> =>
    pipe(
      Effect.promise(() => getSelectedID(maze_id)).pipe(
          Effect.flatMap((response: any) => {
            console.log("scu", response);
              if (response) {
                const raw = response as RawMaze;
                const maze = {
                  ...raw,
                  grid: JSON.parse(raw.grid),
                };
                return Effect.succeed(maze);
              } else {
                return Effect.fail(new Error("error fetching maze by id"));
              }
          }),
          Effect.catchAll((err) => {
              console.log("err", err);
              return Effect.fail(err);
          }

        )
      )
      
    )




const printTopWall = (maze: Maze) => {
  const { numCols } = maze;
  let lines = [];
  lines.push(
    Array.from({ length: numCols * 2 + 1 }, (_, i) =>
      i === 1 ? '   ' : i % 2 === 0 ? '+' : '---',
    ).join('') + '\r\n',
  );
  return lines;
};

const printCell = (row: Grid, colIndex: number) =>
  pipe(
    ['|'],
    (lines) => {
      row.vertical.forEach((cell, i) => {
        lines.push(i === colIndex ? ' @ ' : '   ');
        lines.push(cell ? ' ' : '|');
      });
      return lines;
    },
    (lines) => {
      lines.push('\r\n+');
      row.horizontal.forEach((cell) => {
        lines.push(cell ? '   ' : '---');
        lines.push('+');
      });
      lines.push('\r\n');
      return lines;
    },
  );

const drawMaze = (maze: Maze, currentPosition?: number[]) =>
  pipe(
    Effect.sync(() => {
      clear();
      return maze;
    }),
    Effect.flatMap((maze) =>
      Effect.sync(() => ({
        lines: printTopWall(maze),
        currentPosition: currentPosition || [0, 0],
      }))
    ),
    Effect.flatMap(({ lines, currentPosition }) =>
      Effect.sync(() => {
        const { grid } = maze;
        const [x, y] = currentPosition;
        grid.forEach((row, rowIndex) => {
          const colIndex = rowIndex === x ? y : -1;
          lines.push(...printCell(row, colIndex));
        });
        return {
          mazeOutput: lines.join(''),
          maze,
        };
      })
    )
  );


const move = (dx: number, dy: number) => {
    const [x, y] = currentPosition;
    const nx = x + dx;
    const ny = y + dy;
    const { grid, numCols, numRows } = activeMaze;

    pipe(
        Effect.sync(() => console.log('Current position:', currentPosition)),
        Effect.map(() => {
            if (nx < 0 || ny < 0 || nx >= numRows || ny >= numCols) {
                return Effect.fail(new Error('Out of bounds'));
            }

            if (dx === 0 && dy === 1 && y < numCols - 1 && !grid[x].vertical[y]) {
                return Effect.fail(new Error('Wall to the right'));
            }

            if (dx === 1 && dy === 0 && x < numRows - 1 && !grid[x].horizontal[y]) {
                return Effect.fail(new Error('Wall below'));
            }

            if (dx === 0 && dy === -1 && y > 0 && !grid[x].vertical[y - 1]) {
                return Effect.fail(new Error('Wall to the left'));
            }

            if (dx === -1 && dy === 0 && x > 0 && !grid[x - 1].horizontal[y]) {
                return Effect.fail(new Error('Wall above'));
            }

            currentPosition = [nx, ny];
            path.push(currentPosition);

            return Effect.succeed({activeMaze, currentPosition});
        }),
        Effect.flatMap(() => drawMaze(activeMaze, currentPosition)),
        Effect.map(({ mazeOutput }) => console.log(mazeOutput)),
        Effect.map(() => finalizePosition(currentPosition)),
        Effect.catchAll((err) => Console.log(err)),
        Effect.runPromise
    )
};

const finalizePosition = (currentPosition: number[]) => {
  const [x, y] = currentPosition;
  const { numRows, numCols } = activeMaze;
  const isEnd = x === numRows - 1 && y === numCols - 1;
  if (isEnd) {
    console.log('Congratulations! You have reached the end of the maze.');
    process.exit();
  } else {
    console.log('Current position:', currentPosition);
  }
}

const runMazeMenu = (): Effect.Effect<Maze, Error> =>
  pipe(
    promptMazeOpt,
    Effect.flatMap(getSelectedModel),
    Effect.map((maze) => {
      return Schema.decodeUnknownSync(MazeSchema)(maze);
    }),
  );

const createMaze = pipe(
  runMazeMenu(),
  Effect.flatMap((maze) =>
    drawMaze(maze).pipe(
      Effect.map(({ mazeOutput }) => {
        console.log(mazeOutput);
        return maze;
      })
    )
  ),
);

process.stdin.on('keypress', (_, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    switch (key.name) {
      case 'up':
        move(-1, 0);
        break;
      case 'down':
        move(1, 0);
        break;
      case 'left':
        move(0, -1);
        break;
      case 'right':
        move(0, 1);
        break;
    }
  }
});

Effect.runPromise(createMaze).then((maze) => {
  activeMaze = maze;
});

export {move,  createMaze, printTopWall, printCell, drawMaze, runMazeMenu };
