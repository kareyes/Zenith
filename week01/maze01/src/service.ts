import { Effect, pipe, Ref, Schema } from 'effect';
import { getAllMazeIds, getSelectedID } from './data/queries';
import { CurrentPosition, MetaArraySchema, ParseMazeSchema } from './types';
import { CurrentPositionState, DatabaseError, DBMazeClient } from './constant';

export const DBMazeClientLive = {
  getbyId: (maze_id: string) =>
    Effect.tryPromise({
      try: () => getSelectedID(maze_id),
      catch: () => new DatabaseError('Error fetching maze by id'),
    }).pipe(
      Effect.flatMap((res) =>
        res
          ? Effect.succeed(Schema.decodeUnknownSync(ParseMazeSchema)(res))
          : Effect.fail(new DatabaseError('No maze found')),
      ),
    ),

  getAllMazeId: () =>
    Effect.tryPromise({
      try: () => getAllMazeIds(),
      catch: () => new DatabaseError('Error fetching maze ids'),
    }).pipe(
      Effect.flatMap((maze) =>
        maze
          ? Effect.succeed(Schema.decodeUnknownSync(MetaArraySchema)(maze))
          : Effect.fail(new DatabaseError('No maze found')),
      ),
    ),
};

// export class CurrentPositionState1 extends Effect.Service<CurrentPositionState>()(
//   'CurrentPositionState',
//   {
//     effect: Effect.gen(function* () {
//       return Ref.make({ x: 0, y: 0 });
//     }),
//   },
// ) {}

// export class CurrentPosService extends Effect.Service<CurrentPosService>()(
//   "CurrentPosService",
//   {
//     effect: Effect.gen(function* () {
//       const state = yield* CurrentPositionState1;
//       return {
//         getCurrentPositionState: (Ref.get(state)),
//         setCurrentPositionState: (position: CurrentPosition) =>
//           pipe(
//             CurrentPositionState,
//             Effect.flatMap((state) => Ref.update(state, () => position)),
//           ),  
//       }
//       ;
//     }),
//     dependencies: { CurrentPositionState1. },
//   }

// ) {}



export const getMazeById = (maze_id: string) =>
  pipe(
    DBMazeClient,
    Effect.flatMap((x) => x.getbyId(maze_id)),
  );

export const getAllMazeId = () =>
  pipe(
    DBMazeClient,
    Effect.flatMap((x) => x.getAllMazeId()),
  );

  export const getCurrentPositionState = ()=>
    pipe(
      CurrentPositionState,
      Effect.flatMap(state => Ref.get(state)),
    )

export const setCurrentPositionState = (position:CurrentPosition) =>
  pipe(
    CurrentPositionState,
    Effect.flatMap((state) => Ref.update(state, () => (position))),  
  );

  export const CurrentPositionService = Effect.provideServiceEffect(
    CurrentPositionState,
    Ref.make({ x: 0, y: 0 }),
  );


export const DBMazeClientService = Effect.provideService(
  DBMazeClient,
  DBMazeClientLive,
);
