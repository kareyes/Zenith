import { Effect, pipe, Schema } from 'effect';
import {
  API_URL,
  FetchError,
  GET_ALL_MAZE_METADATA,
  GET_SELECTED_MAZE,
  JSONError,
} from './constant';
import { APIResponse } from './data/types';
import {
  Maze,
  MazeMetaArray,
  MazeSchema,
  MetaArraySchema,
} from './types';

const jsonResponse = <T>(response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JSONError(),
  }).pipe(Effect.flatMap((data) => Effect.succeed(data as APIResponse<T>)));

const fetchApi = (url: string) =>
  Effect.tryPromise({
    try: () => fetch(url),
    catch: () => new FetchError('Failed to fetch data'),
  }).pipe(
    Effect.flatMap((response) =>
      response.ok
        ? Effect.succeed(response)
        : Effect.fail(new FetchError('Failed to fetch data')),
    ),
  );

export class MazeAPI extends Effect.Service<MazeAPI>()('MazeAPI', {
  dependencies: [],
  effect: Effect.gen(function* () {
    const BASE_URL = yield* API_URL;
    return {
      getMazeById: (maze_id: string) =>
        pipe(
          fetchApi(
            `${BASE_URL}${GET_SELECTED_MAZE.replace(':maze_id', maze_id)}`,
          ),
          Effect.flatMap((response) => jsonResponse<Maze>(response)),
          Effect.flatMap((response) => {
            const decoded = Schema.decodeUnknownSync(MazeSchema)(response.data);
            return Effect.succeed(decoded);
          }),
        ),
      getAllMaze: () =>
        pipe(
          fetchApi(`${BASE_URL}${GET_ALL_MAZE_METADATA}`),
          Effect.flatMap((response) => jsonResponse<MazeMetaArray>(response)),
          Effect.flatMap((response) => {
            const decoded = Schema.decodeUnknownSync(MetaArraySchema)(
              response.data,
            );
            return Effect.succeed(decoded);
          }),
        ),
    };
  }),
}) {}
