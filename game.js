function main() {

    const startButton = document.getElementById("start-button");
    const instructions = document.getElementById("instructions-text");
    const playArea = document.getElementById("play-area");
    const shooter = document.getElementById("shooter");
    const covidImgs = ['img/covid_1.png', 'img/covid_2.png', 'img/covid_3.png'];
    const lifeCounter = document.querySelector('#life');
    const scoreCounter = document.querySelector('#currentscore');
    const highScoreCounter = document.querySelector("#highscore");

    let life;
    let score;
    let highscore = localStorage.getItem("highscore");
    if (highscore === null) {
        localStorage.setItem("highscore", 0);
    }
    highScoreCounter.innerText= highscore;

    let covidCreationInterval;
    let heartCreationInterval;


    startButton.addEventListener("click", (event) => {
        playGame()
    });

    function handleHighscore () {
        if (highscore < score) {
            localStorage.setItem("highscore", score);
            highScoreCounter.innerText= score;
        }
    }

    function handleCollision () {
        life -=1;
        lifeCounter.innerText = life;
        if (life <= 0) {
            gameOver();
        }
    }

    function letDoctorMove(event) {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            moveLeft();
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            moveRight();
        } else if (event.key === " ") {
            event.preventDefault();
            fireSyringe();
        }
    }


    function moveLeft() {
        let leftPosition = window.getComputedStyle(shooter).getPropertyValue('left');
        if (shooter.style.left === "0px") {
            return;
        } else {
            let position = parseInt(leftPosition);
            position -= 6;
            shooter.style.left = `${position}px`;
        }
    }


    function moveRight() {
        let leftPosition = window.getComputedStyle(shooter).getPropertyValue('left');

        if (parseInt(shooter.style.left) > 520) {
            return;
        } else {
            let position = parseInt(leftPosition);
            position += 6;
            shooter.style.left = `${position}px`;
        }
    }


    function fireSyringe() {
        let syringe = createSyringeElement();
        playArea.appendChild(syringe);
        moveSyringe(syringe);
    }


    function createSyringeElement() {
        let xPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('left'));
        let yPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('top'));
        let newSyringe = document.createElement('img');
        newSyringe.src = 'img/syringe@1.5x.png';
        newSyringe.classList.add('syringe');
        newSyringe.style.left = `${xPosition + 35}px`;
        newSyringe.style.top = `${yPosition - 10}px`;
        return newSyringe;
    }


    function moveSyringe(syringe) {
        let syringeInterval = setInterval(() => {
            let topPosition = parseInt(syringe.style.top);
            let covids = document.querySelectorAll(".covid");
            covids.forEach(covid => {
                if (checkSyringeCollision(syringe, covid)) {
                    covid.src = "img/explosion.png";
                    covid.classList.remove("covid");
                    covid.classList.add("dead-covid");
                    score += 100;
                    scoreCounter.innerText = score;
                    handleHighscore();
                }
            })
            let hearts = document.querySelectorAll(".heart");
            hearts.forEach(heart => {
                if(checkSyringeCollision(syringe, heart)) {
                    heart.classList.remove("heart");
                    heart.classList.add("dead-heart");
                    life++;
                    lifeCounter.innerText = life;
                }
            })
            if (topPosition < 20) {
                syringe.remove();
                clearInterval(syringeInterval);
            } else {
                syringe.style.top = `${topPosition - 4}px`;
            }
        }, 10)
    }

    function createHeart() {
        let newHeart = document.createElement('img');
        newHeart.src = 'img/heart.png';
        newHeart.classList.add('heart');
        newHeart.classList.add('heart-transition');
        newHeart.style.top = '50px';
        newHeart.style.left = `${Math.floor(Math.random() * 330) + 30}px`;
        playArea.appendChild(newHeart);
        moveHeart(newHeart);
    }


    function createCovid() {
        let newCovid = document.createElement('img');
        let covidSpriteImg = covidImgs[Math.floor(Math.random() * covidImgs.length)];
        newCovid.src = covidSpriteImg;
        newCovid.classList.add('covid');
        newCovid.classList.add('covid-transition');
        newCovid.style.top = '50px';
        newCovid.style.left = `${Math.floor(Math.random() * 330) + 30}px`;
        playArea.appendChild(newCovid);
        moveCovid(newCovid);
    }


    function moveCovid(covidElem) {
        let moveCovidInterval = setInterval(() => {
            let xPosition = parseInt(window.getComputedStyle(covidElem).getPropertyValue('top'));
            if (xPosition >= 700) {
                if (Array.from(covidElem.classList).includes("dead-covid")) {
                    covidElem.remove();
                    clearInterval(moveCovidInterval)
                } else {
                    covidElem.remove();
                    clearInterval(moveCovidInterval)
                    handleCollision();
                }
            } else {
                covidElem.style.top = `${xPosition + 2}px`;
            }
        }, 30)
    }
    function moveHeart(heartElem) {
        let moveHeartdInterval = setInterval(() => {
            let xPosition = parseInt(window.getComputedStyle(heartElem).getPropertyValue('top'));
            if (xPosition >= 700) {
                if (Array.from(heartElem.classList).includes("dead-heart")) {
                    heartElem.remove();
                    clearInterval(moveHeartdInterval)
                } else {
                    heartElem.remove();
                    clearInterval(moveHeartdInterval)
                }
            } else {
                heartElem.style.top = `${xPosition + 2}px`;
            }
        }, 30)
    }


    function checkSyringeCollision(syringe, elem) {
        let syringeLeft = parseInt(syringe.style.left);
        let syringeRight = 600 - syringeLeft;
        let syringeTop = parseInt(syringe.style.top);
        let syringeBottom = syringeTop + 30; //syringe height
        let elemTop = parseInt(elem.style.top);
        let elemBottom = elemTop - 30;
        let elemLeft = parseInt(elem.style.left);
        let elemRight = 580 - elemLeft;

        if (syringeTop > 5 && syringeTop + 40 <= elemTop) {
            if ((syringeLeft >= elemLeft && syringeRight >= elemRight)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }


    function gameOver() {
        window.removeEventListener("keydown", letDoctorMove);
        clearInterval(covidCreationInterval);
        let covids = document.querySelectorAll(".covid");
        covids.forEach(covid => covid.remove());
        let syringes = document.querySelectorAll(".syringe");
        syringes.forEach(syringe => syringe.remove());
        handleHighscore();
        setTimeout(() => {

            instructions.innerHTML = `Game Over! The viruses made it to your Grandma. Your final score is ${scoreCounter.innerText}!`;
            instructions.style.display = "block";
            instructions.style.color = "red";
            startButton.style.display = "block";
        }, 600)
    }

    function playGame() {
        life = 3;
        score = 0;
        scoreCounter.innerText = score;
        lifeCounter.innerText = life;
        startButton.style.display = 'none';
        instructions.style.display = 'none';
        window.addEventListener("keydown", letDoctorMove);
        covidCreationInterval = setInterval(function () { createCovid() }, 2100);
        heartCreationInterval = setInterval(function () {createHeart()}, 16000);
    }
}
window.addEventListener("load", main);
