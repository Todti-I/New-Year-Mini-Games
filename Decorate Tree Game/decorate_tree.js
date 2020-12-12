const imageToyPaths =
    [
        'Images\\ball_1.png',
        'Images\\ball_2.png',
        'Images\\ball_3.png',
        'Images\\ball_4.png',
        'Images\\ball_5.png',
        'Images\\bell.png',
        'Images\\sock.png',
        'Images\\wand.png',
    ];

const imageStarPath = 'Images\\star.png';
const imageDefaultPath = 'Images\\default.png';

const imageTrashPaths =
    [
        'Images\\trash_0.png',
    ];

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
        clearInterval(this.timer);
        this.stopTime = new Date();
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

let timer;
let successCount = 0;
let errorCount = 0;

let isTrash;
let isLock = true;

let lastCallReset = new Date();

const errorText = document.querySelector('#errorText');
const timerText = document.querySelector('#timerText');

const resultTimer = document.querySelector('#resultTimer');
const resultError = document.querySelector('#resultError');

const dialog = document.querySelector('dialog');

document.querySelector('html').addEventListener('keyup', keyPress);
const gameBlock = document.querySelector('.gameBlock');
const imageObject = gameBlock.querySelector('.imageObject');

function resetGame() {
    let currentCallReset = new Date();
    if (currentCallReset - lastCallReset < 100) return;
    lastCallReset = currentCallReset;

    errorText.textContent = 'Ошибки: 0';
    timerText.textContent = '0:00';

    for (let toy of document.querySelectorAll('.toy')) {
        toy.src = imageDefaultPath;
    }

    errorCount = 0;
    successCount = 0;
    if (timer !== undefined) {
        timer.stop();
    }
    timer = undefined;
    lastCard = undefined;
    isLock = true;

    startGame();
}

function startGame() {
    timer = new Timer(timerText);
    nextImageObject();
}

function nextImageObject() {
    isLock = true;
    if (getRandomInt(100) < 50) {
        isTrash = false;
        imageObject.src = successCount == 10 ? imageStarPath : imageToyPaths[getRandomInt(imageToyPaths.length)];
    }
    else {
        isTrash = true;
        imageObject.src = imageTrashPaths[getRandomInt(imageTrashPaths.length)];
    }
    isLock = false;
}

function clickTrue() {
    if (isLock) return;
    if (isTrash) {
        errorCount++;
        errorText.textContent = `Ошибки: ${errorCount}`;
    }
    else {
        document.querySelector('#pos' + successCount).src = imageObject.src;
        successCount++;

    }
    if (successCount > 10) {
        endGame();
    }
    else nextImageObject();
}

function clickFalse() {
    if (isLock) return;
    if (!isTrash) {
        errorCount++;
        errorText.textContent = `Ошибки: ${errorCount}`;
    }
    nextImageObject();
}

function keyPress(e) {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        clickTrue();
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        clickFalse();
    }
}

function endGame() {
    timer.stop();
    isLock = true;
    imageObject.src = imageDefaultPath;
    resultTimer.textContent = timerText.textContent;
    resultError.textContent = errorCount;
    setTimeout(() => dialog.showModal(), 500);
}

startGame();
