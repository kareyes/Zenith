
import { Effect, pipe, Option, Schema, Console } from "effect"
import { type Maze, type PrintMaze  ,type Grid, MazeSchema, GridSchema, RawMaze} from "./types"
import { createInterface } from "readline/promises"
import { getAllMazeId, getMazeById } from "./data/queries"
// import keypress  from "keypress"


const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = async (query: string) => {
    const answer = await rl.question(query);
    return answer;
};
// keypress


const promptMazeOpt = pipe(
    Effect.try({
        try: () => getAllMazeId.all() as { maze_id: string }[],
        catch: () => new Error("error fetching maze options"),
    }),
    Effect.map((options) => {
        console.log("Please choose an option:");
        options.forEach((option, index) => {
            console.log(`${index + 1}. ${option.maze_id}`);
        });
        return options;
    }),
    Effect.flatMap((options) =>
        Effect.promise(() => question("Enter the number of your choice: "))
            .pipe(
                Effect.map((choice) => options[parseInt(choice) - 1].maze_id)
            )
    )
);

  const getSelectedModel = (maze_id:string):Effect.Effect<Maze, Error>=>
    pipe(
      Effect.try({
        try: () =>
            getMazeById.get(maze_id),
        catch: () => new Error("error fetching maze model"),
      }),
      Effect.flatMap((x) => {
        const raw = x as RawMaze
        const maze =  {
            ...raw,
            grid: JSON.parse(raw.grid)
        }
        return Effect.succeed(maze);
      }
    ));




const printTopWall = (maze:Maze) => {
    const { numCols } = maze
    let lines = []
    lines.push(Array.from({ length: numCols * 2 + 1 },
         (_, i) => i===1 ? " * ": 
         (i % 2 ===0 ? "+": "---") ).join('')+ '\r\n')
    return lines

}

const printCell = (row:Grid, colIndex:number) => {
    let lines = []
        lines.push('|');
        row.vertical.map((cell, i) => {
            lines.push(i == colIndex ? " * " : '   ');
            lines.push(cell ? ' ' : '|');
        });
        lines.push('\r\n');
        lines.push('+');
        row.horizontal.map((cell) => {
            lines.push(cell ? '   ' : '---');
            lines.push('+');
        });
        lines.push('\r\n');
        return lines
}


const drawMaze = (maze: Maze, currentPosition?: number[])=>
    pipe(
        printTopWall(maze),
        (lines)=>{
            return {
                lines,
                currentPosition: currentPosition || [0, 0]
            }
        },
        ({lines, currentPosition}) => {
            const {grid} = maze;
            const [x, y] = currentPosition;
            grid.map((row, rowIndex) => {
                const colIndex = rowIndex===x ? y : -1;
                lines = [...lines, ...printCell(row, colIndex)]
            })
            return lines
        },
        (lines) => {
            return lines.join('')
        }
    );

//     const traceMaze = (maze: Maze, path: [number, number][]) => {
//         const { grid } = maze;
//         const tracedGrid = grid.map((row, rowIndex) => {
//             return {
//                 ...row,
//                 vertical: row.vertical.map((cell, colIndex) => {
//                     if (path.some(([x, y]) => x === rowIndex && y === colIndex)) {
//                         return true; // Mark the path
//                     }
//                     return cell;
//                 }),
//                 horizontal: row.horizontal.map((cell, colIndex) => {
//                     if (path.some(([x, y]) => x === rowIndex && y === colIndex)) {
//                         return true; // Mark the path
//                     }
//                     return cell;
//                 }),
//             };
//         });

//         return {
//             ...maze,
//             grid: tracedGrid,
//         };
//     };

// const drawPath = (maze: Maze, path: [number, number][]) => {
//     const tracedMaze = traceMaze(maze, path);
//     return drawMaze(tracedMaze);
// }


const runMenuMaze = ():Effect.Effect<Maze, Error> => pipe(
    promptMazeOpt,
    Effect.flatMap(getSelectedModel),
    Effect.map((maze) => {
        return Schema.decodeUnknownSync(MazeSchema)(maze)
    }) 
)

const runMaze = pipe(
    runMenuMaze(),
    Effect.map(drawMaze),
    Effect.map((lines) => console.log(lines))
)

    rl.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else {
            switch (key.name) {
                case 'up':
                   console.log('up')
                    break;
                case 'down':
                    console.log('down')
                    break;
                case 'left':
                   console.log('left')
                    break;
                case 'right':
                    console.log('right')
                    break;
            }
        }
    });

Effect.runPromise(runMaze).then((res) => {
    // drawMaze(res)
})

export { runMaze, printTopWall, printCell, drawMaze, runMenuMaze }


