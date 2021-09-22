document.addEventListener('DOMContentLoaded' , () => {
    const bird=document.querySelector('.bird')
    const gameDisplay=document.querySelector('.game-container')
    const ground = document.querySelector('.ground')

    let birdLeft = 220
    let birdBottom =100
    let gravity = 2
    let isGameOver = false

    function startGame(){
        birdBottom -= gravity
        bird.style.bottom = birdBottom + 'px'
        bird.style.left = birdLeft+ 'px'
    }
    let gameTimerID=setInterval(startGame,20)

    function control(e){
        if (e.keyCode == 32){
            jump()
        }
    }

    function jump(){
        if (birdBottom < 500){
        birdBottom += 50}
        bird.style.bottom = birdBottom+'px'
    }

    document.addEventListener("keyup", control)

    function generateObstacle() {
        let obstacleLeft=500
        let randomHeight = Math.random()*60
        let obstacleBottom = randomHeight;
        const obstacle = document.createElement('div')
        if(!isGameOver)obstacle.classList.add('obstacle')
        gameDisplay.appendChild(obstacle)
        obstacle.style.left = obstacleLeft + 'px'
        obstacle.style.bottom = obstacleBottom+'px'

        function moveObstacle(){
            obstacleLeft-=2;
            obstacle.style.left=obstacleLeft+'px'

            if (obstacleLeft === -60){
                clearInterval(timerID)
                gameDisplay.removeChild(obstacle)
            }

            if (obstacleLeft > 200 && obstacleLeft <280 && birdLeft===220 || birdBottom ===0){
                gameOver()
                clearInterval(timerID)
            }
        }
        let timerID=setInterval(moveObstacle,20)
        if(!isGameOver) setTimeout(generateObstacle, 3000)
    }
    generateObstacle()

    function gameOver(){
        clearInterval(gameTimerID)
        isGameOver=true;
        document.removeEventListener('keyup', control)
    }
})