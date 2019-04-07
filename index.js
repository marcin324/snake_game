const buttonPlay = document.querySelector('.play');
const buttonPause = document.querySelector('.pause');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const buttonClose = document.querySelector('.close');

const scoreElement = document.querySelector('.score')

const body = document.querySelector('body')
const canvasElement = document.createElement('canvas')
canvasElement.setAttribute('id', 'game')
body.append(canvasElement)

// Get canvas and set it's width and height
const canvas = document.getElementById('game')
canvas.setAttribute('width', '300px')
canvas.setAttribute('height', '300px')

// Get canvas context by method getContext()
const context = canvas.getContext('2d')
// context.fillStyle = '#999'
// context.fillRect(0, 0, 300, 300)

// Główna funkcja gry; uruchamiana kliknięciem w przycisk 'play'
const playeSnakeGame = () => {

  // // wspłrz. x, wspłrz, y, szer., wys.

  // zmienianie kierunku węża przez klawisze
  document.addEventListener('keydown', changeDirection);
  clearCanvas();
  // context.fillStyle = '#999'
  // context.fillRect(0, 0, 300, 300)

  // obiekt head, w którym zapisane są współrzędne x i y
  const head = {
    x: 40,
    y: 100
  }

  // tablica snakes, w której przechowujemy początkową długość węża
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
  ]

  // zmienne przechowujące wektor przemieszczania się węża po uruchomieniu gry
  let dx = 10
  let dy = 0

  // zmienne, w których będą przechowywane współrzędne jabłka
  let foodX;
  let foodY;

  // zmienna przechowująca punktację
  let score = 0;

  let active = false;

  // wywołanie funkcj tworzącej jabłko - pierwsze stworzenie jabłka
  createApple();

  // funkcja rysująca początkowego węża: kolor wypełnienia, kolor obramowania, metoda forEach, która iteruje każdą komórkę węża i ustala jej pozycję i wymiary
  const drawSnake = () => {
    context.fillStyle = 'darkgreen'
    context.strokeStyle = "#000"

    snakes.forEach(snake => {
      context.fillRect(snake.x, snake.y, 10, 10)
      context.strokeRect(snake.x, snake.y, 10, 10)
    })
  }

  const drawHead = () => {
    const isMovingRight = dx === 10;
    const isMovingLeft = dx === -10;
    const isMovingDown = dy === 10;
    const isMovingUp = dy === -10;

    context.fillStyle = 'black'
    context.strokeStyle = 'white'

    context.fillRect(snakes[0].x, snakes[0].y, 10, 10)
    if (isMovingRight) {
      context.strokeRect(snakes[0].x + 2, snakes[0].y + 2, 1, 1)
      context.strokeRect(snakes[0].x + 2, snakes[0].y + 7, 1, 1)
      context.strokeRect(snakes[0].x + 7, snakes[0].y + 5, 6, 1)
    } else if (isMovingLeft) {
      context.strokeRect(snakes[0].x + 7, snakes[0].y + 2, 1, 1)
      context.strokeRect(snakes[0].x + 7, snakes[0].y + 7, 1, 1)
      context.strokeRect(snakes[0].x - 3, snakes[0].y + 5, 6, 1)
    } else if (isMovingDown) {
      context.strokeRect(snakes[0].x + 2, snakes[0].y + 2, 1, 1)
      context.strokeRect(snakes[0].x + 7, snakes[0].y + 2, 1, 1)
      context.strokeRect(snakes[0].x + 5, snakes[0].y + 7, 1, 6)
    } else if (isMovingUp) {
      context.strokeRect(snakes[0].x + 2, snakes[0].y + 7, 1, 1)
      context.strokeRect(snakes[0].x + 7, snakes[0].y + 7, 1, 1)
      context.strokeRect(snakes[0].x + 5, snakes[0].y - 3, 1, 6)
    }
  }

  // funkcja poruszająca wężem: zmienna head przechowuje pierwszy element węża (głowę), ustalamy nową głowę, która jest przesunięta o dx (10) względem osi x i o dy (0) względem osi y
  const moveSnake = () => {
    const head = snakes[0]
    const newHead = {
      x: head.x + dx,
      y: head.y + dy
    }

    // warunek sprawdzający czy zmienne foodX i foodY (współrzędne jabłka) są różne od pozycji nowej głowy węża (wąż nie styka się głową z jabłkiem) - jeżeli tak, to usuwamy ostatni element węża; jeżeli nie to: zwiększamy punktację o 10 i wyświetlamy ją, tworzymy nowe jabłko
    if (foodX !== newHead.x || foodY !== newHead.y) {
      snakes.pop()
    } else {
      score += 10;
      scoreElement.textContent = `Wynik: ${score}`;
      createApple();
    }

    // na początku węża dodajemy jego nową głowę
    snakes.unshift(newHead);

  }

  // funkcja czyszcząca canvasa: ustawiany kolor tła i jego wymiary - nie ma już węża i jabłka
  function clearCanvas() {
    context.fillStyle = '#999'
    context.fillRect(0, 0, 300, 300)
  }

  // funkcja tick: jeżeli funkcja checkIfSnakeTouchesWall() jest spełniona, to funkcja zatrzymuje się (koniec gry), jeżeli nie to - czyszczenie canvasa, rysowanie węża, rysowanie jabłka i poruszanie wężem
  function tick() {
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
  }

  // funkcja pozwalająca sterować wężem za pomocą strzałek na klawiaturze
  function changeDirection(event) {
    const key = event.keyCode;
    const LEFT_KEY = 37
    const RIGHT_KEY = 39
    const UP_KEY = 38
    const DOWN_KEY = 40

    const isMovingRight = dx === 10;
    const isMovingLeft = dx === -10;
    const isMovingDown = dy === 10;
    const isMovingUp = dy === -10;

    if (key === LEFT_KEY && !isMovingRight) {
      dy = 0
      dx = -10
    } else if (key === RIGHT_KEY && !isMovingLeft) {
      dy = 0
      dx = 10
    } else if (key === UP_KEY && !isMovingDown) {
      dy = -10
      dx = 0
    } else if (key === DOWN_KEY && !isMovingUp) {
      dy = 10
      dx = 0
    }
  }

  // funkcja losująca liczbę z wybranego zakresu
  function randomNumber(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10
  }

  // funkcja tworząca jabłko: losujemy dwie liczby z wybranego zakresu i zapisujemy je w zmiennych foodX i foodY, iterujemy węża i po spełnieniu zadanego warunku (kiedy wąż zetknie się z jabłkiem) tworzymy jabłko
  function createApple() {
    foodX = randomNumber(10, 290)
    foodY = randomNumber(10, 290)

    // snakes.forEach(snake => {
    //   if (snake.x === foodX && snake.y === foodY) {
    //     createApple();
    //   }
    // })
  }

  // funkcja rysująca jabłko: wypełnienie czerwone i obramowanie czarne, ustalamy pozycję jabłka - jako współrzędne x i y podajemy zmienne foodX i foodY
  function drawApple() {
    context.fillStyle = 'red'
    context.strokeStyle = '#000'

    context.fillRect(foodX, foodY, 10, 10)
    context.strokeRect(foodX, foodY, 10, 10)
  }

  // funkcja sprawdzająca, czy wąż wychodzi poza pole canvasa: funkcję tą umieszczamy potem w funkcji tick
  function checkIfSnakeTouchesWall() {
    const head = snakes[0];

    const isHeadTouchingUpperWall = head.y < 0
    const isHeadTouchingBottomWall = head.y >= 300
    const isHeadTouchingLeftWall = head.x < 0
    const isHeadTouchingRightWall = head.x >= 300

    if (isHeadTouchingBottomWall || isHeadTouchingUpperWall || isHeadTouchingLeftWall || isHeadTouchingRightWall) {

      overlay.classList.add('show');
      modal.classList.add('show');
      return true
    } else {
      return false
    }
  }

  // function checkIfSnakeTouchesItself() {
  //   const head = snakes[0];
  //   // const lastPartOfSnake = snakes[snakes.length - 1];

  //   snakes.forEach(snake => {
  //     if ((snake.x === head.x && snake.y === head.y) && (snake !== head)) {
  //       console.log(`${snake.x} ${head.x} ${snake.y} ${head.y}`);
  //       clearInterval(indexSnake);
  //       // return true
  //     } else {
  //       return false
  //     }
  //   })
  // }

  function checkIfSnakeTouchesItself() {
    const head = snakes[0];
    const tail = snakes[snakes.length - 1];
    const tailIsMovingDown = dy === 10;
    const tailIsMovingUp = dy === -10
    const tailIsMovingRight = dx === 10;
    const tailIsMovingLeft = dx === -10;

    snakes.forEach(snake => {
      if (((snake.x === head.x && snake.y === head.y) || (head.x === tail.x + 10 && head.y === tail.y && tailIsMovingLeft) || (head.x === tail.x - 10 && head.y === tail.y && tailIsMovingRight) || (head.y === tail.y + 10 && head.x === tail.x && tailIsMovingUp) || (head.y === tail.y - 10 && head.x === tail.x && tailIsMovingDown)) && (snake !== head)) {
        // console.log(`${snake.x} ${head.x} ${snake.y} ${head.y}`);
        clearInterval(indexSnake);

        overlay.classList.add('show');
        modal.classList.add('show');
        // return true
      } else {
        return false
      }
    })
  }

  function pauseSnake() {
    if (!active) {
      active = !active;
      buttonPause.textContent = `Continue`;
      clearInterval(indexSnake)
    } else {
      active = !active;
      buttonPause.textContent = `Pause`;
      indexSnake = setInterval(tick, 200);
    }
  }

  function hideModal() {
    overlay.classList.remove('show');
    clearCanvas();
    snakes = [];
    score = 0;
    scoreElement.textContent = `Wynik: ${score}`;
  };

  buttonClose.addEventListener('click', hideModal);
  overlay.addEventListener('click', hideModal);
  modal.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  buttonPause.addEventListener('click', pauseSnake);

  // funkcja ustalająca prędkość węża
  let indexSnake = setInterval(tick, 200);
};

buttonPlay.addEventListener('click', playeSnakeGame);




// function checkIfSnakeTouchesItself() {
//   const head = snakes[0];
//   const lastPartOfSnake = snakes[snakes.length - 1];

//   snakes.forEach(snake => {
//     if (((snake.x === head.x && snake.y === head.y) || (head.x === lastPartOfSnake.x + 10 && head.y === lastPartOfSnake.y) || (head.x === lastPartOfSnake.x - 10 && head.y === lastPartOfSnake.y) || (head.y === lastPartOfSnake.y + 10 && head.x === lastPartOfSnake.x) || (head.y === lastPartOfSnake.y - 10 && head.x === lastPartOfSnake.x)) && (snake !== head)) {
//       console.log(`${snake.x} ${head.x} ${snake.y} ${head.y}`);
//       clearInterval(indexSnake);
//       // return true
//     } else {
//       return false
//     }
//   })
// }