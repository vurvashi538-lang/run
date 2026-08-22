const player = document.getElementById("player");
const objects = document.getElementById("objects");

const scoreText = document.getElementById("score");
const coinsText = document.getElementById("coins");

const startScreen =
    document.getElementById("startScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const finalScore =
    document.getElementById("finalScore");


let gameRunning = false;

let lane = 1;

let score = 0;
let coins = 0;

let speed = 6;

let spawnTimer = 0;

let lastTime = 0;

let objectsArray = [];

let jumping = false;
let sliding = false;


/* LANE POSITIONS */

function lanePosition(laneNumber) {

    const positions = [
        38,
        50,
        62
    ];

    return positions[laneNumber];
}


/* UPDATE PLAYER */

function updatePlayer() {

    player.style.left =
        lanePosition(lane) + "%";

}


/* MOVE LEFT */

function moveLeft() {

    if (!gameRunning)
        return;

    if (lane > 0) {

        lane--;

        updatePlayer();

    }

}


/* MOVE RIGHT */

function moveRight() {

    if (!gameRunning)
        return;

    if (lane < 2) {

        lane++;

        updatePlayer();

    }

}


/* JUMP */

function jump() {

    if (!gameRunning)
        return;

    if (jumping || sliding)
        return;

    jumping = true;

    player.classList.add("jump");

    setTimeout(() => {

        player.classList.remove("jump");

        jumping = false;

    }, 550);

}


/* SLIDE */

function slide() {

    if (!gameRunning)
        return;

    if (jumping || sliding)
        return;

    sliding = true;

    player.classList.add("slide");

    setTimeout(() => {

        player.classList.remove("slide");

        sliding = false;

    }, 600);

}


/* CREATE COIN */

function createCoin() {

    const coin =
        document.createElement("div");

    coin.className =
        "object coin";

    const randomLane =
        Math.floor(Math.random() * 3);

    coin.style.left =
        lanePosition(randomLane) + "%";

    coin.style.top =
        "-40px";

    objects.appendChild(coin);

    objectsArray.push({

        element: coin,

        type: "coin",

        lane: randomLane,

        y: -40

    });

}


/* CREATE OBSTACLE */

function createObstacle() {

    const obstacle =
        document.createElement("div");

    const randomLane =
        Math.floor(Math.random() * 3);

    const type =
        Math.random() < .7
            ? "car"
            : "guard";

    obstacle.className =
        "object " + type;

    obstacle.style.left =
        lanePosition(randomLane) + "%";

    obstacle.style.top =
        "-100px";

    objects.appendChild(obstacle);

    objectsArray.push({

        element: obstacle,

        type: type,

        lane: randomLane,

        y: -100

    });

}


/* SPAWN */

function spawnObject() {

    if (Math.random() < .6) {

        createObstacle();

    } else {

        createCoin();

    }

}


/* COLLISION */

function collision(object) {

    if (object.lane !== lane)
        return false;

    const playerRect =
        player.getBoundingClientRect();

    const objectRect =
        object.element.getBoundingClientRect();

    return (

        playerRect.left <
        objectRect.right &&

        playerRect.right >
        objectRect.left &&

        playerRect.top <
        objectRect.bottom &&

        playerRect.bottom >
        objectRect.top

    );

}


/* GAME LOOP */

function gameLoop(time) {

    if (!gameRunning)
        return;

    const delta =
        time - lastTime;

    lastTime = time;

    spawnTimer += delta;


    /* SPAWN */

    if (spawnTimer > 800) {

        spawnObject();

        spawnTimer = 0;

    }


    /* OBJECT MOVEMENT */

    for (
        let i = objectsArray.length - 1;
        i >= 0;
        i--
    ) {

        const object =
            objectsArray[i];

        object.y += speed;

        object.element.style.top =
            object.y + "px";


        /* COLLISION */

        if (collision(object)) {

            if (object.type === "coin") {

                coins++;

                coinsText.textContent =
                    coins;

                object.element.remove();

                objectsArray.splice(i, 1);

                continue;

            }

            else {

                if (!jumping) {

                    gameOver();

                    return;

                }

            }

        }


        /* REMOVE */

        if (
            object.y >
            window.innerHeight + 150
        ) {

            object.element.remove();

            objectsArray.splice(i, 1);

        }

    }


    /* SCORE */

    score += 0.05;

    scoreText.textContent =
        Math.floor(score);


    /* SPEED */

    speed += 0.001;


    requestAnimationFrame(gameLoop);

}


/* START */

function startGame() {

    gameRunning = true;

    score = 0;
    coins = 0;

    speed = 6;

    lane = 1;

    spawnTimer = 0;

    objectsArray.forEach(object => {

        object.element.remove();

    });

    objectsArray = [];

    scoreText.textContent = "0";

    coinsText.textContent = "0";

    startScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    updatePlayer();

    lastTime =
        performance.now();

    requestAnimationFrame(gameLoop);

}


/* GAME OVER */

function gameOver() {

    gameRunning = false;

    finalScore.textContent =
        Math.floor(score);

    gameOverScreen.classList.remove(
        "hidden"
    );

}


/* KEYBOARD */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            moveLeft();

        }

        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            moveRight();

        }

        if (
            event.key === "ArrowUp" ||
            event.key === " "
        ) {

            jump();

        }

        if (
            event.key === "ArrowDown" ||
            event.key.toLowerCase() === "s"
        ) {

            slide();

        }

    }
);


/* INITIAL */

updatePlayer();
