const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const grid = 16;
let count = 0;
let score = 0;

let snake = {
    x: 160,
    y: 160,
    dx: grid, // kierunek poziomy
    dy: 0,    // kierunek pionowy
    cells: [], // segmenty węża
    maxCells: 4 // początkowa długość
};

let apple = {
    x: getRandomInt(0, canvas.width / grid) * grid,
    y: getRandomInt(0, canvas.height / grid) * grid
};

// Ładowanie dźwięków
const eatSound = new Audio('eat.mp3');
const dieSound = new Audio('die.mp3');

// Funkcja losująca liczby całkowite
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Funkcja resetująca grę
function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    score = 0;
    document.getElementById('score').innerHTML = 'Wynik: ' + score;
    apple.x = getRandomInt(0, canvas.width / grid) * grid;
    apple.y = getRandomInt(0, canvas.height / grid) * grid;
    document.getElementById('message').innerHTML = '';
    document.getElementById('restartButton').style.display = 'none';
    requestAnimationFrame(loop);
}

// Główna pętla gry
function loop() {
    requestId = requestAnimationFrame(loop);

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
            score++;
            document.getElementById('score').innerHTML = 'Wynik: ' + score;
            // Odtwarzanie dźwięku zjedzenia
            eatSound.play();

            // Umieszczenie jabłka w nowym miejscu
            apple.x = getRandomInt(0, canvas.width / grid) * grid;
            apple.y = getRandomInt(0, canvas.height / grid) * grid;
        }

        // Sprawdzenie kolizji z samym sobą
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                // Odtwarzanie dźwięku śmierci
                dieSound.play();

                // Wyświetlenie komunikatu i przycisku restartu
                document.getElementById('message').innerHTML = 'Haha!';
                document.getElementById('restartButton').style.display = 'block';

                // Zatrzymanie pętli gry
                cancelAnimationFrame(requestId);
                return;
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

// **Dodanie obsługi gestów przesunięcia (swipe)**
let touchStartX = null;
let touchStartY = null;

canvas.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, false);

canvas.addEventListener('touchmove', function (e) {
    e.preventDefault(); // Zapobiega przewijaniu strony podczas przesuwania palcem po ekranie
}, false);

canvas.addEventListener('touchend', function (e) {
    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Przesunięcie poziome
        if (dx > 0 && snake.dx === 0) {
            // Przesunięcie w prawo
            snake.dx = grid;
            snake.dy = 0;
        } else if (dx < 0 && snake.dx === 0) {
            // Przesunięcie w lewo
            snake.dx = -grid;
            snake.dy = 0;
        }
    } else {
        // Przesunięcie pionowe
        if (dy > 0 && snake.dy === 0) {
            // Przesunięcie w dół
            snake.dy = grid;
            snake.dx = 0;
        } else if (dy < 0 && snake.dy === 0) {
            // Przesunięcie w górę
            snake.dy = -grid;
            snake.dx = 0;
        }
    }

    touchStartX = null;
    touchStartY = null;
}, false);

// Obsługa przycisku "Zagraj ponownie"
document.getElementById('restartButton').addEventListener('click', function () {
    resetGame();
});

// Uruchomienie pętli gry
let requestId = requestAnimationFrame(loop);
