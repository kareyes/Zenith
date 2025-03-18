import { Effect } from 'effect';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMaze, move } from './bin/app';
// import { getAllMazeId, getMazeById } from './data/queries';

describe('Application Tests', () => {
  it('hello world!', () => {
    expect(1 + 1).toBe(2);
  });
});


// describe('move', () => {
//   let mockMaze: Maze;

//   beforeEach(() => {
//     let mockMaze = {
//       numCols: 2,
//       numRows: 2,
//       grid: [
//         { vertical: [false, false], horizontal: [false, false] },
//         { vertical: [false, false], horizontal: [false, false] },
//       ],
//     };
//     let currentPosition = [0, 0];
//   });

//   it('should move right', async () => {
//     await move(0, 1);
//     expect(currentPosition).toEqual([0, 1]);
//   });

//   it('should move down', async () => {
//     await move(1, 0);
//     expect(currentPosition).toEqual([1, 0]);
//   });

//   it('should not move out of bounds', async () => {
//     await move(0, -1);
//     expect(currentPosition).toEqual([0, 0]);
//   });

//   it('should not move through right wall', async () => {
//     mockMaze.grid[0].vertical[0] = true;
//     await move(0, 1);
//     expect(currentPosition).toEqual([0, 0]);
//   });

//   it('should not move through bottom wall', async () => {
//     mockMaze.grid[0].horizontal[0] = true;
//     await move(1, 0);
//     expect(currentPosition).toEqual([0, 0]);
//   });

//   it('should not move through left wall', async () => {
//     currentPosition = [0, 1];
//     mockMaze.grid[0].vertical[0] = true;
//     await move(0, -1);
//     expect(currentPosition).toEqual([0, 1]);
//   });

//   it('should not move through top wall', async () => {
//     currentPosition = [1, 0];
//     mockMaze.grid[0].horizontal[0] = true;
//     await move(-1, 0);
//     expect(currentPosition).toEqual([1, 0]);
//   });
// });

describe('createMaze', () => {
  it('should prompt for maze option and draw the selected maze', async () => {
    const mockMaze = {
      numCols: 2,
      numRows: 2,
      grid: [
        { vertical: [false, false], horizontal: [false, false] },
        { vertical: [false, false], horizontal: [false, false] },
      ],
    };

    const mockGetAllMazeId = vi
      .spyOn(require('./data/queries'), 'getAllMazeId')
      .mockReturnValue({
        all: () => [{ maze_id: '1' }],
      });

    const mockGetMazeById = vi
      .spyOn(require('./data/queries'), 'getMazeById')
      .mockReturnValue(mockMaze);
    const mockQuestion = vi
      .spyOn(require('readline/promises').createInterface.prototype, 'question')
      .mockResolvedValue('1');
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await Effect.runPromise(createMaze);

    expect(mockGetAllMazeId).toHaveBeenCalled();
    expect(mockGetMazeById).toHaveBeenCalledWith('1');
    expect(mockQuestion).toHaveBeenCalledWith(
      'Enter the number of your choice: ',
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('+---+---+'),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('|   |   |'),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('+---+---+'),
    );

    mockGetAllMazeId.mockRestore();
    mockGetMazeById.mockRestore();
    mockQuestion.mockRestore();
    consoleSpy.mockRestore();
  });
});
