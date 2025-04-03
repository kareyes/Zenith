import { Effect, flow, pipe, Schema } from 'effect';
import {
  API_URL,
  GET_ALL_MAZE_METADATA,
  GET_SELECTED_MAZE,
} from './constant';
import {  MazeSchema, MetaArraySchema } from './types';
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from '@effect/platform';

const fetchAPI = Effect.gen(function* () {
  const BASE_URL = yield* API_URL;
  const baseClient = yield* HttpClient.HttpClient;
  return baseClient.pipe(
    HttpClient.mapRequest(
      flow(
        HttpClientRequest.acceptJson,
        HttpClientRequest.prependUrl(BASE_URL),
      ),
    ),
  );
});

const parseResponse = <A, I, R>(
  response: HttpClientResponse.HttpClientResponse,
  schema: Schema.Schema<A, I, R>,
) =>
  Effect.gen(function* () {
    const clientResponse = HttpClientResponse.matchStatus({
      200: (response) => HttpClientResponse.schemaBodyJson(schema)(response),
      orElse: function (_: HttpClientResponse.HttpClientResponse) {
        return Effect.fail(_);
      },
    })(response);
    return yield* clientResponse;
  });

export class MazeAPI extends Effect.Service<MazeAPI>()('MazeAPI', {
  dependencies: [],
  effect: Effect.gen(function* () {
    return {
      getMaze: (maze_id: string) =>
        pipe(
          fetchAPI,
          Effect.flatMap((request) =>
            request.get(GET_SELECTED_MAZE.replace(':maze_id', maze_id)),
          ),
          Effect.flatMap((response) => parseResponse(response, MazeSchema)),
          Effect.provide(FetchHttpClient.layer),
        ),

      getDataMaze: () =>
        pipe(
          fetchAPI,
          Effect.flatMap((request) => request.get(`${GET_ALL_MAZE_METADATA}`)),
          Effect.flatMap((response) =>
            parseResponse(response, MetaArraySchema),
          ),
          Effect.provide(FetchHttpClient.layer),
        ),
    };
  }),
}) {}
