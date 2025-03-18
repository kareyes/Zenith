
import {
    KeyValueStore,
    layerMemory
  } from "@effect/platform/KeyValueStore"
import { Effect, Schema, Option, pipe } from "effect"
import { CurrentPositionSchema, MazeSchema } from "../types"


const createSchemaStore = <T>(schema: Schema.Schema<T>) => {
    const store = Effect.gen(function* () {
        const kv = (yield* KeyValueStore).forSchema(schema)
        return kv
    })

    const set = (key: string, value: T) => {
        return Effect.gen(function* () {
            const kv = (yield* store)
            yield* kv.set(key, value)
        }).pipe(
            Effect.provide(layerMemory)
        )
    }
    const get = (key: string) => {
        return Effect.gen(function* () {
            const kv = (yield* store)
            return yield* kv.get(key)
        })
    }
    const size = () => {
        return Effect.gen(function* () {
            const kv = (yield* store)
            return yield* kv.size
        })
    }
    return { set, get, size, store }
}

export const mazeStore = createSchemaStore(MazeSchema)
export const currentPositionStore = createSchemaStore(CurrentPositionSchema)

const t = currentPositionStore.store.pipe(Effect.provide(layerMemory))


// const createSchemaStore1 = <T>(schema: Schema.Schema<T>) => {
//     return Effect.gen(function* () {
//         const kv = (yield* KeyValueStore).forSchema(schema)
//         return kv
//     })
// }

// // export const mazeStore = ()

// const program = Effect.gen(function* () {
//     // Define a schema for the Person type
//     const Person = Schema.Struct({
//         name: Schema.String,
//         age: Schema.Number
//     })

//     // Create a SchemaStore for the Person schema
//     const kv = yield* createSchemaStore1(Person)

//     // Add a value that adheres to the schema
//     const value = { name: "Alice", age: 30 }
//     yield* kv.set("user1", value)
//     console.log(yield* kv.size)

//     // Retrieve and log the value
//     const user1 = yield* kv.get("user1")
    
//     console.log(Option.getOrThrow(user1))
// })


// const prog = Effect.gen(function* () {
//     // const pos = yield* currentPositionStore.set("currentPosition", { x: 10, y: 0 })
// const pos = yield* t
//     yield* pos.set("currentPosition", { x: 10, y: 0 })

//     const posss = yield* pos.get("currentPosition")
//     console.log(posss)
//     // const pos1 = yield* currentPositionStore.get("currentPosition")
//     // console.log(pos1)
// })
// // Use the in-memory store implementation
// Effect.runPromise(prog)


// const prog1 = Effect.gen(function* () {

//     const pos = yield* t

//     const newPos = yield* pos.get("currentPosition")
//     console.log(newPos)
//     yield* pos.set("currentPosition", { x: 100, y: 0 })

//     const posss = yield* pos.get("currentPosition")
//     console.log(posss)

//     // const newPos = yield* currentPositionStore.get("currentPosition")
//     // console.log(newPos)

//     // const pos = yield* currentPositionStore.set("currentPosition", { x: 109, y: 0 })

//     // console.log(pos)
//     // const pos1 = yield* currentPositionStore.get("currentPosition")
//     // console.log(pos1)
// })

// Effect.runPromise(prog1)

const prog2 = pipe(
    t,
    Effect.flatMap(pos => Effect.runPromise(pos.set("currentPosition", { x: 100, y: 0 }))),
    Effect.flatMap(() => t),
    Effect.flatMap(pos => pos.get("currentPosition")),
    Effect.tap(console.log),
    // Effect.runPromise
)