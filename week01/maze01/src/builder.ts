import { Context, Effect, Ref } from 'effect';
import { MazeDataState } from './constant';
import { Row } from './types';
import { pipe } from 'effect';

const builder = {
    buildTopWall: pipe(
        MazeDataState,
        Effect.flatMap(state => Ref.get(state)),
        Effect.map((currentMaze) => {
            const numCols = currentMaze.maze.numCols;
            return (
                Array.from({ length: numCols * 2 + 1 }, (_, i) =>
                    i === 1 ? '    ' : i % 2 === 0 ? '+' : '----',
                ).join('') + '\r\n'
            );
        })
    ),

    buildVerticalRow: (vertical: Row, currentPosition: number, player:string) =>
        pipe(
            Effect.succeed(vertical),
            Effect.map(vertical => {
                let lines: string[] = [];
                vertical.forEach((wall, i) => {
                    lines = [...lines, i === currentPosition ? ` ${player} ` : '    '];
                    lines = [...lines, wall ? ' ' : '|'];
                });
                return lines;
            })
        ),

        
    buildHorizRow: (horizontal: Row) =>
        pipe(
            Effect.succeed(horizontal),
            Effect.map(horizontal => {
                let lines: string[] = [];
                lines = [...lines, '\r\n+'];
                horizontal.forEach((wall, i) => {
                    lines = [...lines, wall ? '    ' : '----'];
                    lines = [...lines, '+'];
                });
                lines = [...lines, '\r\n'];
                return lines;
            })
        ),
};

export class BuilderMaze extends Context.Tag('BuilderMaze')<
BuilderMaze,
  typeof builder
>() {
  static readonly Live = BuilderMaze.of(builder);
}


