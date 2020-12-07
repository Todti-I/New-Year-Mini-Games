const imagePaths =
    [
        'Images\\bauble.png',
        'Images\\bells.png',
        'Images\\candy-cane.png',
        'Images\\christmas-pudding.png',
        'Images\\christmas-tree.png',
        'Images\\fireplace.png',
        'Images\\holly.png',
        'Images\\jingle-bell.png',
        'Images\\mail.png',
        'Images\\present.png',
        'Images\\reindeer.png',
        'Images\\santa-sleigh.png',
        'Images\\santa.png',
        'Images\\snowflake.png',
        'Images\\snowman.png',
        'Images\\stocking.png',
        'Images\\toy-train.png',
        'Images\\wine.png'
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

const imageDefaultPath = 'Images\\default.png';

const countCard = 36;

let timer;
let successCount = 0;
let errorCount = 0;

const errorText = document.querySelector('#errorText');

document.querySelector('html').onselectstart = () => false;
const gameBlock = document.querySelector('.gameBlock');

function startGame() {
    

    gameBlock.style.width = Math.sqrt(countCard) * 126 + 'px';

    const random = randomNoRepeats(countCard);
    const mapImage = new Map();

    for (let path of imagePaths) {
        let id1 = random.next().value;
        let id2 = random.next().value;
        if (id1 === undefined || id2 === undefined) break;
        mapImage.set(id1, path)
        mapImage.set(id2, path)
    }

    for (let i = 0; i < countCard; i++) {
        gameBlock.append(createCard(mapImage.get(i)));
    }
}

function createCard(backImagePath) {
    const div = document.createElement('div');
    div.className = 'card';
    div.onclick = () => clickCard(div);

    const image = document.createElement('img');
    image.className = 'cardImage';
    image.src = imageDefaultPath;
    image.ondragstart = () => false;

    const backImage = document.createElement('img');
    backImage.className = 'cardImage back';
    backImage.src = backImagePath;
    backImage.ondragstart = () => false;

    div.append(image);
    div.append(backImage);

    return div;
}

let lastCard;
let isLock = true;

function clickCard(card) {
    if (isLock || (lastCard !== undefined && lastCard === card)) return;
    card.classList.toggle('isFlipped');

    if (lastCard === undefined) {
        lastCard = card;
    }
    else if (lastCard.lastChild.src !== card.lastChild.src) {
        isLock = true;
        setTimeout(() => {
            lastCard.classList.toggle('isFlipped');
            card.classList.toggle('isFlipped');
            isLock = false;
            lastCard = undefined;
            errorCount++;
            errorText.textContent = `Ошибки: ${errorCount}`;
        }, 1000);
    }
    else {
        lastCard.onclick = null;
        card.onclick = null;
        lastCard = undefined;
        successCount++;
        if (successCount == countCard / 2) {
            timer.stop();
        }
    }
}

function showAllImage() {
    isLock = true;
    const cards = gameBlock.querySelectorAll('.card');

    for (let card of cards) {
        card.classList.toggle('isFlipped');
    }

    setTimeout(() => {
        for (let card of cards) {
            card.classList.toggle('isFlipped');
        }
        isLock = false;
        timer = new Timer(document.querySelector('#timerText'));
    }, 3000);
}

function* randomNoRepeats(maxValue) {
    let array = [];

    for (let i = 0; i < maxValue; i++) {
        array.push(i);
    }

    let length = array.length;

    while (length--) {
        yield array.splice(Math.floor(Math.random() * (length + 1)), 1)[0];
    }
}

startGame();
setTimeout(showAllImage, 1000);