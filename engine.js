const TILE_SCHEMA = {
  groups: [
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
    "dots-1": { key: "d1", matches: "self" },
    "dots-2": { key: "d2", matches: "self" },
    "dots-3": { key: "d3", matches: "self" },
    "dots-4": { key: "d4", matches: "self" },
    "dots-5": { key: "d5", matches: "self" },
    "dots-6": { key: "d6", matches: "self" },
    "dots-7": { key: "d7", matches: "self" },
    "dots-8": { key: "d8", matches: "self" },
    "dots-9": { key: "d9", matches: "self" },
    "bamboo-1": { key: "b1", matches: "self" },
    "bamboo-2": { key: "b2", matches: "self" },
    "bamboo-3": { key: "b3", matches: "self" },
    "bamboo-4": { key: "b4", matches: "self" },
    "bamboo-5": { key: "b5", matches: "self" },
    "bamboo-6": { key: "b6", matches: "self" },
    "bamboo-7": { key: "b7", matches: "self" },
    "bamboo-8": { key: "b8", matches: "self" },
    "bamboo-9": { key: "b9", matches: "self" },
    "characters-1": { key: "c1", matches: "self" },
    "characters-2": { key: "c2", matches: "self" },
    "characters-3": { key: "c3", matches: "self" },
    "characters-4": { key: "c4", matches: "self" },
    "characters-5": { key: "c5", matches: "self" },
    "characters-6": { key: "c6", matches: "self" },
    "characters-7": { key: "c7", matches: "self" },
    "characters-8": { key: "c8", matches: "self" },
    "characters-9": { key: "c9", matches: "self" },
    "honors-east": { key: "a4", matches: "self" },
    "honors-south": { key: "a7", matches: "self" },
    "honors-west": { key: "a5", matches: "self" },
    "honors-north": { key: "a6", matches: "self" },
    "honors-red": { key: "a1", matches: "self" },
    "honors-green": { key: "a3", matches: "self" },
    "honors-white": { key: "a2", matches: "self" },
    "bonus-spring": { key: "e1", matches: "bonus-plum" },
    "bonus-summer": { key: "e2", matches: "bonus-orchid" },
    "bonus-autumn": { key: "e3", matches: "bonus-chrysanthemum" },
    "bonus-winter": { key: "e4", matches: "bonus-bamboo" },
    "bonus-plum": { key: "f4", matches: "bonus-spring" },
    "bonus-orchid": { key: "f4", matches: "bonus-summer" },
    "bonus-chrysanthemum": { key: "f4", matches: "bonus-autumn" },
    "bonus-bamboo": { key: "f4", matches: "bonus-winter" },
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
  #selectedCell = null;
  #selectedTile = null;
  #points = [];

  constructor(initialScale) {
    this.#scale = initialScale ?? 1.0;
    this.#tiles = this.#loadTiles();
  }

  #loadTiles() {
    const tmp = [];
    TILE_SCHEMA.groups.forEach(
      ({ group, name, values, duplicates, suited }) => {
        [...range(duplicates)].forEach(() => {
          values.forEach((value) => {
            const id = `${suited ? name : group}-${value}`;
            tmp.push({
              id,
              image: TILE_SCHEMA.info[id].key,
              present: true,
            });
          });
        });
      }
    );
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

  metrics() {
    const data = this.#board.layers;
    return {
      layerCount: data.length,
      maxRows: Math.max(...data.map((layer) => layer.length)),
      maxCols: Math.max(
        ...data.flatMap((layer) => layer.map((row) => row.length))
      ),
    };
  }

  getClosest(rowIndex, colIndex) {
    for (let rowOff = rowIndex - 1; rowOff <= rowIndex + 1; rowOff++) {
      for (let colOff = colIndex - 1; colOff <= colIndex + 1; colOff++) {
        const closest = this.getTop(rowOff, colOff);
        if (closest) {
          return closest;
        }
      }
    }
    return null;
  }

  getTop(rowIndex, colIndex) {
    const { maxRows, maxCols } = this.metrics();
    if (rowIndex < 0 || rowIndex > maxRows - 1) return null;
    if (colIndex < 0 || colIndex > maxCols - 1) return null;
    const data = this.#board.layers;
    // Loop over layers top-down
    for (let layerIndex = data.length - 1; layerIndex >= 0; layerIndex--) {
      const index = data[layerIndex][rowIndex][colIndex];
      if (index != null) {
        const tile = this.getTileAtIndex(index);
        if (tile && tile.present) {
          return tile;
        }
      }
    }
    return null;
  }

  getTile(layerIndex, rowIndex, colIndex) {
    const { layerCount, maxRows, maxCols } = this.metrics();
    if (layerIndex < 0 || layerIndex > layerCount - 1) return null;
    if (rowIndex < 0 || rowIndex > maxRows - 1) return null;
    if (colIndex < 0 || colIndex > maxCols - 1) return null;

    const tileIndex = this.#board.layers[layerIndex][rowIndex][colIndex];

    return this.getTileAtIndex(tileIndex);
  }

  getNeigbors(layerIndex, rowIndex, colIndex) {
    const west = this.getTile(layerIndex, rowIndex, colIndex - 2);
    const east = this.getTile(layerIndex, rowIndex, colIndex + 2);
    const south = this.getTile(layerIndex, rowIndex + 2, colIndex);
    const north = this.getTile(layerIndex, rowIndex - 2, colIndex);

    console.log({ west, east, south, north });

    return { west, east, south, north };
  }

  getSelectedCell() {
    return this.#selectedCell;
  }

  setSelectedCell({ rowIndex, colIndex }) {
    // const tile = getTileAtPosition(rowIndex, colIndex);
    this.#selectedCell = { rowIndex, colIndex };
  }

  getSelectedTile() {
    return this.#selectedTile;
  }

  setSelectedTile(tile) {
    this.#selectedTile = tile;
  }

  getPoints() {
    return this.#points;
  }

  addPoint({ x, y }) {
    this.#points.push({ x, y });
  }

  get tiles() {
    return this.#tiles;
  }

  get board() {
    return this.#board;
  }
}

const loadLayout = async (layout) => {
  const response = await fetch(`./layouts/${layout}.json`);
  return response.json();
};

class MahjongCanvasShader {
  #engine = null;
  #context = null;
  #imageMap = new Map();

  constructor(engine, context) {
    this.#engine = engine;
    this.#context = context;
  }

  getEngine() {
    return this.#engine;
  }

  setEngine(engine) {
    this.#engine = engine;
  }

  getContext() {
    return this.#context;
  }

  setContext(context) {
    this.#context = context;
  }

  getImageMap() {
    return this.#imageMap;
  }

  setImageMap(imageMap) {
    this.#imageMap = imageMap;
  }

  drawTile(data, layerIndex, x, y, width, height, scale) {
    const ctx = this.getContext();

    const offsetX = layerIndex * -scale;
    const offsetY = layerIndex * -scale;

    const { image } = data;
    const img = this.getImageMap().get(image);

    const left = x + offsetX;
    const top = y + offsetY;

    ctx.fillStyle = "#422";
    ctx.fillRect(left, top, width + scale, height + scale);

    ctx.drawImage(img, left, top, width, height);

    ctx.strokeStyle = "#642";
    ctx.lineWidth = 1;
    ctx.strokeRect(left, top, width, height);
  }

  drawHighlight(layerIndex, x, y, width, height, scale) {
    const ctx = this.getContext();

    const offsetX = layerIndex * -scale;
    const offsetY = layerIndex * -scale;

    const left = x + offsetX;
    const top = y + offsetY;

    ctx.fillStyle = "hsla(120, 100%, 50%, 0.25)";
    ctx.fillRect(left, top, width, height);

    ctx.strokeStyle = "hsla(120, 100%, 50%, 1.0)";
    ctx.strokeRect(left, top, width, height);
  }
}

class MahjongCanvasRenderer {
  #engine = null;
  #shader = null;
  #scale = 1.0;
  #offsetX = 50;
  #offsetY = 50;

  constructor(engine) {
    this.#engine = engine;
  }

  setShader(shader) {
    this.#shader = shader;
  }

  setScale(scale) {
    this.#scale = scale;
  }

  getOffsetX() {
    return this.#offsetX;
  }

  getOffsetY() {
    return this.#offsetY;
  }

  // See render
  getTileWidth() {
    return this.#scale * 3 * 2;
  }

  // See render
  getTileHeight() {
    return this.#scale * 4 * 2;
  }

  render() {
    const engine = this.#engine;
    const data = engine.board.layers;
    const ctx = this.#shader.getContext();

    const { layerCount, maxCols, maxRows } = engine.metrics();
    const selected = engine.getSelectedCell();
    const selectedTile = engine.getSelectedTile();

    const points = engine.getPoints();
    const pointRadius = 4;

    const scale = this.#scale;
    const offsetX = this.getOffsetX();
    const offsetY = this.getOffsetY();

    const scaleX = scale * 3;
    const scaleY = scale * 4;

    const tileWidth = scaleX * 2;
    const tileHeight = scaleY * 2;

    const layerHeight = maxRows * scaleY;
    const layerWidth = maxCols * scaleX;

    ctx.canvas.width = layerWidth + offsetX * 2;
    ctx.canvas.height = layerHeight + offsetY * 2;

    ctx.fillStyle = "#AAA";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let layerIndex = 0; layerIndex < data.length; layerIndex++) {
      const rows = data[layerIndex];

      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const cols = rows[rowIndex];
        for (let colIndex = 0; colIndex < cols.length; colIndex++) {
          const top = offsetY + rowIndex * scaleY;
          const left = offsetX + colIndex * scaleX;

          const originX = left + scaleX / 2;
          const originY = top + scaleY / 2;

          const x = Math.floor(originX - tileWidth / 2) + 0.5;
          const y = Math.floor(originY - tileHeight / 2) + 0.5;

          const tileIndex = cols[colIndex];

          if (tileIndex != null) {
            const currentTile = this.#engine.getTileAtIndex(tileIndex);

            const getNeighbors = this.#engine.getNeigbors(
              layerIndex,
              rowIndex,
              colIndex
            );

            this.#shader.drawTile(
              currentTile,
              layerIndex,
              x,
              y,
              tileWidth,
              tileHeight,
              scale
            );

            if (currentTile === selectedTile) {
              this.#shader.drawHighlight(
                layerIndex,
                x,
                y,
                tileWidth,
                tileHeight,
                scale
              );
            }
          }
        }
      }
    }

    // Grid lines
    if (false) {
      ctx.strokeStyle = "hsla(0, 0%, 0%, 0.5)";
      const rows = data[0];
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const cols = rows[rowIndex];
        for (let colIndex = 0; colIndex < cols.length; colIndex++) {
          const top = offsetY + rowIndex * scaleY;
          const left = offsetX + colIndex * scaleX;

          const originX = left + scaleX / 2;
          const originY = top + scaleY / 2;

          const x = Math.floor(originX - tileWidth / 2) + 0.5;
          const y = Math.floor(originY - tileHeight / 2) + 0.5;

          ctx.strokeRect(x, y, tileWidth, tileHeight);
        }
      }
    }

    // Highlight... if on top...
    if (false && selected) {
      const top = offsetY + selected.rowIndex * scaleY;
      const left = offsetX + selected.colIndex * scaleX;

      const originX = left + scaleX / 2;
      const originY = top + scaleY / 2;

      const x = Math.floor(originX - tileWidth / 2) + 0.5;
      const y = Math.floor(originY - tileHeight / 2) + 0.5;

      ctx.fillStyle = "hsla(0, 100%, 50%, 0.25)";
      ctx.fillRect(x, y, tileWidth, tileHeight);

      ctx.strokeStyle = "hsla(0, 100%, 50%, 1.0)";
      ctx.strokeRect(x, y, tileWidth, tileHeight);
    }

    // Dots
    if (false) {
      ctx.strokeStyle = "#F00";
      points.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x, y, pointRadius, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
  }
}

const localClickPoint = (e) => {
  const rect = e.target.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

const globalClickPoint = (e) => {
  return {
    x: e.clientX,
    y: e.clientY,
  };
};

class MahjongCanvasEventHandler {
  #engine = null;
  #renderer = null;
  #canvas = null;

  constructor(engine, renderer, canvas) {
    this.#engine = engine;
    this.#renderer = renderer;
    this.#canvas = canvas;

    this.#canvas.addEventListener("click", this.handleClick.bind(this));
  }

  inBounds(point) {}

  handleClick(e) {
    const { layerCount, maxCols, maxRows } = this.#engine.metrics();
    const rect = e.target.getBoundingClientRect();
    const point = localClickPoint(e);

    const offsetX = this.#renderer.getOffsetX();
    const offsetY = this.#renderer.getOffsetY();

    const tileWidth = this.#renderer.getTileWidth();
    const tileHeight = this.#renderer.getTileHeight();

    const x = point.x;
    const y = point.y;

    this.#engine.addPoint({ x, y });

    const top = y - offsetY - tileHeight / 4;
    const left = x - offsetX - tileWidth / 4;

    const percentX = left / (rect.width - offsetX * 2);
    const percentY = top / (rect.height - offsetY * 2);

    const rowIndex = Math.round(percentY * maxRows);
    const colIndex = Math.round(percentX * maxCols);

    const closestTile = this.#engine.getClosest(rowIndex, colIndex);

    console.log(closestTile);

    this.#engine.setSelectedCell({ rowIndex, colIndex });
    this.#engine.setSelectedTile(closestTile);
    this.#renderer.render();
  }

  destroy() {
    this.#canvas.removeEventListener("click", this.handleClick);
  }
}

const imageDict = { a: 7, b: 9, c: 9, d: 9, e: 4, f: 4 };

const dictToKeys = (dict) =>
  Object.entries(dict).flatMap(([group, count]) =>
    [...range(1, count + 1)].map((i) => `${group}${i}`)
  );

const keysToPaths = (keys, tileset = "shiny") =>
  keys.map((key) => ({
    key,
    path: `./mahjong_support/tiles_${tileset}/${key}.gif`,
  }));

const imagePaths = keysToPaths(dictToKeys(imageDict));

const loadImage = async (path) =>
  new Promise((resolve) => {
    const image = new Image();
    image.src = path;
    image.onload = function () {
      resolve(image);
    };
  });

const loadImageMap = async (...paths) => {
  const imageMap = new Map();
  for (let { key, path } of paths) {
    const image = await loadImage(path);
    imageMap.set(key, image);
  }
  return imageMap;
};

(async () => {
  const ctx = document.querySelector("#mahjong").getContext("2d");
  const layout = await loadLayout("shanghai");
  const imageMap = await loadImageMap(...imagePaths);
  const mahjongEngine = new MahjongEngine();
  const mahjongRenderer = new MahjongCanvasRenderer(mahjongEngine);
  const mahjongShader = new MahjongCanvasShader(mahjongEngine, ctx);
  const mahojongEventHandler = new MahjongCanvasEventHandler(
    mahjongEngine,
    mahjongRenderer,
    ctx.canvas
  );

  mahjongEngine.loadLayout(layout);
  mahjongEngine.shuffle();

  mahjongShader.setImageMap(imageMap);

  mahjongRenderer.setScale(4.0);
  mahjongRenderer.setShader(mahjongShader);

  //console.log([...new Set(mahjongEngine.tiles.map(({ id }) => id))]);
  //console.log(mahjongEngine.getTileAtIndex(1));
  //console.log(mahjongEngine.getTileAtPosition(1, 5));

  mahjongRenderer.render();
})();
