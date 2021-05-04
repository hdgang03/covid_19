function main() {

    const startButton = document.getElementById("start-button");
    const instructions = document.getElementById("instructions-text");
    const playArea = document.getElementById("play-area");
    const shooter = document.getElementById("shooter");
    const covidImgs = ['img/covid_1.png', 'img/covid_2.png', 'img/covid_3.png'];
    const scoreCounter = document.querySelector('#score span');

    let covidCreationInterval;


    startButton.addEventListener("click", (event) => {
        playGame()
    });

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
                    scoreCounter.innerText = parseInt(scoreCounter.innerText) + 100;
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
                    gameOver();
                }
            } else {
                covidElem.style.top = `${xPosition + 2}px`;
            }
        }, 30)
    }


    function checkSyringeCollision(syringe, covid) {
        let syringeLeft = parseInt(syringe.style.left);
        let syringeRight = 600 - syringeLeft;
        let syringeTop = parseInt(syringe.style.top);
        let syringeBottom = syringeTop + 30; //syringe height
        let covidTop = parseInt(covid.style.top);
        let covidBottom = covidTop - 30;
        let covidLeft = parseInt(covid.style.left);
        let covidRight = 580 - covidLeft;

        if (syringeTop > 5 && syringeTop + 40 <= covidTop) {
            if ((syringeLeft >= covidLeft && syringeRight >= covidRight)) {
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
        setTimeout(() => {

            instructions.innerHTML = `Game Over! The viruses made it to your Grandma. Your final score is ${scoreCounter.innerText}!`;
            instructions.style.display = "block";
            instructions.style.color = "red";
            startButton.style.display = "block";
        }, 600)
    }

    function playGame() {
        scoreCounter.innerText = 0;
        startButton.style.display = 'none';
        instructions.style.display = 'none';
        window.addEventListener("keydown", letDoctorMove);
        covidCreationInterval = setInterval(function () { createCovid() }, 2100);
    }
}
window.addEventListener("load", main);
