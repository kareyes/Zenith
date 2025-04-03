import { fastify, FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import {
  ERROR_CODE,
  GET_ALL_MAZE_METADATA,
  GET_SELECTED_MAZE,
} from './constant';
import { Context, Effect, Layer, pipe } from 'effect';
import { MazeDBServices } from './api/services';
import { PORT } from '../../config';
import { BunRuntime } from '@effect/platform-bun';

class HttpServer extends Context.Tag('HttpServer')<
  HttpServer,
  FastifyInstance
>() {
  static readonly Live = Layer.effect(
    HttpServer,
    Effect.gen(function* (_) {
      const server = fastify();
      server.register(cors, {
        origin: '*',
      });
      return server;
    }),
  );
}

const ListenLive = Layer.effectDiscard(
  Effect.gen(function* (_) {
    const port = yield* PORT;
    const server = yield* _(HttpServer);
    yield* _(
      Effect.sync(() =>
        server.listen({ port }, (err, address) => {
          if (err) {
            console.error(err);
            process.exit(1);
          }
          console.log(`Server listening at ${address}`);
        }),
      ),
    );
  }),
);

export const serversLayer = Layer.effectDiscard(
  Effect.gen(function* (_) {
    const http = yield* _(HttpServer);

    http.get('/', async (_, reply) => {
      reply.send('Hello World');
    });

    http.get(GET_SELECTED_MAZE, (request, reply) => {
      const { maze_id } = request.params as { maze_id: string };
      Effect.runPromise(
        pipe(
          Effect.gen(function* (_) {
            const mazeApi = yield* _(MazeDBServices);
            const maze = yield* _(mazeApi.getbyId(maze_id));
            return maze;
          }),
          Effect.provide(MazeDBServices.Default),
        ),
      )
        .then((res) => {
          reply.send( res);
        })
        .catch(() => {
          reply
            .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
            .send({ status: 'error', error: 'Failed to fetch maze' });
        });
    });

    http.get(GET_ALL_MAZE_METADATA, (_, reply) => {
      Effect.runPromise(
        pipe(
          Effect.gen(function* (_) {
            const mazeApi = yield* _(MazeDBServices);
            const maze = yield* _(mazeApi.getMetadata());
            return maze;
          }),
          Effect.provide(MazeDBServices.Default),
        ),
      )
        .then((res) => {
          reply.send(res);
        })
        .catch(() => {
          reply
            .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
            .send({ status: 'error', error: 'Failed to fetch maze' });
        });
    });
  }),
);

pipe(
  Layer.merge(serversLayer, ListenLive),
  Layer.provide(HttpServer.Live),
  Layer.launch,
  BunRuntime.runMain,
);
