// import { Effect, Context, pipe, Schema, Layer } from 'effect';
// import { Maze, MazeSchema, RawMaze, MazeMeta, MazeMetaSchema } from './types';
// import { getAllMazeId, getAllMazeIds, getSelectedID } from './data/queries';
// import { get } from 'http';
// import { E } from 'vitest/dist/chunks/reporters.6vxQttCV';
// import { run } from 'effect/Schedule';

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

