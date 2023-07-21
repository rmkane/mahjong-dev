const TILE_SCHEMA = {
  suits: [
    // Suits
    // Dots (Circles, Wheels)
    {
      group: "suits",
      name: "dots",
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      duplicates: 4,
      suited: true,
    },
    // Bamboo ("Bams", Sticks)
    {
      group: "suits",
      name: "bamboo",
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      duplicates: 4,
      suited: true,
    },
    // Characters ("Cracks", "Kraks", Numbers)
    {
      group: "suits",
      name: "characters",
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      duplicates: 4,
      suited: true,
    },
    // Honors
    // Winds
    {
      group: "honors",
      name: "winds",
      values: ["east", "south", "west", "north"],
      duplicates: 4,
    },
    // Dragons
    {
      group: "honors",
      name: "dragons",
      values: ["red", "green", "white"],
      duplicates: 4,
    },
    // Bonus
    // Seasons
    {
      group: "bonus",
      name: "seasons",
      values: ["spring", "summer", "autumn", "winter"],
      duplicates: 1,
    },
    // Flowers
    {
      group: "bonus",
      name: "flowers",
      values: ["plum", "orchid", "chrysanthemum", "bamboo"],
      duplicates: 1,
    },
  ],
  info: {
    "dots-1": { matches: "self" },
    "dots-2": { matches: "self" },
    "dots-3": { matches: "self" },
    "dots-4": { matches: "self" },
    "dots-5": { matches: "self" },
    "dots-6": { matches: "self" },
    "dots-7": { matches: "self" },
    "dots-8": { matches: "self" },
    "dots-9": { matches: "self" },
    "bamboo-1": { matches: "self" },
    "bamboo-2": { matches: "self" },
    "bamboo-3": { matches: "self" },
    "bamboo-4": { matches: "self" },
    "bamboo-5": { matches: "self" },
    "bamboo-6": { matches: "self" },
    "bamboo-7": { matches: "self" },
    "bamboo-8": { matches: "self" },
    "bamboo-9": { matches: "self" },
    "characters-1": { matches: "self" },
    "characters-2": { matches: "self" },
    "characters-3": { matches: "self" },
    "characters-4": { matches: "self" },
    "characters-5": { matches: "self" },
    "characters-6": { matches: "self" },
    "characters-7": { matches: "self" },
    "characters-8": { matches: "self" },
    "characters-9": { matches: "self" },
    "honors-east": { matches: "self" },
    "honors-south": { matches: "self" },
    "honors-west": { matches: "self" },
    "honors-north": { matches: "self" },
    "honors-red": { matches: "self" },
    "honors-green": { matches: "self" },
    "honors-white": { matches: "self" },
    "bonus-spring": { matches: "bonus-plum" },
    "bonus-summer": { matches: "bonus-orchid" },
    "bonus-autumn": { matches: "bonus-chrysanthemum" },
    "bonus-winter": { matches: "bonus-bamboo" },
    "bonus-plum": { matches: "bonus-spring" },
    "bonus-orchid": { matches: "bonus-summer" },
    "bonus-chrysanthemum": { matches: "bonus-autumn" },
    "bonus-bamboo": { matches: "bonus-winter" },
  },
};

// Source: https://stackoverflow.com/a/26554873/1762224
function* range(start, stop, step = 1) {
  if (stop == null) {
    // one param defined
    stop = start;
    start = 0;
  }

  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    yield i;
  }
}

const shuffleArray = (array) => {
  const copy = structuredClone(array);
  shuffleArrayInPlace(copy);
  return copy;
};

const shuffleArrayInPlace = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

class MahjongEngine {
  #scale = 1.0;
  #tiles = [];
  #board = {};

  constructor(initialScale) {
    this.#scale = initialScale ?? 1.0;
    this.#tiles = this.#loadTiles();
  }

  #loadTiles() {
    const tmp = [];
    TILE_SCHEMA.suits.forEach(({ group, name, values, duplicates, suited }) => {
      [...range(duplicates)].forEach(() => {
        values.forEach((value) => {
          tmp.push({
            id: `${suited ? name : group}-${value}`,
            present: true,
          });
        });
      });
    });
    return tmp;
  }

  shuffle() {
    shuffleArrayInPlace(this.#tiles);
  }

  loadLayout(layout) {
    const layers = structuredClone(layout);
    let index = 0;
    for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
      const layer = layers[layerIndex];
      for (let rowIndex = 0; rowIndex < layer.length; rowIndex++) {
        const row = layer[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          if (row[colIndex] === 1) {
            row[colIndex] = index++;
          } else {
            row[colIndex] = null;
          }
        }
      }
    }
    this.#board = { layers };
  }

  getTileAtIndex(index) {
    return this.#tiles[index];
  }

  // Iterate over the layers backwards to get the top-most
  getTileAtPosition(rowIndex, colIndex) {
    const layers = this.#board.layers;
    for (let layerIndex = layers.length - 1; layerIndex >= 0; layerIndex--) {
      const index = layers[layerIndex][rowIndex][colIndex];
      if (index != null) {
        const tile = this.getTileAtIndex(index);
        if (tile.present) {
          return tile;
        }
      }
    }
    return null;
  }

  get tiles() {
    return this.#tiles;
  }
}

const loadLayout = async (layout) => {
  const response = await fetch(`./layouts/${layout}.json`);
  return response.json();
};

class MahjongRenderer {
  #engine = null;
  #context = null;

  constructor(engine) {
    this.#engine = engine;
  }

  setContext(context) {
    this.#context = context;
  }

  render() {
    const engine = this.#engine;
    const ctx = this.#context;
  }
}

(async () => {
  const ctx = document.querySelector("#mahjong").getContext("2d");
  const layout = await loadLayout("shanghai");
  const mahjongEngine = new MahjongEngine();
  const mahjongRenderer = new MahjongRenderer(mahjongEngine);
  const mahojongEventHandler = null; // new MahjongEventHandler(mahjongEngine)

  mahjongEngine.loadLayout(layout);
  mahjongEngine.shuffle();

  mahjongRenderer.setContext(ctx);

  console.log([...new Set(mahjongEngine.tiles.map(({ id }) => id))]);

  console.log(mahjongEngine.getTileAtIndex(1));
  console.log(mahjongEngine.getTileAtPosition(1, 5));

  mahjongRenderer.render();
})();
