import { DatabaseSync, StatementSync, SupportedValueType } from 'node:sqlite';
import { Effect, Context, pipe, Layer, Data } from 'effect';
import { E } from 'vitest/dist/chunks/reporters.6vxQttCV';
import { DatabaseError } from '../constant';

const instancesMap: Map<string, DatabaseSync> = new Map();

// export interface DatabaseService {
//   getDB: Effect.Effect<unknown, never, DatabaseSync>;
//   closeAll: Effect.Effect<unknown, never, void>;
//   run: (
//     sql: string,
//     params: SupportedValueType[],
//   ) => Effect.Effect<unknown, never, void>;
//   get: <T>(
//     sql: string,
//     params: SupportedValueType[],
//   ) => Effect.Effect<unknown, never, T>;
//   all: <T>(
//     sql: string,
//     params: SupportedValueType[],
//   ) => Effect.Effect<unknown, never, T[]>;
// }

const DBMaze = `${__dirname}/maze.db`;
const DBMazeClient = Effect.succeed(() => {
    const client = new DatabaseSync(DBMaze);
    return client

});

export class DatabaseService extends Effect.Service<DatabaseService>()(
  'DatabaseService',
  {
    effect: Effect.gen(function* () {
      return {
        run: (sql: string, params: SupportedValueType[]) =>
          pipe(
            DBMazeClient,
            Effect.map((db) => {
              const stmt = db().prepare(sql);
              stmt.run(...params);
            }),
            Effect.catchAll((e) => Effect.fail(new DatabaseError(e))),
          ),
        get: <T>(sql: string, params: SupportedValueType[]) =>
          pipe(
            DBMazeClient,
            Effect.map((db) => {
              const stmt = db().prepare(sql);
                  return stmt.get(...params
              ) as T;;
            }),
            Effect.catchAll((e) => Effect.fail(new DatabaseError(e))),
          ),
        all: <T>(sql: string, params: SupportedValueType[]) =>
          pipe(
            DBMazeClient,
            Effect.map((db) => {
              const stmt = db().prepare(sql);
              return stmt.all(...params) as T[];
            }),
            Effect.catchAll((e) => Effect.fail(new DatabaseError(e))),
          ),
      };
    }),
  },
) {}

