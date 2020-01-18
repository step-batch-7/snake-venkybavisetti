const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = "grid";

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + "_" + rowId;

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const drawFood = function(food) {
  let [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.add(food.type);
};

const handleKeyPress = game => {
  const moves = {
    ArrowLeft: WEST,
    ArrowRight: EAST,
    ArrowUp: NORTH,
    ArrowDown: SOUTH
  };
  const givenState = game.runningState == "resume" ? "pause" : "resume";
  if (event.key === " ") game.updateRunningState(givenState);
  if (game.runningState == "resume") game.controlDirections(moves[event.key]);
};

const updateSnake = function(snake) {
  eraseTail(snake);
  drawSnake(snake);
};

const attachEventListeners = game => {
  document.body.onkeydown = handleKeyPress.bind(null, game);
};

const initSnake = () => {
  const snakePosition = [
    [40, 25],
    [41, 25],
    [42, 25]
  ];
  return new Snake(snakePosition, new Direction(EAST), "snake");
};

const initGhostSnake = () => {
  const ghostSnakePosition = [
    [40, 30],
    [41, 30],
    [42, 30]
  ];
  return new Snake(ghostSnakePosition, new Direction(EAST), "ghost");
};

const setup = game => {
  const { snake, ghostSnake } = game.status;
  attachEventListeners(game);
  createGrids();

  drawSnake(snake);
  drawSnake(ghostSnake);
};

const animateSnakes = (snake, ghostSnake) => {
  updateSnake(snake);
  updateSnake(ghostSnake);
};

const randomlyTurnSnake = snake => {
  let x = Math.random() * 100;
  if (x > 50) {
    snake.turnLeft();
  }
};

const eraseEatenFood = function(previousFood) {
  const [colId, rowId] = previousFood.position;
  const cell = getCell(colId, rowId);
  cell.classList.remove(previousFood.type);
};

const updateScoreCard = function(newScore) {
  const scoreCard = document.getElementById("scoreCard");
  scoreCard.innerText = newScore;
};

const runGame = function(game) {
  const interval = setInterval(() => {
    if (game.runningState == "pause") return;
    game.updateGame();
    const { snake, ghostSnake, food, previousFood, scoreCard } = game.status;
    if (game.isGameOver()) {
      clearInterval(interval);
      alert("game over");
      return;
    }
    animateSnakes(snake, ghostSnake);
    eraseEatenFood(previousFood);
    drawFood(food);
    updateScoreCard(scoreCard);
  }, 90);
};

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food([43, 30], "food");
  const gridSize = { NUM_OF_COLS, NUM_OF_ROWS };
  const scoreCard = new ScoreCard();

  const game = new Game(snake, ghostSnake, food, gridSize, scoreCard);
  setup(game);
  runGame(game);
  setInterval(randomlyTurnSnake, 90, ghostSnake);
};
