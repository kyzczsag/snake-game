const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

let grid = 16;
let count = 0;

let snake = {
    x: 160,
    y: 160,
    dx: grid, // kierunek poziomy
    dy: 0,    // kierunek pionowy
    cells: [], // segmenty węża
    maxCells: 4 // początkowa długość
};

let apple = {
    x: 320,
    y: 320
};

// Funkcja losująca liczby całkowite
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Główna pętla gry
function loop() {
    requestAnimationFrame(loop);

    if (++count < 4) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Poruszanie się węża
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Przejście przez krawędzie ekranu
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // Zapisywanie pozycji węża
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // Usuwanie nadmiarowych segmentów
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Rysowanie jabłka
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Rysowanie węża
    context.fillStyle = 'lime';
    snake.cells.forEach(function (cell, index) {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // Sprawdzenie czy wąż zjadł jabłko
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }

        // Sprawdzenie kolizji z samym sobą
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                // Restart gry
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;

                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
        }
    });
}

// Obsługa klawiatury
document.addEventListener('keydown', function (e) {
    // Lewo
    if (e.keyCode === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    // Góra
    else if (e.keyCode === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // Prawo
    else if (e.keyCode === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // Dół
    else if (e.keyCode === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// Uruchomienie pętli gry
requestAnimationFrame(loop);
