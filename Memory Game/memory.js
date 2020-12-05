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

const imageDefaultPath = 'Images\\default.png';

const gameBlock = document.querySelector('.gameBlock');
gameBlock.onselectstart = () => false;

const mapImage = new Map();

function startGame() {
    const count = 36;

    gameBlock.style.width = Math.sqrt(count)*136.25+'px';

    const random = randomNoRepeats(count);

    for (let path of imagePaths) {
        let id1 = random.next().value;
        let id2 = random.next().value;
        if (id1 === undefined || id2 === undefined) break;
        mapImage.set(id1, path)
        mapImage.set(id2, path)
    }


    for (let i = 0; i < count; i++) {
        gameBlock.append(createStartImage(i));
    }
}

function createStartImage(id) {
    const image = document.createElement('img');
    image.id = `img_${id}`;
    image.src = imageDefaultPath;
    image.ondragstart = () => false;
    image.onclick = () => clickImage(image);
    //image.addEventListener('click', () => clickImage(image));
    return image;
}

let lastImage;

let isLock = true;

function clickImage(image) {
    if (isLock || (lastImage !== undefined && lastImage.id === image.id)) return;
    const id = parseInt(image.id.split('_')[1]);
    image.src = mapImage.get(id);

    if (lastImage === undefined) {
        lastImage = image;
    }
    else if (lastImage.src !== image.src) {
        isLock = true;
        setTimeout(() => {
            lastImage.src = imageDefaultPath;
            image.src = imageDefaultPath;
            isLock = false;
            lastImage = undefined;
        }, 500);
    }
    else {
        lastImage.onclick = null;
        image.onclick = null;
        lastImage = undefined;
    }
}

function showAllImage() {
    isLock = true;
    const images = gameBlock.querySelectorAll('img');

    for (let image of images) {
        const id = parseInt(image.id.split('_')[1]);
                image.src = mapImage.get(id);
    }

    setTimeout(() => {
        for (let image of images) {
            image.src = imageDefaultPath;
        }
        isLock = false;
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
showAllImage();