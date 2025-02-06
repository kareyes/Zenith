export const grid = [
  {
    vertical: [true, true, false, true, false],
    horizontal: [true, false, true, true, true],
  },
  {
    vertical: [true, false, false, false, false],
    horizontal: [false, false, true, true, true],
  },
  {
    vertical: [true, true, false, false, false],
    horizontal: [true, false, false, false, true],
  },
  {
    vertical: [false, true, true, true, false],
    horizontal: [true, false, true, false, true],
  },
  {
    vertical: [true, true, false, true, false],
    horizontal: [false, false, false, false, true],
  },
];


export const mazeModel = {
  maze_id: "001",
  numCols: 5,
  numRows: 5,
  grid: grid,
};

// console.log(GridMap)
//   interface Cell {
//     vertical: boolean[];
//     horizontal: boolean[];
//   }

// Schema<string, Cell>({ vertical: Schema.Array(Schema.Boolean), horizontal: Schema.Array(Schema.Boolean) })
// const Cell = Schema.Boolean
// const rowSchema = Schema.Struct({
//     vertical:Schema.Array(Schema.Boolean),
//     horizontal: Schema.Array(Schema.Boolean)
// })

// type Row = typeof rowSchema

// const mazeModel = grid.map((row) => {
//     return Schema.encodeUnknownSync(rowSchema)({
//         vertical: row.vertical.map((cell) => Schema.encodeUnknownSync(Schema.Boolean)(cell)),
//         horizontal: row.horizontal.map((cell) => Schema.encodeUnknownSync(Schema.Boolean)(cell))
//     });
// });

// const decodeRow = Schema.decodeUnknownSync(rowSchema)(mazeModel)

// const BooleanFromString = Schema.transform(
//     // Source schema: "on" or "off"
//     Schema.Literal("on", "off"),
//     // Target schema: boolean
//     Schema.Boolean,
//     {
//       // optional but you get better error messages from TypeScript
//       strict: true,
//       // Transformation to convert the output of the
//       // source schema ("on" | "off") into the input of the
//       // target schema (boolean)
//       decode: (literal) => literal === "on", // Always succeeds here
//       // Reverse transformation
//       encode: (bool) => (bool ? "on" : "off")
//     }
//   )

// const t = Schema.decodeUnknownSync(BooleanFromString)("wrong")

// const mazeModel = grid.map((row) => {
//     return S.encodeUnknown(rowSchema)({
//         vertical: row.vertical.map((cell) => Schema<Schema.Boolean>(cell)),
//         horizontal: row.horizontal.map((cell) => S.encodeUnknown(S.Boolean)(cell))
//     });
// });

// const firstRow: Row[] = mazeModel

// console.log(mazeModel)
