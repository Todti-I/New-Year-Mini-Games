class Timer {
    constructor(outputElement) {
        this.startTime = new Date();
        this.timer = setInterval(() => {
            let time = new Date(new Date() - this.startTime);
            outputElement.textContent = time.getMinutes() + ':'
                + (time.getSeconds() < 10 ? '0' : '') + time.getSeconds();
        }, 500);
    }
    stop() {
        if(this.timer)
            clearInterval(this.timer);
        this.stopTime = new Date();
    }
}
let timer;
let stepsCount;

let width = 15, height = 23;
let maze = [];

function fillLabyrinth() {
    maze = [];
    for(let y = 0; y < height; y++) {
        let line = [];
        for(let x = 0; x < width; x++)
            line.push({ isWall: (x % 2 == 0 || y % 2 == 0)});
        maze.push(line);
    }
    
    let current = { x: 1, y: 1};
    let stack = [];
    let visited = [current];
    let pointsCount = (Math.round(width / 2) - 1)*(Math.round(height / 2) - 1);
    while(visited.length != pointsCount) {
        let neighbours = [];

        for(let x = current.x - 2, y = current.y; x <= (current.x + 2); x += 4)
            if(x > 0 && x < (width - 1) && visited.every(v => v.x != x || v.y != y))
                neighbours.push({x ,y});
        for(let x = current.x, y = current.y - 2; y <= (current.y + 2); y += 4)
            if(y > 0 && y < (height - 1) && visited.every(v => v.x != x || v.y != y))
                neighbours.push({x ,y});
        
        if(neighbours.length != 0) {
            let randNeighbour = neighbours[Math.round(Math.random()*(neighbours.length - 1))];
            stack.push(current);
            maze[(randNeighbour.y + current.y)/2][(randNeighbour.x + current.x)/2].isWall = false;
            current = randNeighbour;
            visited.push(current);
        } else if(stack.length) {
            current = stack.pop();
        } else {
            let c;
            do {
                c = { x: Math.round(Math.random()*(Math.round(width / 2) - 2)) * 2 + 1,
                    y: Math.round(Math.random()*(Math.round(height / 2) - 2)) * 2 + 1 };
            } while(c.x <= 0 || c.x >= (width - 1) || c.y <= 0 || c.y >= (height - 1) || visited.some(v => v.x == c.x && v.y == c.y))
            current = c;
            visited.push(current);
        }
    }
    maze[0][Math.round(width/2) - 1].isWall = false;
    maze[height - 1][Math.round(width/2) - 1].isWall = false;
}

/**
 * @param {HTMLCanvasElement} canvas 
 */
function drawLabyrinth(canvas) {
    let context = canvas.getContext('2d');
    context.clearRect(0,0,canvas.width,canvas.height);
    context.beginPath();
    context.fillStyle = 'black';
    let cellWidth = canvas.width / width;
    let cellHeight = canvas.height / height;
    for(let y = 0; y < height; y++)
        for(let x = 0; x < width; x++)
            if(maze[y][x].isWall)
                context.drawImage(leaves, x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    context.stroke();
    context.closePath();
}

let starPos;
let star = document.getElementById('star');
let won;
let intervalId = 0;

function makeStep(event) {
    if(!won && intervalId == 0) {
        switch(event.code) {
            case "ArrowDown":
            case "KeyS":
                if(starPos.y + 1 <= height - 1 && !maze[starPos.y + 1][starPos.x].isWall) {
                    starPos.y++;
                    errorText.textContent = "Ходов: " + ++stepsCount;
                }
                break;
            case "ArrowUp":
            case "KeyW":
                if(starPos.y - 1 >= 0 && !maze[starPos.y - 1][starPos.x].isWall) {
                    starPos.y--;
                    errorText.textContent = "Ходов: " + ++stepsCount;
                }
                break;
            case "ArrowLeft":
            case "KeyA":
                if(starPos.x - 1 >= 1 && !maze[starPos.y][starPos.x - 1].isWall) {
                    starPos.x--;
                    errorText.textContent = "Ходов: " + ++stepsCount;
                }
                break;
            case "ArrowRight":
            case "KeyD":
                if(starPos.x + 1 <= width - 2 && !maze[starPos.y][starPos.x + 1].isWall) {
                    starPos.x++;
                    errorText.textContent = "Ходов: " + ++stepsCount;
                }
                break;
        }
        let currentPos = {x: parseFloat(star.style.left), y: parseFloat(star.style.top)};
        let next = {x: starPos.x / width * 100, y : starPos.y / height * 100};
        let dxdy = {x: (next.x - currentPos.x)/15, y: (next.y - currentPos.y)/15 };
        //alert(currentPos.x + " " + currentPos.y);
        //alert(next.x + " " + next.y);
        intervalId = setInterval(() => {
            if(Math.abs(currentPos.x - next.x) < 0.01 && Math.abs(currentPos.y - next.y) < 0.01) {
                clearInterval(intervalId);
                intervalId = 0;
            } else {
                currentPos.x += dxdy.x;
                currentPos.y += dxdy.y;
                star.style.left = currentPos.x + "%";
                star.style.top = currentPos.y + "%";
            }
        }, 10);
        if(starPos.y == 0)
            setTimeout(() => {
                won = true;
                dialog.showModal();
                timer.stop();
                star.classList.add('starWin');
                star.style.left = '44.5%';
                star.style.right = '0%';
                resultTimer.textContent = timerText.textContent;
                resultError.textContent = errorText.textContent;
                labyrinth.classList.add('hidden');
            }, 500);
    }
}

document.body.addEventListener('keydown', makeStep);

function playAgain() {
    if(timer)
        timer.stop();
    timer = new Timer(document.getElementById('timerText'));
    stepsCount = 0;
    errorText.textContent = `Ходов: ${stepsCount}`;
    won = false;
    starPos = {x: Math.round(width/2) - 1, y: height - 1};
    if(star.classList.contains('starWin'))
        star.classList.remove('starWin');
    if(labyrinth.classList.contains('hidden'))
        labyrinth.classList.remove('hidden');
    star.style.left = (starPos.x / width)*100 + "%";
    star.style.top = (starPos.y / height)*100 + "%";
    fillLabyrinth();
    drawLabyrinth(document.getElementById('labyrinth'));
}

playAgain();