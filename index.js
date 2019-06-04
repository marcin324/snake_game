const buttonPlay = document.querySelector('.play');
const buttonPause = document.querySelector('.pause');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const buttonClose = document.querySelector('.close');

const scoreElement = document.querySelector('.score');

const body = document.querySelector('body');
const canvasElement = document.createElement('canvas');
canvasElement.setAttribute('id', 'game');
body.append(canvasElement);

// Get canvas and set it's width and height
const canvas = document.getElementById('game');
canvas.setAttribute('width', '300px');
canvas.setAttribute('height', '300px');

// Get canvas context by method getContext()
const context = canvas.getContext('2d');

const playeSnakeGame = () => {

  document.addEventListener('keydown', changeDirection);
  clearCanvas();

  const head = {
    x: 40,
    y: 100
  };

  let snakes = [
    head,
    {
      x: 30,
      y: 100
    },
    {
      x: 20,
      y: 100
    },
    {
      x: 10,
      y: 100
    }
  ];

  let dx = 10;
  let dy = 0;

  let foodX;
  let foodY;

  let score = 0;

  let active = false;

  createApple();

  const drawSnake = () => {
    context.fillStyle = 'darkgreen';
    context.strokeStyle = "#000";

    snakes.forEach(snake => {
      context.fillRect(snake.x, snake.y, 10, 10);
      context.strokeRect(snake.x, snake.y, 10, 10);
    })
  };

  const drawHead = () => {
    const isMovingRight = dx === 10;
    const isMovingLeft = dx === -10;
    const isMovingDown = dy === 10;
    const isMovingUp = dy === -10;

    context.fillStyle = 'black';
    context.strokeStyle = 'white';

    context.fillRect(snakes[0].x, snakes[0].y, 10, 10)
    if (isMovingRight) {
      context.strokeRect(snakes[0].x + 2, snakes[0].y + 2, 1, 1);
      context.strokeRect(snakes[0].x + 2, snakes[0].y + 7, 1, 1);
      context.strokeRect(snakes[0].x + 7, snakes[0].y + 5, 6, 1);
    } else if (isMovingLeft) {
      context.strokeRect(snakes[0].x + 7, snakes[0].y + 2, 1, 1);
      context.strokeRect(snakes[0].x + 7, snakes[0].y + 7, 1, 1);
      context.strokeRect(snakes[0].x - 3, snakes[0].y + 5, 6, 1);
    } else if (isMovingDown) {
      context.strokeRect(snakes[0].x + 2, snakes[0].y + 2, 1, 1);
      context.strokeRect(snakes[0].x + 7, snakes[0].y + 2, 1, 1);
      context.strokeRect(snakes[0].x + 5, snakes[0].y + 7, 1, 6);
    } else if (isMovingUp) {
      context.strokeRect(snakes[0].x + 2, snakes[0].y + 7, 1, 1);
      context.strokeRect(snakes[0].x + 7, snakes[0].y + 7, 1, 1);
      context.strokeRect(snakes[0].x + 5, snakes[0].y - 3, 1, 6);
    }
  };

  const moveSnake = () => {
    const head = snakes[0];
    const newHead = {
      x: head.x + dx,
      y: head.y + dy
    };

    if (foodX !== newHead.x || foodY !== newHead.y) {
      snakes.pop();
    } else {
      score += 10;
      scoreElement.textContent = `Wynik: ${score}`;
      createApple();
    }

    snakes.unshift(newHead);
  };

  function clearCanvas() {
    context.fillStyle = '#999';
    context.fillRect(0, 0, 300, 300);
  };

  const tick = () => {
    if (checkIfSnakeTouchesWall()) {
      return
    } else if (checkIfSnakeTouchesItself()) {
      return
    } else {
      clearCanvas();
      drawSnake();
      drawHead();
      drawApple();
      moveSnake();
    }
  };

  function changeDirection(event) {
    const key = event.keyCode;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const isMovingRight = dx === 10;
    const isMovingLeft = dx === -10;
    const isMovingDown = dy === 10;
    const isMovingUp = dy === -10;

    if (key === LEFT_KEY && !isMovingRight) {
      dy = 0;
      dx = -10;
    } else if (key === RIGHT_KEY && !isMovingLeft) {
      dy = 0;
      dx = 10;
    } else if (key === UP_KEY && !isMovingDown) {
      dy = -10;
      dx = 0;
    } else if (key === DOWN_KEY && !isMovingUp) {
      dy = 10;
      dx = 0;
    }
  };

  function randomNumber(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10
  };

  function createApple() {
    foodX = randomNumber(10, 290);
    foodY = randomNumber(10, 290);
  };

  function drawApple() {
    context.fillStyle = 'red';
    context.strokeStyle = '#000';

    context.fillRect(foodX, foodY, 10, 10);
    context.strokeRect(foodX, foodY, 10, 10);
  };

  function checkIfSnakeTouchesWall() {
    const head = snakes[0];

    const isHeadTouchingUpperWall = head.y < 0;
    const isHeadTouchingBottomWall = head.y >= 300;
    const isHeadTouchingLeftWall = head.x < 0;
    const isHeadTouchingRightWall = head.x >= 300;

    if (isHeadTouchingBottomWall || isHeadTouchingUpperWall || isHeadTouchingLeftWall || isHeadTouchingRightWall) {

      overlay.classList.add('show');
      modal.classList.add('show');
      return true;
    } else {
      return false;
    }
  };

  function checkIfSnakeTouchesItself() {
    const head = snakes[0];
    const tail = snakes[snakes.length - 1];
    const tailIsMovingDown = dy === 10;
    const tailIsMovingUp = dy === -10
    const tailIsMovingRight = dx === 10;
    const tailIsMovingLeft = dx === -10;

    snakes.forEach(snake => {
      if (((snake.x === head.x && snake.y === head.y) || (head.x === tail.x + 10 && head.y === tail.y && tailIsMovingLeft) || (head.x === tail.x - 10 && head.y === tail.y && tailIsMovingRight) || (head.y === tail.y + 10 && head.x === tail.x && tailIsMovingUp) || (head.y === tail.y - 10 && head.x === tail.x && tailIsMovingDown)) && (snake !== head)) {
        clearInterval(indexSnake);

        overlay.classList.add('show');
        modal.classList.add('show');
      } else {
        return false;
      }
    })
  };

  const pauseSnake = () => {
    if (!active) {
      active = !active;
      buttonPause.textContent = `Continue`;
      clearInterval(indexSnake);
    } else {
      active = !active;
      buttonPause.textContent = `Pause`;
      indexSnake = setInterval(tick, 200);
    }
  };

  const hideModal = () => {
    overlay.classList.remove('show');
    clearCanvas();
    snakes = [];
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
  };

  buttonClose.addEventListener('click', hideModal);
  overlay.addEventListener('click', hideModal);
  modal.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  buttonPause.addEventListener('click', pauseSnake);

  let indexSnake = setInterval(tick, 200);
};

buttonPlay.addEventListener('click', playeSnakeGame);
