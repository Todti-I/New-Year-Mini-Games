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

function hint() {
    if(won) alert('Ты уже выиграл!');
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
                alert('Ты выиграл!');
                turnOffAllLights();
                animTheLights();
                won = true;
            }
            num++;
        } else {
            setTimeout(turnOffAllLights, 500);
            num = 0;
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
    let anim = () => {
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
    if(clear) clearInterval(clear);
    won = false;
    num = 0;
    randomLights();
    turnOffAllLights();
}