import { 
    startButton,
    instructions,
    playArea,
    shooter,
    covidImgs,
    lifeCounter,
    scoreCounter,
    highScoreCounter,
    surprises 
} from './constants.js';

function main() {

    //VARIABLES
    let health = 500;
    let point = 100;
    let life;
    let score;
    let giantFallSpeed = 1;
    let fallSpeed = 2;

    //HIGHSCORE
    let highscore = localStorage.getItem("highscore");
    if (highscore === null) {
        localStorage.setItem("highscore", 0);
    }
    highScoreCounter.innerText= highscore;

    //INTERVALS 
    let covidInterval = 2100;
    let heartInterval = 16000;
    let bombInterval = 22000;
    let starInterval = 33000;
    let giantCovidInterval = 58000;
    let covidCreationInterval;
    let heartCreationInterval;
    let bombCreationInterval;
    let starCreationInterval;
    let giantCovidCreationInterval;


    startButton.addEventListener("click", (event) => {
        playGame()
    });


    //HANDLE EVENTS
    function handleHighscore () {
        if (highscore < score) {
            localStorage.setItem("highscore", score);
            highScoreCounter.innerText= score;
        }
    }

    function handleGiantCollision () {
        life -=10;
        lifeCounter.innerText = life;
        if (life <= 0) {
            gameOver();
        }
    }

    function handleCollision () {
        life -=1;
        lifeCounter.innerText = life;
        if (life <= 0) {
            gameOver();
        }
    }

    function handleStar () {
        point = 200;
        surprises.innerText = "Double points!";
        setTimeout(function(){ surprises.innerText = "Double points ending!"; }, 12000);
        setTimeout(function(){ point = 100; surprises.innerText = ""; }, 15000);
    }

    function handleBomb () {
        surprises.innerText = "BANG";
        setTimeout(function(){ surprises.innerText = ""; }, 300);
        let covids = document.querySelectorAll(".covid");
        covids.forEach(covid => {
            covid.src = "img/explosion.png";
            covid.classList.remove("covid");
            covid.classList.add("dead-covid");
            score += point;
            scoreCounter.innerText = score;
            handleHighscore();
        });
    }

    //DOCTOR MOVE
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
        let playAreaWidth = playArea.offsetWidth;
        let shooterWidth = shooter.offsetWidth;
        
        if (parseInt(leftPosition) <= 0) {
            return;
        } else {
            let position = parseInt(leftPosition);
            position -= playAreaWidth * 0.01; // Move 1% of play area width
            shooter.style.left = `${position}px`;
        }
    }

    function moveRight() {
        let leftPosition = window.getComputedStyle(shooter).getPropertyValue('left');
        let playAreaWidth = playArea.offsetWidth;
        let shooterWidth = shooter.offsetWidth;
        
        if (parseInt(leftPosition) + shooterWidth >= playAreaWidth) {
            return;
        } else {
            let position = parseInt(leftPosition);
            position += playAreaWidth * 0.01; // Move 1% of play area width
            shooter.style.left = `${position}px`;
        }
    }

    //SYRINGE
    function fireSyringe() {
        let syringe = createSyringeElement();
        playArea.appendChild(syringe);
        moveSyringe(syringe);
    }

    function createSyringeElement() {
        let newSyringe = document.createElement('img');
        newSyringe.src = 'img/syringe@1.5x.png';
        newSyringe.classList.add('syringe');
        
        // Add syringe to DOM to get dimensions
        playArea.appendChild(newSyringe);
        
        // Get shooter's position relative to play area
        let shooterRect = shooter.getBoundingClientRect();
        let playAreaRect = playArea.getBoundingClientRect();
        let shooterCenterX = shooterRect.left + (shooterRect.width / 2) - playAreaRect.left;
        
        // Remove syringe from DOM temporarily
        newSyringe.remove();
        
        // Position syringe at the center of the shooter
        newSyringe.style.left = `${shooterCenterX - (newSyringe.offsetWidth / 2)}px`;
        newSyringe.style.top = `${shooter.offsetTop - newSyringe.offsetHeight}px`;
        
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
                    syringe.remove();
                    score += point;
                    scoreCounter.innerText = score;
                    handleHighscore();
                }
            })
            let hearts = document.querySelectorAll(".heart");
            hearts.forEach(heart => {
                if(checkSyringeCollision(syringe, heart)) {
                    heart.classList.remove("heart");
                    heart.classList.add("dead-heart");
                    syringe.remove();
                    life++;
                    lifeCounter.innerText = life;
                }
            })
            let bombs = document.querySelectorAll(".bomb");
            bombs.forEach(bomb => {
                if(checkSyringeCollision(syringe, bomb)) {
                    bomb.classList.remove("bomb");
                    bomb.classList.add("dead-bomb");
                    syringe.remove();
                    handleBomb();
                }
            })
            let stars = document.querySelectorAll(".star");
            stars.forEach(star => {
                if(checkSyringeCollision(syringe, star)) {
                    star.classList.remove("star");
                    star.classList.add("dead-star");
                    syringe.remove();
                    handleStar();
                }
            })
            let giantCovids = document.querySelectorAll(".giant-covid");
            giantCovids.forEach(giant => {
                if(checkSyringeCollisionGiant(syringe, giant)) {
                    health -=1;
                    syringe.remove();                    
                    if (health <= 0) {
                        giant.src = "img/explosion.png";
                        giant.classList.remove("giant-covid");
                        giant.classList.add("dead-covid");
                        syringe.remove();
                        score += 5*point;
                        health = 500;
                    }
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

    //COVID
    function createCovid() {
        let newCovid = document.createElement('img');
        let covidSpriteImg = covidImgs[Math.floor(Math.random() * covidImgs.length)];
        let playAreaWidth = playArea.offsetWidth;
        
        newCovid.src = covidSpriteImg;
        newCovid.classList.add('covid');
        newCovid.classList.add('covid-transition');
        newCovid.style.top = '50px';
        // Use 10-90% of play area width for spawning
        newCovid.style.left = `${Math.floor(Math.random() * (playAreaWidth * 0.8)) + (playAreaWidth * 0.1)}px`;
        playArea.appendChild(newCovid);
        moveCovid(newCovid);
    }

    function moveCovid(covidElem) {
        let moveCovidInterval = setInterval(() => {
            let xPosition = parseInt(window.getComputedStyle(covidElem).getPropertyValue('top'));
            let playAreaHeight = playArea.offsetHeight;
            
            if (xPosition >= playAreaHeight - 50) { // Leave space for grandma
                if (Array.from(covidElem.classList).includes("dead-covid")) {
                    covidElem.remove();
                    clearInterval(moveCovidInterval)
                } else {
                    covidElem.remove();
                    clearInterval(moveCovidInterval)
                    handleCollision();
                }
            } else {
                covidElem.style.top = `${xPosition + fallSpeed}px`;
            }
        }, 30)
    }

    //GIANT COVID
    function createGiantCovid() {
        let newGiantCovid = document.createElement('img');
        let playAreaWidth = playArea.offsetWidth;
        
        newGiantCovid.src = 'img/covid_2.png';
        newGiantCovid.classList.add('giant-covid');
        newGiantCovid.classList.add('covid-transition');
        newGiantCovid.style.top = '50px';
        // Use 10-90% of play area width for spawning
        newGiantCovid.style.left = `${Math.floor(Math.random() * (playAreaWidth * 0.8)) + (playAreaWidth * 0.1)}px`;
        playArea.appendChild(newGiantCovid);
        moveGiantCovid(newGiantCovid);
    }

    function moveGiantCovid(giantCovidElem) {
        let moveGiantCovidInterval = setInterval(() => {
            let xPosition = parseInt(window.getComputedStyle(giantCovidElem).getPropertyValue('top'));
            let playAreaHeight = playArea.offsetHeight;
            
            if (xPosition >= playAreaHeight - 50) { // Leave space for grandma
                if (Array.from(giantCovidElem.classList).includes("dead-covid")) {
                    giantCovidElem.remove();
                    clearInterval(moveGiantCovidInterval)
                } else {
                    giantCovidElem.remove();
                    clearInterval(moveGiantCovidInterval)
                    handleGiantCollision();
                }
            } else {
                giantCovidElem.style.top = `${xPosition + giantFallSpeed}px`;
            }
        }, 60)
    }

    //HEART
    function createHeart() {
        let newHeart = document.createElement('img');
        let playAreaWidth = playArea.offsetWidth;
        
        newHeart.src = 'img/heart.png';
        newHeart.classList.add('heart');
        newHeart.classList.add('heart-transition');
        newHeart.style.top = '50px';
        // Use 10-90% of play area width for spawning
        newHeart.style.left = `${Math.floor(Math.random() * (playAreaWidth * 0.8)) + (playAreaWidth * 0.1)}px`;
        playArea.appendChild(newHeart);
        moveHeart(newHeart);
    }

    function moveHeart(heartElem) {
        let moveHeartdInterval = setInterval(() => {
            let xPosition = parseInt(window.getComputedStyle(heartElem).getPropertyValue('top'));
            let playAreaHeight = playArea.offsetHeight;
            
            if (xPosition >= playAreaHeight - 50) { // Leave space for grandma
                if (Array.from(heartElem.classList).includes("dead-heart")) {
                    heartElem.remove();
                    clearInterval(moveHeartdInterval)
                } else {
                    heartElem.remove();
                    clearInterval(moveHeartdInterval)
                }
            } else {
                heartElem.style.top = `${xPosition + fallSpeed}px`;
            }
        }, 30)
    }

    //STAR
    function createStar() {
        let newStar = document.createElement('img');
        let playAreaWidth = playArea.offsetWidth;
        
        newStar.src = 'img/star.png';
        newStar.classList.add('star');
        newStar.classList.add('star-transition');
        newStar.style.top = '50px';
        // Use 10-90% of play area width for spawning
        newStar.style.left = `${Math.floor(Math.random() * (playAreaWidth * 0.8)) + (playAreaWidth * 0.1)}px`;
        playArea.appendChild(newStar);
        moveStar(newStar);
    }

    function moveStar(starElem) {
        let moveStarInterval = setInterval(() => {
            let xPosition = parseInt(window.getComputedStyle(starElem).getPropertyValue('top'));
            let playAreaHeight = playArea.offsetHeight;
            
            if (xPosition >= playAreaHeight - 50) { // Leave space for grandma
                if (Array.from(starElem.classList).includes("dead-star")) {
                    starElem.remove();
                    clearInterval(moveStarInterval)
                } else {
                    starElem.remove();
                    clearInterval(moveStarInterval)
                }
            } else {
                starElem.style.top = `${xPosition + fallSpeed}px`;
            }
        }, 30)
    }

    //BOMB
    function createBomb() {
        let newBomb = document.createElement('img');
        let playAreaWidth = playArea.offsetWidth;
        
        newBomb.src = 'img/bomb.png';
        newBomb.classList.add('bomb');
        newBomb.classList.add('bomb-transition');
        newBomb.style.top = '50px';
        // Use 10-90% of play area width for spawning
        newBomb.style.left = `${Math.floor(Math.random() * (playAreaWidth * 0.8)) + (playAreaWidth * 0.1)}px`;
        playArea.appendChild(newBomb);
        moveBomb(newBomb);
    }

    function moveBomb(bombElem) {
        let moveBombInterval = setInterval(() => {
            let xPosition = parseInt(window.getComputedStyle(bombElem).getPropertyValue('top'));
            let playAreaHeight = playArea.offsetHeight;
            
            if (xPosition >= playAreaHeight - 50) { // Leave space for grandma
                if (Array.from(bombElem.classList).includes("dead-bomb")) {
                    bombElem.remove();
                    clearInterval(moveBombInterval)
                } else {
                    bombElem.remove();
                    clearInterval(moveBombInterval)
                }
            } else {
                bombElem.style.top = `${xPosition + fallSpeed}px`;
            }
        }, 30)
    }

    //CHECK COLLISION
    function checkSyringeCollision(syringe, elem) {
        let syringeRect = syringe.getBoundingClientRect();
        let elemRect = elem.getBoundingClientRect();
        let playAreaRect = playArea.getBoundingClientRect();

        // Convert coordinates to be relative to play area
        let syringeTop = syringeRect.top - playAreaRect.top;
        let syringeLeft = syringeRect.left - playAreaRect.left;
        let elemTop = elemRect.top - playAreaRect.top;
        let elemLeft = elemRect.left - playAreaRect.left;

        // Check vertical collision
        if (syringeTop > 5 && syringeTop + syringeRect.height <= elemTop) {
            // Check horizontal collision
            let horizontalOverlap = !(syringeRect.right < elemRect.left || 
                                    syringeRect.left > elemRect.right);
            return horizontalOverlap;
        }
        return false;
    }

    function checkSyringeCollisionGiant(syringe, elem) {
        let syringeRect = syringe.getBoundingClientRect();
        let elemRect = elem.getBoundingClientRect();
        let playAreaRect = playArea.getBoundingClientRect();

        // Convert coordinates to be relative to play area
        let syringeTop = syringeRect.top - playAreaRect.top;
        let syringeLeft = syringeRect.left - playAreaRect.left;
        let elemTop = elemRect.top - playAreaRect.top;
        let elemLeft = elemRect.left - playAreaRect.left;

        // Check vertical collision with larger hit box for giant covid
        if (syringeTop > 5 && syringeTop + syringeRect.height <= elemTop + elemRect.height) {
            // Check horizontal collision with larger hit box
            let horizontalOverlap = !(syringeRect.right < elemRect.left - 10 || 
                                    syringeRect.left > elemRect.right + 10);
            return horizontalOverlap;
        }
        return false;
    }

    //GAME CONTROL
    function clearingIntervals () {
        clearInterval(covidCreationInterval);
        clearInterval(heartCreationInterval);
        clearInterval(bombCreationInterval);
        clearInterval(starCreationInterval);
        clearInterval(giantCovidCreationInterval);
    }

    function clearingPlayArea () {
        let covids = document.querySelectorAll(".covid");
        covids.forEach(covid => covid.remove());
        let giantCovids = document.querySelectorAll(".giant-covid");
        giantCovids.forEach(giantCovid => giantCovid.remove());
        let syringes = document.querySelectorAll(".syringe");
        syringes.forEach(syringe => syringe.remove());
        let hearts = document.querySelectorAll(".heart");
        hearts.forEach(heart => heart.remove());
        let stars = document.querySelectorAll(".star");
        stars.forEach(star => star.remove());
        let bombs = document.querySelectorAll(".bomb");
        bombs.forEach(bomb => bomb.remove());
    }

    function settingIntervals () {
        covidCreationInterval = setInterval(function () { createCovid() }, covidInterval);
        heartCreationInterval = setInterval(function () {createHeart()}, heartInterval);
        bombCreationInterval = setInterval(function () {createBomb()}, bombInterval);
        starCreationInterval = setInterval(function () {createStar()}, starInterval);
        giantCovidCreationInterval = setInterval(function () {createGiantCovid()}, giantCovidInterval);
    }

    function resumeGame (event) {
        if(event.key === "Escape") {
            startButton.style.display = 'none';
            instructions.style.display = 'none';
            window.addEventListener("keydown", letDoctorMove);
            giantFallSpeed = 1;
            fallSpeed = 2;
            settingIntervals();
            window.removeEventListener("keydown", resumeGame);
        } else {       
            startButton.style.display = 'none';
            instructions.style.display = 'none';
            window.addEventListener("keydown", letDoctorMove);
            giantFallSpeed = 1;
            fallSpeed = 2;
            settingIntervals();
            window.removeEventListener("keydown", resumeGame);
        }

    }

    function endGame () {
        window.removeEventListener("keydown", letDoctorMove);
        startButton.style.display = 'none';
        clearingIntervals();
        clearingPlayArea();
        handleHighscore();
        instructions.innerHTML = `Game Over! Your final score is ${scoreCounter.innerText}!`;
        instructions.style.display = "block";
        instructions.style.color = "red";
        startButton.style.display = "block";
    }
 
    function pauseGame (event) {
        if (event.key === "Escape") {
            event.preventDefault();
            window.removeEventListener("keydown", letDoctorMove);
            clearingIntervals();
            giantFallSpeed = 0;
            fallSpeed = 0;
            let syringes = document.querySelectorAll(".syringe");
            syringes.forEach(syringe => syringe.remove());
            instructions.innerHTML = `Paused`;
            instructions.style.display = "block";
            instructions.style.color = "red";
            instructions.insertAdjacentHTML("beforeend", `<br><button id="resume">Resume</button>` );      
            instructions.insertAdjacentHTML("beforeend", `<br><button id="end">End</button>` );
            const resumeBtn = document.querySelector("#resume");   
            const endBtn = document.querySelector("#end");
            resumeBtn.addEventListener('click', resumeGame);   
            endBtn.addEventListener('click', endGame);
            window.addEventListener("keydown", resumeGame);
        }
    }

    function gameOver() {
        window.removeEventListener("keydown", letDoctorMove);
        clearingIntervals();
        clearingPlayArea();
        handleHighscore();
        setTimeout(() => {
            instructions.innerHTML = `Game Over! The viruses made it to your Grandma. Your final score is ${scoreCounter.innerText}!`;
            instructions.style.display = "block";
            instructions.style.color = "red";
            startButton.style.display = "block";
        }, 600)
    }

    function playGame() {
        fallSpeed = 2;
        life = 3;
        score = 0;
        scoreCounter.innerText = score;
        lifeCounter.innerText = life;
        startButton.style.display = 'none';
        instructions.style.display = 'none';
        window.addEventListener("keydown", letDoctorMove);
        window.addEventListener("keydown", pauseGame);
        covidCreationInterval = setInterval(function () { createCovid() }, covidInterval);
        heartCreationInterval = setInterval(function () {createHeart()}, heartInterval);
        bombCreationInterval = setInterval(function () {createBomb()}, bombInterval);
        starCreationInterval = setInterval(function () {createStar()}, starInterval);
        giantCovidCreationInterval = setInterval(function () {createGiantCovid()}, giantCovidInterval);
    }
}
window.addEventListener("load", main);
