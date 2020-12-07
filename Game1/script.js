let lights = [];
for(let i = 1; i <= 11; i++)
    lights.push('b'+i);

function randomLights() {
    for(let i = 0; i < 11; i++) {
        let pos1 = Math.round(Math.random()*10);
        let pos2 = Math.round(Math.random()*10);
        let temp = lights[pos1];
        lights[pos1] = lights[pos2];
        lights[pos2] = temp;
    }
}
randomLights();

let num = 0;
let won = false;
let clear;

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
let timer = new Timer(document.getElementById('timerText'));
let errorCount = 0;

function hint() {
    if(won) alert('Вы уже выиграли!');
    else change(document.getElementById(lights[num]));
}

/**
 * @param {HTMLElement} element
*/
function change(element) {
    let id = element.id;
    if(element.classList.contains('fire')) {
        if(lights[num - 1] === id) {
            element.classList.remove('fire');
            num--;
        }
    }
    else {
        element.classList.add('fire');
        if(lights[num] === id) {
            if(num == 10) {
                timer.stop();
                turnOffAllLights();
                animTheLights();
                won = true;
                resultTimer.textContent = timerText.textContent;
                resultError.textContent = errorCount;
                setTimeout(() => dialog.showModal(), 500);
            }
            num++;
        } else {
            setTimeout(turnOffAllLights, 500);
            num = 0;
            errorText.textContent = `Ошибки: ${++errorCount}`;
        }
    }
}

function turnOffAllLights() {
    for(let id of lights) {
        let elem = document.getElementById(id);
        if(elem.classList.contains('fire'))
            elem.classList.remove('fire');
    }
}

function animTheLights() {
    function anim() {
        let number = 0;
        for(let id of lights) {
            let elem = document.getElementById(id);
            setTimeout(() => elem.classList.add('fire'), number * 300);
            setTimeout(() => elem.classList.remove('fire'), number * 500 + 500);
            number++;
        }
    };
    anim();
    clear = setInterval(anim, 3300);
}

function playAgain() {
    if(clear) 
        clearInterval(clear);
    won = false;
    num = 0;
    randomLights();
    turnOffAllLights();
    timer.stop();
    timer = new Timer(document.getElementById('timerText'));
    errorCount = 0;
    errorText.textContent = `Ошибки: ${errorCount}`;
}