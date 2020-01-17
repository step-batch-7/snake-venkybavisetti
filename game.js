class Game {
  #snake;
  #ghostSnake;
  #food;
  #gridSize;
  #scoreCard;
  #previousFood;

  constructor(snake, ghostSnake, food, gridSize, scoreCard) {
    this.#snake = snake;
    this.#ghostSnake = ghostSnake;
    this.#food = food;
    this.#gridSize = gridSize;
    this.#scoreCard = scoreCard;
    this.#previousFood = { position: [0, 0], type: "snake" };
  }

  get status() {
    const game = {};
    game.snake = this.#snake.status;
    game.ghostSnake = this.#ghostSnake.status;
    game.food = this.#food.status;
    game.scoreCard = this.#scoreCard.status;
    game.previousFood = this.#previousFood;
    return game;
  }

  generateFood() {
    const foodX = Math.floor(Math.random() * NUM_OF_COLS);
    const foodY = Math.floor(Math.random() * NUM_OF_ROWS);
    const typeDecide = Math.ceil(Math.random() * 2);
    const type = typeDecide == 1 ? "food" : "specialFood";
    this.#food = new Food([foodX, foodY], type);
  }

  updateGame() {
    const snakeEatenFood = this.#snake.headAtPoint(this.#food.position);
    const ghostEatenFood = this.#ghostSnake.headAtPoint(this.#food.position);

    if (snakeEatenFood) {
      this.#snake.grow(this.#food.type);
      this.#previousFood = this.#food.status;
      this.#scoreCard.update(this.#food.point);
      this.generateFood();
    }
    if (ghostEatenFood) {
      this.#previousFood = this.#food.status;
      this.generateFood();
    }

    this.#snake.move();
    this.#ghostSnake.move();
  }

  isGameOver() {
    const ghostSnakeLocation = this.#ghostSnake.location;
    const snakeLocation = this.#snake.location;

    const snakeEngaged = ghostSnakeLocation.some(point =>
      this.#snake.headAtPoint(point)
    );
    const ghostSnakeEngaged = snakeLocation.some(point =>
      this.#ghostSnake.headAtPoint(point)
    );
    const areSnakesEngaged = snakeEngaged || ghostSnakeEngaged;

    return (
      this.#snake.headTouchesBox(this.#gridSize) ||
      this.#snake.headTouchesBody() ||
      areSnakesEngaged
    );
  }

  turnSnakeToLeft() {
    this.#snake.turnLeft();
  }
}
