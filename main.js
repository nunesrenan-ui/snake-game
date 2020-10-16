const arrowUp = "ArrowUp";
const arrowDown = "ArrowDown";
const arrowRight = "ArrowRight";
const arrowLeft = "ArrowLeft";
const snakeDefaultSpeed = 20;
const minValue = 0;
let snakeSpeed = 0;

//fazer um quadrado para ser o cenário:
//fazer um quadrado na tela para ser a serpente:
//fazer um quadrado na tela para ser o alimento da serpente:
const outerBox = document.getElementById("outerBox");
const snake = document.getElementById("snake");
const food = document.getElementById("randomPoint");
const counter = document.getElementById("counter");
let tail = "";

let keyCode = "";
let snakePositionY = 0;
let snakePositionX = 0;
let outerBoxWidth = parseInt(window.getComputedStyle(outerBox).width);
let outerBoxHeight = parseInt(window.getComputedStyle(outerBox).height);
let playerWidth = parseInt(window.getComputedStyle(snake).width);
let playerHeight = parseInt(window.getComputedStyle(snake).height);
let gameSpaceX = outerBoxWidth - (playerWidth*2);
let gameSpaceY = outerBoxHeight - (playerHeight*2);
let counterOfFood = 0;
//array de posições x e y em formato de string:
let footPrints = [];
//array de divs:
let tails = [];

//tela inicial do jogo:
const startGame = document.getElementById("startGame");
startGame.innerText = "Press ON to play!";

//tela final do jogo:
const endGame = () => {
    const endGameMessage = document.getElementById("endGameMessage");
    endGameMessage.innerText = `Game Over Score: ${counterOfFood}! Press reset to play again!`
}

//função para iniciar o jogo:
const btnOnOff = document.getElementById("btnOnOff");
btnOnOff.addEventListener("click", function(){
    startGame.remove();
    snakeSpeed = setInterval(function () { snakeDirection(snake, snakeDefaultSpeed) }, 150);
})

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", function(){
    location.reload()
})

//funções para adicionar evento de click nas setas do mini game:
const btnUp = document.getElementById('moveUp')
btnUp.addEventListener("click", function(){
    keyCode = arrowUp;
    console.log(keyCode)
    return keyCode
})

const btnDown = document.getElementById('moveDown')
btnDown.addEventListener("click", function(){
    keyCode = arrowDown;
    console.log(keyCode)
    return keyCode
})

const btnRight = document.getElementById('moveRight')
btnRight.addEventListener("click", function(){
    keyCode = arrowRight;
    console.log(keyCode)
    return keyCode
})

const btnLeft = document.getElementById('moveLeft')
btnLeft.addEventListener("click", function(){
    keyCode = arrowLeft;
    console.log(keyCode)
    return keyCode
})

//colocar um evento keyboardown para mover a serpente:
const eventListener = (event) => {
    keyCode = event.key;
    return keyCode;
}

document.addEventListener("keydown", eventListener);

//fazer a serpente se mover na tela, esta é a função principal do jogo:
const snakeDirection = (element, speed) => {
    snakePositionY = window.getComputedStyle(element).top;
    snakePositionY = parseFloat(snakePositionY);
    snakePositionX = window.getComputedStyle(element).left;
    snakePositionX = parseFloat(snakePositionX);
    if (wallReached() || endGameCondition(tails, snakePositionX, snakePositionY)) {
        clearInterval(snakeSpeed);
        snake.remove();
        followingTheFootPrints(footPrints, minValue);
        food.remove();
        endGame()
    } else {
        if (keyCode === arrowUp) {
            snakePositionY -= speed;
            element.style.top = `${snakePositionY}px`;
        }
        if (keyCode === arrowDown) {
            snakePositionY += speed;
            element.style.top = `${snakePositionY}px`;
        }
        if (keyCode === arrowRight) {
            snakePositionX += speed;
            element.style.left = `${snakePositionX}px`;
        }
        if (keyCode === arrowLeft) {
            snakePositionX -= speed;
            element.style.left = `${snakePositionX}px`;
        }
        footPrints.push(`${snakePositionX},${snakePositionY}`)
    }
    if (snakeHasEaten(food)) {
        makeRandomPointInOuterBox(gameSpaceX, gameSpaceY, food);
        count(counter);
        getBigger(counterOfFood);
    }
    if (counterOfFood > 0) {
        followingTheFootPrints(footPrints);
    }
}

//criar condição de batida na parede:
const wallReached = () => {
    if (snakePositionX < minValue || snakePositionX > outerBoxWidth - playerWidth) {
        snake.style.opacity = `${minValue}%`;
        return true
    }
    if (snakePositionY < minValue || snakePositionY > outerBoxHeight - playerHeight) {
        snake.style.opacity = `${minValue}%`;
        return true
    }
}

// criar uma função que gere numeros aleatórios:
const randomNumber = (maxValue) => {
    let randomValue = Math.ceil((Math.random() * maxValue) / snakeDefaultSpeed) * snakeDefaultSpeed
    return randomValue
}

//criar um ponto (comida) em algum lugar aleatório no campo de jogo:
const makeRandomPointInOuterBox = (elementPositionX, elementPositionY, elementHTML) => {
    let left = randomNumber(elementPositionX);
    let top = randomNumber(elementPositionY);
    if(endGameCondition(tails, left, top)) {
        makeRandomPointInOuterBox(gameSpaceX, gameSpaceY, food);
        console.log('funcionou')
    } else {
        elementHTML.style.left = `${left}px`
        elementHTML.style.top = `${top}px`
    }
}

//criar função onde a snake encontra a comida
const snakeHasEaten = (elementFood) => {
    let foodPositionX = window.getComputedStyle(elementFood).left;
    foodPositionX = parseFloat(foodPositionX);
    let foodPositionY = window.getComputedStyle(elementFood).top;
    foodPositionY = parseFloat(foodPositionY);
    if (foodPositionX === snakePositionX &&
        foodPositionY === snakePositionY) {
        return true
    }
    return false
}

//criar função para desenhar uma parte do corpo da serpente na tela.
const getBigger = (lastPosition) => {
    tail = document.createElement("div")
    tail.className = "tail";
    tails.push(tail);
    outerBox.appendChild(tails[lastPosition-1]);
}

//função que faz a parte do corpor desenhada na função anterior seguir a snake
const followingTheFootPrints = (arrayPosition, opacity) => {
    for (let i = 0; i < tails.length; i++) {
        let arrPosition = i+2;
        followTheSnakeX = Number(arrayPosition[arrayPosition.length - arrPosition].split(",")[0]);
        followTheSnakeY = Number(arrayPosition[arrayPosition.length - arrPosition].split(",")[1]);
        tails[i].style.left = `${followTheSnakeX}px`;
        tails[i].style.top = `${followTheSnakeY}px`;
        tails[i].style.opacity = `${opacity}%`
    }
}

//criar um contador
const count = (elementHTML) => {
    counterOfFood += 1;
    elementHTML.textContent = counterOfFood;
}

//criar condição de derrota quando a serpente esbarrar no próprio corpo, eu pretendo usar o contador para acessar os indices do array [footPrints] e verificar se a coordenada da cabeça da snake é igual a alguma coordenada do corpo da serpente;
const endGameCondition = (array, positionX, positionY) => {
    let tailPositionX = 0;
    let tailPositionY = 0;
    for(let i = 0; i < array.length; i++) {
        tailPositionX = window.getComputedStyle(array[i]).left;
        tailPositionX = parseFloat(tailPositionX);
        tailPositionY = window.getComputedStyle(array[i]).top;
        tailPositionY = parseInt(tailPositionY);
        if(positionX === tailPositionX &&
            positionY === tailPositionY &&
            counterOfFood > 1) {
                console.log(tailPositionX)
                console.log(tailPositionY)
                return true
            }
    }
    /* if() */
}

