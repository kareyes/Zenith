import { Effect } from 'effect';
import { describe, it, expect, vi } from 'vitest';
import { runMaze } from './app';

describe('Application Tests', () => {
	it('hello world!', () => {
		expect(1 + 1).toBe(2);
	});
});

describe('runMaze', () => {
	it('should prompt for maze option and draw the selected maze', async () => {
		const mockMaze = {
			numCols: 2,
			grid: [
				{ vertical: [false, false], horizontal: [false, false] },
				{ vertical: [false, false], horizontal: [false, false] }
			]
		};

		const mockGetAllMazeId = vi.spyOn(require('./data/queries'), 'getAllMazeId').mockReturnValue({
			all: () => [{ maze_id: '1' }]
		});

		const mockGetMazeById = vi.spyOn(require('./data/queries'), 'getMazeById').mockReturnValue(mockMaze);
		const mockQuestion = vi.spyOn(require('readline/promises').createInterface.prototype, 'question').mockResolvedValue('1');
		const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

		await Effect.runPromise(runMaze);

		expect(mockGetAllMazeId).toHaveBeenCalled();
		expect(mockGetMazeById).toHaveBeenCalledWith('1');
		expect(mockQuestion).toHaveBeenCalledWith('Enter the number of your choice: ');
		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('+---+---+'));
		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('|   |   |'));
		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('+---+---+'));

		mockGetAllMazeId.mockRestore();
		mockGetMazeById.mockRestore();
		mockQuestion.mockRestore();
		consoleSpy.mockRestore();
	});
});