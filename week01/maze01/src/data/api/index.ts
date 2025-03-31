import { fastify, FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import {
  ERROR_CODE,
  GET_ALL_MAZE_METADATA,
  GET_SELECTED_MAZE,
} from '../constant';
import { Effect, pipe } from 'effect';
import { MazeDBServices } from './services';
import { PORT } from '../../../config';

const apis = (server: FastifyInstance) =>
  Effect.sync(() => {
    server.get('/', async (_, reply) => {
      reply.send('Hello World');
    });

    server.get(GET_SELECTED_MAZE, (request, reply) => {
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
          reply.send({ status: 'success', data: res });
        })
        .catch(() => {
          reply
            .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
            .send({ status: 'error', error: 'Failed to fetch maze' });
        });
    });

    server.get(GET_ALL_MAZE_METADATA, (_, reply) => {
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
          reply.send({ status: 'success', data: res });
        })
        .catch(() => {
          reply
            .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
            .send({ status: 'error', error: 'Failed to fetch maze' });
        });
    });
  });

const initializeServer = Effect.gen(function* (_) {
  const Ports = yield* PORT;
  const server = fastify();
  server.register(cors, {
    origin: '*',
  });
  server.listen({ port: Ports }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
  return server;
});


initializeServer.pipe(
  Effect.flatMap((server) => apis(server)),
  Effect.runPromise
);


