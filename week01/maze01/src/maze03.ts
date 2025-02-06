

const grid = 
[
    {
      horizontal: [
        true, false, false, false,
        true, false, true,  true,
        true, false, true,  false,
        true, false, true,  true,
        true, false, false, true
      ],
      vertical: [
        true, true,  true, true,
        true, false, true, false,
        true, true,  true, false,
        true, true,  true, false,
        true, true,  true, false
      ]
    },
    {
      horizontal: [
        true,  false, true,  true,
        false, false, false, true,
        false, true,  false, false,
        false, true,  false, false,
        false, true,  true,  true
      ],
      vertical: [
        false, true,  true,  false,
        true,  true,  false, false,
        true,  false, true,  true,
        false, true,  false, false,
        true,  false, false, false
      ]
    },
    {
      horizontal: [
        true,  true,  false, true,
        true,  false, true,  true,
        false, true,  true,  true,
        false, false, true,  true,
        true,  true,  false, true
      ],
      vertical: [
        false, true,  false, false,
        true,  true,  false, true,
        false, false, true,  true,
        false, true,  false, true,
        false, true,  false, false
      ]
    },
    {
      horizontal: [
        true, true,  false, false,
        true, true,  true,  false,
        true, true,  true,  false,
        true, false, false, false,
        true, true,  true,  false
      ],
      vertical: [
        false, false, true,  false,
        false, false, false, true,
        false, false, false, true,
        true,  false, true,  false,
        false, false, true,  false
      ]
    },
    {
      horizontal: [
        true,  true,  true,  true,
        true,  true,  true,  true,
        true,  true,  true,  false,
        true,  true,  false, true,
        false, false, true,  true
      ],
      vertical: [
        false, false, true,  false,
        false, false, false, true,
        false, false, true,  false,
        false, true,  true,  false,
        true,  false, false, false
      ]
    },
    {
      horizontal: [
        false, false, true,  true,
        false, false, false, false,
        true,  true,  false, true,
        true,  false, false, false,
        false, false, false, true
      ],
      vertical: [
        true,  false, false, true,
        false, true,  true,  false,
        false, false, false, true,
        false, false, true,  true,
        true,  true,  false, false
      ]
    },
    {
      horizontal: [
        true,  false, false, false,
        true,  false, false, true,
        false, false, false, false,
        true,  true,  true,  false,
        true,  false, false, true
      ],
      vertical: [
        true,  true, false, false,
        true,  true, true,  false,
        false, true, true,  false,
        false, true, true,  true,
        false, true, true,  false
      ]
    },
    {
      horizontal: [
        false, true,  true,  true,
        false, true,  true,  false,
        true,  true,  true,  false,
        false, false, false, true,
        false, false, false, true
      ],
      vertical: [
        true,  false, true,  false,
        true,  false, false, true,
        true,  false, true,  true,
        false, false, true,  false,
        true,  true,  true,  false
      ]
    },
    {
      horizontal: [
        true,  false, true,  false,
        false, false, false, false,
        true,  true,  true,  false,
        true,  false, true,  true,
        false, true,  false, true
      ],
      vertical: [
        true,  false, false, true,
        true,  true,  true,  false,
        false, false, false, true,
        true,  true,  false, true,
        true,  false, true,  false
      ]
    },
    {
      horizontal: [
        true,  true,  false, false,
        true,  true,  true,  true,
        true,  false, false, false,
        false, true,  true,  true,
        true,  false, true,  true
      ],
      vertical: [
        false, true,  true,  false,
        true,  false, true,  false,
        false, false, true,  true,
        false, false, false, false,
        false, true,  false, false
      ]
    },
    {
      horizontal: [
        true,  false, true,  true,
        false, false, false, false,
        false, true,  false, false,
        false, false, false, true,
        true,  true,  true,  true
      ],
      vertical: [
        false, true,  false, true,
        false, true,  false, true,
        false, true,  true,  true,
        true,  true,  false, false,
        true,  false, false, false
      ]
    },
    {
      horizontal: [
        true,  false, true,  true,
        true,  false, false, false,
        true,  false, true,  true,
        true,  false, true,  true,
        false, true,  true,  true
      ],
      vertical: [
        true,  false, false, false,
        true,  true,  true,  true,
        false, true,  false, false,
        true,  true,  false, false,
        false, false, false, false
      ]
    },
    {
      horizontal: [
        true,  true,  false, false,
        false, false, true,  true,
        false, false, true,  false,
        true,  true,  false, false,
        false, false, true,  true
      ],
      vertical: [
        false, true,  false, true,
        false, true,  false, true,
        true,  false, false, true,
        false, false, true,  true,
        true,  false, false, false
      ]
    },
    {
      horizontal: [
        true,  true,  false, true,
        false, false, true,  true,
        true,  true,  false, true,
        false, true,  true,  false,
        false, false, false, true
      ],
      vertical: [
        false, false, true,  true,
        true,  true,  false, false,
        true,  false, true,  false,
        true,  false, true,  true,
        true,  true,  false, false
      ]
    },
    {
      horizontal: [
        true,  false, false, false,
        true,  false, false, false,
        false, false, true,  false,
        true,  false, true,  true,
        true,  true,  false, false
      ],
      vertical: [
        false, true,  true,  false,
        true,  true,  false, true,
        false, true,  false, true,
        false, false, false, true,
        false, true,  true,  false
      ]
    },
    {
      horizontal: [
        true,  false, true,  true,
        false, true,  false, true,
        true,  false, true,  true,
        false, true,  true,  false,
        true,  false, false, true
      ],
      vertical: [
        true,  false, true,  false,
        true,  false, true,  false,
        true,  true,  false, false,
        true,  false, true,  false,
        false, true,  true,  false
      ]
    },
    {
      horizontal: [
        true,  false, false, true,
        true,  false, false, true,
        true,  true,  true,  false,
        false, true,  false, true,
        true,  false, true,  true
      ],
      vertical: [
        true,  true,  false, true,
        false, true,  true,  false,
        false, false, true,  true,
        false, false, true,  false,
        false, true,  false, false
      ]
    },
    {
      horizontal: [
        false, false, true,  true,
        false, false, true,  false,
        true,  false, false, true,
        false, false, false, false,
        false, true,  true,  true
      ],
      vertical: [
        true,  true,  false, false,
        true,  false, true,  false,
        false, true,  false, true,
        true,  false, true,  false,
        true,  false, false, false
      ]
    },
    {
      horizontal: [
        true,  false, true,  false,
        false, true,  true,  true,
        false, false, false, false,
        false, false, true,  false,
        true,  true,  true,  false
      ],
      vertical: [
        true,  false, false, true,
        true,  false, false, false,
        true,  true,  true,  false,
        true,  true,  true,  true,
        false, false, true,  false
      ]
    },
    {
      horizontal: [
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, true
      ],
      vertical: [
        true,  true,  true,  true,
        false, true,  true,  true,
        true,  true,  true,  true,
        true,  true,  false, true,
        true,  false, true,  false
      ]
    }
  ]


  export const mazeModel = {
    maze_id: "003",
    numCols: 20,
    numRows: 20,
    grid: grid,
  };