import { Context, Effect, Ref } from 'effect';
import { MazeState } from './constant';
import { Row } from './types';
import { pipe } from 'effect';


const builder = {
    buildTopWall: pipe(
        MazeState,
        Effect.flatMap(state => Ref.get(state)),
        Effect.map(currentMaze => {
            const numCols = currentMaze.numCols;
            return (
                Array.from({ length: numCols * 2 + 1 }, (_, i) =>
                    i === 1 ? '   ' : i % 2 === 0 ? '+' : '---',
                ).join('') + '\r\n'
            );
        })
    ),

    buildVerticalRow: (vertical: Row, currentPosition: number) =>
        pipe(
            Effect.succeed(vertical),
            Effect.map(vertical => {
                let lines: string[] = [];
                vertical.forEach((wall, i) => {
                    lines.push(i === currentPosition ? ' @ ' : '   ');
                    lines.push(wall ? ' ' : '|');
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
                    lines = [...lines, wall ? '   ' : '---'];
                    lines = [...lines, '+'];
                });
                lines = [...lines, '\r\n'];
                return lines;
            })
        ),
};

export class BuildMazeApi extends Context.Tag('BuildMazeApi')<
  BuildMazeApi,
  typeof builder
>() {
  static readonly Live = BuildMazeApi.of(builder);
}
