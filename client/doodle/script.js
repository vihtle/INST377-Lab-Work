/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  let isGameOver = false;
  const platformCount = 5;
  let startPoint = 150;
  let doodlerLeftSpace = 50;
  let doodlerBottomSpace = startPoint;
  let score = 0;
  const platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;

  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement('div');

      const {visual} = this;
      visual.classList.add('platform');
      visual.style.left = `${this.left}px`;
      visual.style.bottom = `${this.bottom}px`;
      grid.appendChild(visual);
    }
  }

  function gameOver() {
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = `${doodlerLeftSpace}px`;
    doodler.style.bottom = `${doodlerBottomSpace}px`;
  }

  function createPlatforms() {
    console.log('plat created');
    for (let i = 0; i < platformCount; i++) {
      const platformGap = 600 / platformCount;
      const newPlatformBottom = 100 + i * platformGap;
      const newPlatform = new Platform(newPlatformBottom);
      platforms.push(newPlatform);
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;
        const {visual} = platform;
        visual.style.bottom = `${platform.bottom}px`;

        if (platform.bottom < 10) {
          const firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove('platform');
          platforms.shift();
          score++;
          const newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(() => {
      doodlerBottomSpace += 20;
      doodler.style.bottom = `${doodlerBottomSpace}px`;
      if (doodlerBottomSpace > startPoint + 200) {
        fall();
        isJumping = false;
      }
    }, 30);
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = `${doodlerBottomSpace}px`;
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach((platform) => {
        if (
          (doodlerBottomSpace >= platform.bottom)
                && (doodlerBottomSpace <= (platform.bottom + 15))
                && ((doodlerLeftSpace + 60) >= platform.left)
                && (doodlerLeftSpace <= (platform.left + 85)) && !isJumping) {
          startPoint = doodlerBottomSpace;
          jump();
          isJumping = true;
        }
      });
    }, 20);
  }

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(() => {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = `${doodlerLeftSpace}px`;
      } else moveRight();
    }, 20);
  }

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(() => {
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 5;
        doodler.style.left = `${doodlerLeftSpace}px`;
      } else moveLeft();
    }, 20);
  }

  function moveStraight() {
    isGoingRight = false;
    isGoingLeft = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }

  function control(e) {
    doodler.style.bottom = `${doodlerBottomSpace}px`;
    if (e.key === 'ArrowLeft') {
      moveLeft();
    } else if (e.key === 'ArrowRight') {
      moveRight();
    } else if (e.key === 'ArrowUp') {
      moveStraight();
    }
  }

  function start() {
    console.log('started');
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      movePlatforms();
      setInterval(movePlatforms, 30);
      jump(startPoint);
      document.addEventListener('keyup', control);
    }
  }
  start();
});
