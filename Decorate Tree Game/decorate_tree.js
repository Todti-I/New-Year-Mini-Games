document.querySelector('#menuButton').addEventListener('click', () => {
    const mainPath = window.location.href.split('/').slice(0, -2).join('/');
    window.location.replace(`${mainPath}/index.html`);
});

const imageToyPaths =
    [
        'Images\\ball_1.png',
        'Images\\ball_2.png',
        'Images\\ball_3.png',
        'Images\\ball_4.png',
        'Images\\bell.png',
        'Images\\sock.png',
        'Images\\wreath.png',
    ];

const imageStarPath = 'Images\\star.png';
const imageDefaultPath = 'Images\\default.png';

const imageTrashPaths = [];
for (let i = 0; i < 26; i++) {
    imageTrashPaths.push(`Images\\trash_${i}.png`);
}

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
const cardObject = gameBlock.querySelector('.cardObject');
const imageObject = gameBlock.querySelector('.imageObject');
const tree = document.querySelector('.tree');

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
    isLock = true;
    if (isTrash) {
        errorCount++;
        errorText.textContent = `Ошибки: ${errorCount}`;
        playAnimationSwipe('top');
    }
    else {

        const copySrc = Object.assign(imageObject.src);
        const copyCount = successCount;
        successCount++;
        setTimeout(() => {
            tree.append(createImageToy(copyCount, copySrc));
        }, 900);
        playAnimationSwipe('left');
    }
    if (successCount > 10) {
        endGame();
    }
    else {
        nextImageObject();
        isLock = false;
    }
}

function createImageToy(position, src) {
    const img = document.createElement('img');
    img.src = src;
    img.id = `pos${position}`;
    img.className = 'toy';
    img.addEventListener('dragstart', () => false);
    return img;
}

function clickFalse() {
    if (isLock) return;
    isLock = true;
    if (!isTrash) {
        errorCount++;
        errorText.textContent = `Ошибки: ${errorCount}`;
        playAnimationSwipe('top');
    }
    else playAnimationSwipe('right');
    isLock = false;
    nextImageObject();
}

function playAnimationSwipe(name) {
    const copyImageObject = imageObject.cloneNode();
    cardObject.append(copyImageObject);
    copyImageObject.classList.toggle(name);
    setTimeout(() => {
        cardObject.removeChild(copyImageObject);
    }, 900);
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
    setTimeout(() => dialog.showModal(), 1000);
}

startGame();
