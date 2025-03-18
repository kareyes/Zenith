import { Console, Effect, pipe, Schema } from 'effect';
import {
  type Maze,
  type Grid,
  MazeSchema,
  ResponseMaze,
} from '../types';
import { getAllMazeId, getSelectedID } from '../data/queries';
import readline from 'readline';
import { question, clear } from '../utils';

let currentPosition = [0, 0];
let path = [currentPosition];
let activeMaze: Maze;

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

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
                const raw = response as ResponseMaze;
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
      row.vertical.forEach((wall, i) => {
        lines.push(i === colIndex ? ' @ ' : '   ');
        lines.push(wall ? ' ' : '|');
      });
      return lines;
    },
    (lines) => {
      lines.push('\r\n+');
      row.horizontal.forEach((wall) => {
        lines.push(wall ? '   ' : '---');
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

  // const autoMove = () => {
  //   const directions = [
  //     { dx: 0, dy: 1 },  // right
  //     { dx: 1, dy: 0 },  // down
  //     { dx: 0, dy: -1 }, // left
  //     { dx: -1, dy: 0 }, // up
  //   ];

  //   const visited = new Set<string>();
  //   visited.add(currentPosition.toString());

  //   const moveRandomly = (): Effect.Effect<void, Error> => 
  //     pipe(
  //       Effect.sync(() => {
  //         const possibleDirections = directions.filter(({ dx, dy }) => {
  //           const [nx, ny] = [currentPosition[0] + dx, currentPosition[1] + dy];
  //           return !visited.has([nx, ny].toString());
  //         });

  //         if (possibleDirections.length === 0) {
  //           return Effect.fail(new Error('No possible directions'));
  //         }

  //         const randomDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
  //         return randomDirection;
  //       }),
  //       Effect.flatMap(({ dx, dy }) => 
  //         pipe(
  //           Effect.sync(() => move(dx, dy)),
  //           Effect.map(() => {
  //             visited.add(currentPosition.toString());
  //           })
  //         )
  //       )
  //     );

  //   const intervalId = setInterval(() => {
  //     Effect.runPromise(moveRandomly()).catch((err) => console.error(err));
  //     const [x, y] = currentPosition;
  //     const { numRows, numCols } = activeMaze;
  //     if (x === numRows - 1 && y === numCols - 1) {
  //       clearInterval(intervalId);
  //     }
  //   }, 100);
  // };

const move = (dx: number, dy: number) => {
    const [x, y] = currentPosition;
    const nx = x + dx;
    const ny = y + dy;
    const { grid, numCols, numRows } = activeMaze;

    const t = pipe(
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
        // Effect.runSync
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
  // autoMove();
});

export {move,  createMaze, printTopWall, printCell, drawMaze, runMazeMenu };
