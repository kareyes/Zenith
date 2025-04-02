// import { Effect, Context, pipe, Schema, Layer } from 'effect';
// import { Maze, MazeSchema, RawMaze, MazeMeta, MazeMetaSchema } from './types';
// import { getAllMazeId, getAllMazeIds, getSelectedID } from './data/queries';
// import { get } from 'http';
// import { E } from 'vitest/dist/chunks/reporters.6vxQttCV';
// import { run } from 'effect/Schedule';

import { Effect, flow, Layer, pipe, Ref, Schedule, Schema } from 'effect';
import { MazeAPI } from '../apiServices';
import { MazeMenu } from '../menu';
import { E } from 'vitest/dist/chunks/reporters.6vxQttCV';
import { MazeDataState, RawData } from '../constant';
import { gameStart } from '../maze';
import {fastify, FastifyInstance } from 'fastify';
import { PORT } from '../../config';

// import { Console, Context, Effect, pipe, Ref, Schema } from "effect";
// import { CurrentPosition, GridSchema, Maze } from "./types";
// import { cons } from "effect/List";
// import { MyState, PositionState } from "./constant";
// import { MyState } from "./constant";

// // Declaring a tag for a service that generates random numbers
// class Random extends Context.Tag('MyRandomService')<
//   Random,
//   { readonly next: Effect.Effect<number> }
// >() {}

// // Using the service
// const program = pipe(
//   Random,
//   Effect.flatMap((random) =>
//     pipe(
//       random.next,
//       Effect.map((randomNumber) => {
//         console.log(`random number: ${randomNumber}`);
//       }),
//     ),
//   ),
// );

// // Providing the implementation
// //
// //      ┌─── Effect<void, never, never>
// //      ▼
// const runnable = Effect.provideService(program, Random, {
//   next: Effect.sync(() => Math.random()),
// });

// // Run successfully
// // Effect.runPromise(runnable)

// // class MazeClient1 extends Context.Tag('MazeClientService')<
// //   MazeClient1,
// //   { getbyId1(maze_id: string): Effect.Effect<number> }
// // >() {}

// // const MazeClientLive1 = {
// //   getbyId1: (maze_id: string) => Effect.sync(() => Number(maze_id)),
// // };

// // const getMazeById1 = (maze_id: string) =>
// //   pipe(
// //     MazeClient,
// //     Effect.flatMap((x) => x.getbyId(maze_id)),
// //   );

// // const runn1 = Effect.provideService(
// //   getMazeById1('2'),
// //   MazeClient1,
// //   MazeClientLive1,
// // );

// // const prog1 = pipe(runnable, (run) => Effect.sync(() => run));

// // Effect.runPromise(prog1)

// export class DatabaseError {
//   readonly _tag = 'DatabaseError';
//   constructor(readonly message: string) {}
// }

// class MazeClient extends Context.Tag('MazeClientService')<
//   MazeClient,
//   {
//     getbyId(maze_id: string): Effect.Effect<Maze, DatabaseError>;
//     getAllMazeId(): Effect.Effect<MazeMeta[], DatabaseError>;
//   }
// >() {}

// const MazeClientLive2 = {
//   getbyId: (maze_id: string) =>
//     Effect.tryPromise({
//       try: () => getSelectedID(maze_id),
//       catch: () => new DatabaseError('Error fetching maze by id'),
//     }).pipe(
//       Effect.map((res) => res as RawMaze),
//       Effect.flatMap((res) => {
//         if (res) {
//           const maze = {
//             ...res,
//             grid: JSON.parse(res.grid),
//           };
//           return Effect.succeed(Schema.decodeUnknownSync(MazeSchema)(maze));
//         } else {
//           return Effect.fail(new DatabaseError('No maze found'));
//         }
//       }),
//     ),
//   getAllMazeId: () =>
//     Effect.tryPromise({
//       try: () => getAllMazeIds(),
//       catch: () => new DatabaseError('Error fetching maze ids'),
//     }).pipe(
//       Effect.map((res) => res as MazeMeta[]),
//       Effect.flatMap((maze) =>
//         maze
//           ? Effect.succeed(maze)
//           : Effect.fail(new DatabaseError('No maze found')),
//       ),
//     ),
// };

// const getMazeById = (maze_id: string) =>
//   pipe(
//     MazeClient,
//     Effect.flatMap((x) => x.getbyId(maze_id)),
//   );

// const getAllMazeById = () =>
//   pipe(
//     MazeClient,
//     Effect.flatMap((x) => x.getAllMazeId()),
//   );

// const runn = Effect.provideService(MazeClient, MazeClientLive2);

// const lay = Layer.effect( MazeClient, MazeClientLive2)

// const mazeCmd = pipe(
//   getAllMazeById(),
//   Effect.map((maze) => {
//     console.log(maze);
//   }),
// );

// const ws = pipe(
//  mazeCmd,
//  runn
// )

// Effect.runPromise(ws);

// // pipe(
// //   mazeCmd,
// //   Effect.provide(MazeClientLive2)
// // )
// // const prog = pipe(runnable, (run) => Effect.sync(() => run));

// // Effect.runPromise(runn).then((res) => console.log(res));

// import { Effect, pipe, Ref } from "effect"

// class Counter {
//   inc: Effect.Effect<void>
//   dec: Effect.Effect<void>
//   get: Effect.Effect<number>

//   constructor(private value: Ref.Ref<number>) {
//     this.inc = Ref.update(this.value, (n) => n + 1)
//     this.dec = Ref.update(this.value, (n) => n - 1)
//     this.get = Ref.get(this.value)
//   }
// }

// const make = Effect.andThen(Ref.make(0), (value) => new Counter(value))

// const program = pipe(
//   make,
//   Effect.flatMap((counter) => {
//     const logCounter = <R, E, A>(label: string, effect: Effect.Effect<A, E, R>) =>
//       pipe(
//         counter.get,
//         Effect.flatMap((value) =>
//           pipe(
//             Effect.log(`${label} get: ${value}`),
//             Effect.flatMap(() => effect)
//           )
//         )
//       );

//     return pipe(
//       logCounter("task 1", counter.inc),
//       Effect.zip(logCounter("task 2", counter.inc)),
//       Effect.zip(logCounter("task 3", counter.dec)),
//       Effect.zip(logCounter("task 4", counter.inc)),
//       Effect.flatMap(() => counter.get),
//       Effect.flatMap((value) => Effect.log(`This counter has a value of ${value}.`))
//     );
//   })
// );

// Effect.runPromise(program)

// import { Effect, Context, Ref, pipe } from "effect"

// // Create a Tag for our state
// class MyState extends Context.Tag("MyState")<
//   MyState,
//   Ref.Ref<number>
// >() {}

// // Subprogram 1: Increment the state value twice
// const subprogram1 = pipe(
//   MyState,
//   Effect.flatMap((state) =>
//     pipe(
//       Ref.update(state, (n) => n + 1),
//       Effect.zipRight(Ref.update(state, (n) => n + 1))
//     )
//   )
// )

// // Subprogram 2: Decrement the state value and then increment it
// const subprogram2 = pipe(
//   MyState,
//   Effect.flatMap((state) =>
//     pipe(
//       Ref.update(state, (n) => n - 1),
//       Effect.zipRight(Ref.update(state, (n) => n + 1))
//     )
//   )
// )

// // Subprogram 3: Read and log the current value of the state
// const subprogram3 = pipe(
//   MyState,
//   Effect.flatMap((state) =>
//     pipe(
//       Ref.get(state),
//       Effect.flatMap((value) => Effect.sync(() => console.log(`MyState has a value of ${value}.`)))
//     )
//   )
// )

// // Compose subprograms 1, 2, and 3 to create the main program
// const program = pipe(
//   subprogram1,
//   Effect.zipRight(subprogram2),
//   Effect.zipRight(subprogram3)
// )

// // Create a Ref instance with an initial value of 0
// const initialState = Ref.make(0)

// // Provide the Ref as a service
// const runnable = program.pipe(
//   Effect.provideServiceEffect(MyState, initialState)
// )

// // Run the program and observe the output
// Effect.runPromise(runnable)

// const MazeMetaSchema = Schema.Struct({
//   maze_id: Schema.String,
//   mazeName: Schema.String,
//   created_at: Schema.String,
// });

// type MazeMeta = typeof MazeMetaSchema.Type;

// const MazeSchema =
//   Schema.Struct({
//     numCols: Schema.Number,
//     numRows: Schema.Number,
//     grid: Schema.Array(GridSchema),
//   })

//   const RawMazeSchema =
//   Schema.Struct({
//     numCols: Schema.Number,
//     numRows: Schema.Number,
//     grid: Schema.String,
//   });

//   type Rawmaze = typeof RawMazeSchema.Type;
//   const testMeta = Schema.Union(MazeSchema, MazeMetaSchema)

//   const RespMazeSchema = Schema.transform(
//   RawMazeSchema,
//   MazeSchema,
//   {
//     // strict: true,
//     encode: (maze) => ({
//       ...maze,
//       grid: JSON.stringify(maze.grid),
//     }),
//     decode: (rawMaze) => ({
//       ...rawMaze,
//       grid: JSON.parse(rawMaze.grid),
//     }),
//   }
// );

// const rawMaze = {
//   numCols: 5,
//   numRows: 5,
//   grid: JSON.stringify([
//     { vertical: [true, false, true, false, true], horizontal: [false, true, false, true, false] },
//     { vertical: [false, true, false, true, false], horizontal: [true, false, true, false, true] },
//   ]),
// };

// const rawMaze1 = {
//   numCols: 5,
//   numRows: 5,
//   grid: [
//     { vertical: [true, false, true, false, true], horizontal: [false, true, false, true, false] },
//     { vertical: [false, true, false, true, false], horizontal: [true, false, true, false, true] },
//   ],
// };

// const decodedMaze = Schema.encodeUnknownSync(RespMazeSchema)(rawMaze1);
// console.log(decodedMaze);

// const teee = Schema.decodeUnknownSync(testMeta)({ maze_id: '1', mazeName: 'maze', created_at: '2021-09-09' , numCols: 2, numRows: 2, grid: [{ vertical: [true, false], horizontal: [true, false] }]});

// console.log(teee);

//   const subprogram1 = Effect.gen(function* () {
//       const state = yield* MyState
//       yield* Ref.update(state, (n) => "hello")
//     })

//     const subprogram3 = Effect.gen(function* () {
//       const state = yield* MyState
//       const value = yield* Ref.get(state)
//       console.log(`MyState has a value of ${value}.`)
//     })

//   const program = Effect.gen(function* () {
//       yield* subprogram1
//       yield* subprogram3
//     })

//   const currentMazeEffect = Ref.make("maze")

//   // const runnable = currentMazeEffect.pipe(
//   //     Effect.flatMap((currentMaze) =>
//   //         program.pipe(
//   //             Effect.provideService(MyState, currentMaze)
//   //         )
//   //     ),
//   // );

//   const runnable = program.pipe(
//   Effect.provideServiceEffect(MyState, currentMazeEffect)
// )

// // Run the program and observe the output
// Effect.runPromise(runnable)

//   Effect.runPromise(runnable).then(console.log).catch(console.error);

// //
// import { Effect, Context, Ref } from "effect"

// Create a Tag for our state
// class MyState extends Context.Tag("MyState")<
//   MyState,
//   Ref.Ref<number>
// >() {}

// // Subprogram 1: Increment the state value twice
// const subprogram1 = Effect.gen(function* () {
//   const state = yield* MyState
//   yield* Ref.update(state, (n) => n + 1)
//   yield* Ref.update(state, (n) => n + 1)
// })

// // Subprogram 2: Decrement the state value and then increment it
// const subprogram2 = Effect.gen(function* () {
//   const state = yield* MyState
//   yield* Ref.update(state, (n) => n - 1)
//   yield* Ref.update(state, (n) => n + 1)
// })

// // Subprogram 3: Read and log the current value of the state
// const subprogram3 = Effect.gen(function* () {
//   const state = yield* MyState
//   const value = yield* Ref.get(state)
//   console.log(`MyState has a value of ${value}.`)
// })

// // Compose subprograms 1, 2, and 3 to create the main program
// const program = Effect.gen(function* () {
//   yield* subprogram1
//   yield* subprogram2
//   yield* subprogram3
// })

// // Create a Ref instance with an initial value of 0
// const initialState = Ref.make(0)

// // Provide the Ref as a service
// const runnable = program.pipe(
//   Effect.provideServiceEffect(MyState, initialState)
// )

// // Run the program and observe the output
// Effect.runPromise(runnable)

// const make = Effect.andThen(Ref.make({ x: 0, y: 0 }), (value) => new PositionState(value))

// const refPos = new PositionState(Effect.runSync(Ref.make({ x: 0, y: 0 })));

// const posstate: Ref.Ref<CurrentPosition> = Effect.runSync(Ref.make({ x: 0, y: 0 }));

// const sub1 = Effect.gen(function* () {
//   const state = yield* make
//   const position = yield* state.get;
//   console.log("position", position)
// })

// const sub2 = Effect.gen(function* () {
//   // refPos.update({x: 1, y: 1})
//   // Ref.update(posstate, () => ({ x: 1, y: 1 }))
//   const state = yield* make
//   yield* state.update({ x: 1, y: 1 })
//   // const state = Ref.get(posstate)
//   const position = yield* state.get;

//   console.log("positionnew", position)
// })

// const sub3 = Effect.gen(function* () {
//   const state = yield* make
//   const position = yield* state.get;
//   console.log("positionlast", position)
//   // const state = Ref.get(posstate)
//   // const position = yield* state;
//   // console.log("positionlast", position)
// })
// // console.log(refPos.get())
// // console.log(refPos.update({ x: 1, y: 1 }))
// // console.log(refPos.get())

// const prog = pipe(
//   sub1,
//   Effect.zipRight(sub2),
//   Effect.zipRight(sub3)
// )

// Effect.runPromise(prog)

// const sub = pipe(
//   make,
//   Effect.flatMap((state) =>
//     pipe(
//       state.get,
//       Effect.flatMap((position) =>
//         pipe(
//           Effect.sync(() => console.log("position", position)),
//           Effect.zipRight(state.update({ x: 1, y: 1 })),
//           Effect.zipRight(state.get),
//           Effect.flatMap((newpos) => Effect.sync(() => console.log("new", newpos)))
//         )
//       )
//     )
//   )
// );

// const sub1 = pipe(
//   posState,
//   Effect.flatMap((state) =>
//     pipe(
//       state.get,
//       Effect.flatMap((position) =>
//         pipe(
//           Effect.sync(() => console.log("position", position)),
//           Effect.zipRight(state.update({ x: 2, y: 2 })),
//           Effect.zipRight(state.get),
//           Effect.flatMap((newpos) => Effect.sync(() => console.log("new", newpos)))
//         )
//       )
//     )
//   )
// )
// const prog = Effect.gen(function* () {
//   yield* sub;
//   yield* sub1;
// } )

// Effect.runPromise(prog)
// let count = 0

// const policy = Schedule.addDelay(Schedule.forever, () => "100 millis")

// const action = Effect.sync(() => {
//   console.log(`Action called ${++count} time(s)`)
//   return count
// })

// const program = Effect.repeat(action, {
//   until:(n) => n >= 5,
//   schedule: policy,
// })

// Effect.runFork(program)

// Example function to insert symbols using character codes
// function insertSymbolUsingCharCode(charCode: number): string {
//   return String.fromCharCode(charCode);
// }

// // Example usage with Wingdings font character codes
// const symbol = insertSymbolUsingCharCode(74); // 'J' in Wingdings font
// console.log(symbol); // Output: 'J'

// // Example function to insert symbols using Unicode escape sequences
// function insertSymbolUsingUnicodeEscapeSequence(unicodeEscapeSequence: string): string {
//   return unicodeEscapeSequence;
// }
//  console.log(insertSymbolUsingUnicodeEscapeSequence('\u{1F600}')); // Output: 😁

// // Example usage with Unicode escape sequences
// const symbol1 = insertSymbolUsingUnicodeEscapeSequence('\u{1F600}'); //
// //  😁
// console.log(symbol1); // Output:
// //  😁
// const symbols = [
//   { name: 'Grinning Face', code: '\u{1F600}', output: '😁' },
//   { name: 'Thumbs Up', code: '\u{1F44D}', output: '👍' },
//   { name: 'Red Heart', code: '\u{2764}', output: '❤' },
//   { name: 'Star', code: '\u{2B50}', output: '⭐' },
//   { name: 'Check Mark', code: '\u{2714}', output: '✔' },
// ];

// // Display the symbols

// symbols.forEach(symbol => {
//   console.log(`${symbol.name}: ${symbol.code} -> ${symbol.output}`);
// });
// const animalSymbols = [
//   { name: 'Dog Face', code: '\u{1F436}', output: '🐶' },
//   { name: 'Cat Face', code: '\u{1F431}', output: '🐱' },
//   { name: 'Mouse Face', code: '\u{1F42D}', output: '🐭' },
//   { name: 'Cow Face', code: '\u{1F42E}', output: '🐮' },
//   { name: 'Tiger Face', code: '\u{1F42F}', output: '🐯' },
//   { name: 'Rabbit Face', code: '\u{1F430}', output: '🐰' },
//   { name: 'Fox Face', code: '\u{1F98A}', output: '🦊' },
//   { name: 'Bear Face', code: '\u{1F43B}', output: '🐻' },
//   { name: 'Panda Face', code: '\u{1F43C}', output: '🐼' },
//   { name: 'Koala Face', code: '\u{1F428}', output: '🐨' },
// ];

// animalSymbols.forEach(symbol => {
//   console.log(`${symbol.name}: ${symbol.code} -> ${symbol.output}`);
// });

// const celebrationSymbols = [
//   { name: 'Party Popper', code: '\u{1F389}', output: '🎉' },
//   { name: 'Confetti Ball', code: '\u{1F38A}', output: '🎊' },
//   { name: 'Tada', code: '\u{1F64C}', output: '🙌' },
//   { name: 'Clapping Hands', code: '\u{1F44F}', output: '👏' },
//   { name: 'Balloon', code: '\u{1F388}', output: '🎈' },
//   { name: 'Fireworks', code: '\u{1F386}', output: '🎆' },
//   { name: 'Sparkler', code: '\u{1F387}', output: '🎇' },
//   { name: 'Sparkles', code: '\u{2728}', output: '✨' },
//   { name: 'Crown', code: '\u{1F451}', output: '👑' },
//   { name: 'Trophy', code: '\u{1F3C6}', output: '🏆' },
// ];

// celebrationSymbols.forEach(symbol => {
//   console.log(`${symbol.name}: ${symbol.code} -> ${symbol.output}`);
// // });
// const jsonResponse = (response: Response) =>
//   Effect.tryPromise(() => response.json());

// const maze = pipe(
//   Effect.gen(function* () {
//     const maze = yield* MazeAPI
//     const mazeId = yield* maze.getAllMaze()
//     console.log(mazeId)
//   }),
//   Effect.provide(MazeAPI.Default)
// )

// Effect.runPromise(maze).then(console.log).catch(console.error)

const program = pipe(
  MazeMenu,
  Effect.zipRight(gameStart)
);

Effect.runPromise(
  program.pipe(
    Effect.provide(MazeMenu.Default),
    Effect.provideServiceEffect(MazeDataState, Ref.make(RawData))
  )
);





// export class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
//   id: Schema.Number,
//   order: Schema.Number,
//   name: Schema.String,
//   height: Schema.Number,
//   weight: Schema.Number,
//   cries: Schema.Struct({
//     latest: Schema.String,
//     legacy: Schema.String,
//   }),
// }) {}

// import {
//   FetchHttpClient,
//   HttpClient,
//   HttpClientRequest,
//   HttpClientResponse,
// } from "@effect/platform";
// // import { Effect, flow } from "effect";
// // import { Pokemon } from "../schemas";

// export const main = Effect.gen(function* () {
//   const baseClient = yield* HttpClient.HttpClient;
//   const pokeApiClient = baseClient.pipe(
//     HttpClient.mapRequest(
//       flow(
//         HttpClientRequest.acceptJson,
//         HttpClientRequest.prependUrl("https://pokeapi.co/api/v2")
//       )
//     )
//   );

//   return yield* pokeApiClient.get("/pokemon/squirtle");
// }).pipe(
//   Effect.flatMap(HttpClientResponse.schemaBodyJson(Pokemon)),
//   Effect.scoped,
//   Effect.provide(FetchHttpClient.layer)
// );

// Effect.runPromise(main).then(console.log).catch(console.error);


// import cors from '@fastify/cors';

// class HttpServer extends Context.Tag("HttpServer")<
//   HttpServer,
//   ReturnType<FastifyInstance>
// >() {
//   static readonly Live = Layer.sync(HttpServer, () => fastify());
// }

// const createServer = Layer.effect(
//   HttpServer,
//   Effect.gen(function* (_) {
//     const server = yield* _(HttpServer);
//     server.register(cors, {
//       origin: '*',
//     });
//     yield* _(apis(server));
//     return server;
//   })
// );

// const ListenLive = Layer.effectDiscard(
//   Effect.gen(function* (_) {
//     const port = yield* PORT
//     const server = fastify();
//      server.register(cors, {
//         origin: '*',
//       });
//     yield* _(
//       Effect.sync(() =>
//         server.listen({ port }, (err, address) => {
//           if (err) {
//             console.error(err);
//             process.exit(1);
//           }
//           console.log(`Server listening at ${address}`);
//         })
//       )
//     );
//   })
// );
