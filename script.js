const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
let platFormGap = 0;
let score = 0;
let highScore = 0;

class Doodler {
  constructor() {
    this.context = canvas.getContext("2d");
    this.x = canvas.width / 4;
    this.y = canvas.height - 600;
    this.image = new Image();
    this.image.src = "./assets/personnage.png";
    this.prevY = this.y;
    this.width = 80;
    this.height = 80;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 0.06;
    this.jumpStrength = -4;
  }

  updatePosition() {
    this.prevY = this.y;
    this.x += this.vx;
    this.y += this.vy;
    if (this.vy > 3.5) {
      this.vy = 3.5;
    } else {
      this.vy += this.gravity;
    }

    this.checkForWrapDoodler();
    this.checkCollisionWithPlatforms();
  }

  checkForWrapDoodler() {
    if (this.x + this.width < 0) {
      this.x = canvas.width;
    } else if (this.x > canvas.width) {
      this.x = 0 - this.width;
    }
  }

  checkCollisionWithPlatforms() {
    if (this.vy <= 0) {
      return;
    }

    for (let i = 0; i < platForms.length; i++) {
      let platform = platForms[i];
      if (
        this.prevY + this.height + 20 >= platform.y &&
        this.x + this.width > platform.x &&
        this.x < platform.x + platform.width &&
        this.y + this.height > platform.y &&
        this.y < platform.y + platform.height &&
        this.prevY < platform.y
      ) {
        this.jump(platform);
      }
    }
  }

  jump(platform) {
    let newHeight = platform.y - this.height;
    if (newHeight > canvas.height / 2 - 120) {
      this.y = platform.y - this.height;
      this.vy = this.jumpStrength;
    }
  }

  moveRight() {
    this.vx += 4;
    this.image.src = "./assets/personnage.png";
  }

  moveLeft() {
    this.vx -= 4;
    this.image.src = "./assets/personnage.png";
  }

  draw() {
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Platform {
  constructor(x, y) {
    this.context = canvas.getContext("2d");
    this.image = new Image();
    this.image.src = "/assets/plateform.png";
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 20;
  }

  draw() {
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

let platForms = [];
const doodler = new Doodler();

// Aide a faire apparaitre les plateformes de maniere aleatoire
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pokeball qui tombe a la fin du jeu
var pokeball = new Image();
pokeball.src = "/assets/pokeball.png";

// Création de la classe Ball
class Ball {
  constructor(x, y, width, height, dy) {
    this.x = x;
    this.y = y;
    this.width = 350;
    this.height = 100;
    this.dy = dy;
  }

  // Méthode pour dessiner l'image
  draw() {
    ctx.drawImage(pokeball, this.x, this.y, this.width, this.height);
  }

  // Méthode pour faire tomber l'image
  fall() {
    this.y += this.dy;
  }
}

// Création de plusieurs images aléatoires
var balls = [];
for (var i = 0; i < 10; i++) {
  var x = Math.random() * canvas.width;
  var y = Math.random() * -canvas.height;
  var width = Math.random() * 100 + 50;
  var height = Math.random() * 100 + 50;
  var dy = Math.random() * 5 + 1;
  var ball = new Ball(x, y, width, height, dy);
  balls.push(ball);
}

// Fonction pour dessiner toutes les images et les faire tomber
function drawBalls() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].fall();
  }
  requestAnimationFrame(drawBalls);
}

// Personnage qui bouge avant le jeu
var img = new Image();
img.src = "/assets/personnage.png";

img.onload = function () {
  // Position de départ de l'image
  var x = canvas.width / 2 - img.width / 2;
  var y = canvas.height - img.height;

  // Vitesse de déplacement de l'image
  var dx = 2;

  // Fonction pour dessiner l'image et la faire bouger
  function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y);
    x += dx;
    if (x > canvas.width - img.width || x < 0) {
      dx = -dx;
    }
    requestAnimationFrame(drawImage);
  }
  drawImage();
};

// Menu de fin de partie
function showEndMenu() {
  document.getElementById("end-game-menu").style.display = "block";
  document.getElementById("end-game-score").innerHTML = score;
  drawBalls();

  if (highScore < score) {
    highScore = score;
  }

  document.getElementById("high-score").innerHTML = highScore;
}

function hideEndMenu() {
  document.getElementById("end-game-menu").style.display = "none";
}

// Pour commencer le jeu
function startGame() {
  document.querySelector(".start").style.display = "none";
  // On lance la boucle de jeu
  loop();
  jumpMagicarpe();
}

//Ajout des events aux touches
function addListeners() {
  document.addEventListener("keydown", function (event) {
    if (event.code === "ArrowLeft") {
      doodler.moveLeft();
    } else {
      doodler.moveRight();
    }
  });

  document.addEventListener("keyup", function (event) {
    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
      doodler.vx = 0;
    }
  });
  document.querySelector(".start").addEventListener("click", function () {
    startGame();
  });

  document.getElementById("retry").addEventListener("click", function () {
    hideEndMenu();
    resetGame();
    loop();
  });
}

//Creation des plateformes
function createPlatforms(platFormCount) {
  platFormGap = Math.round(canvas.height / platFormCount);

  for (let i = 0; i < platFormCount; i++) {
    let xpos = 0;
    do {
      xpos = randomInteger(25, canvas.width - 25 - 150);
    } while (
      xpos > canvas.width / 2 - 100 * 1.5 &&
      xpos < canvas.width / 2 + 100 / 2
    );
    let y = canvas.height / 1.5 - i * platFormGap;
    platForms.push(new Platform(xpos, y));
  }
}

//Affichage debut de la partie
function setup() {
  platForms.push(new Platform(doodler.x, doodler.y + 50));
  createPlatforms(6);
}

//Reset du jeu
function resetGame() {
  doodler.x = canvas.width / 2;
  doodler.y = canvas.height - 100;
  doodler.vx = 0;
  doodler.vy = 0;
  score = 0;
  platForms = [];
  setup();
}

//Score lors du jeu
function scoreText() {
  doodler.context.font = "20px Arial";
  doodler.context.fillStyle = "black";
  doodler.context.textAlign = "center";
  doodler.context.fillText(`Score: ${Math.round(score)}`, canvas.width / 2, 50);
}

// function to update the platforms - meaning we remove the ones which
// are not visible anymore and simultaneously we update the score
function updatePlatformsAndScore() {
  // this creates a copy of our array of platforms
  let platformsCpy = [...platForms];
  platForms = platForms.filter((platform_) => platform_.y < canvas.height);
  score += platformsCpy.length - platForms.length;
}

function loop() {
  doodler.context.clearRect(0, 0, canvas.width, canvas.height);

  if (doodler.y < canvas.height / 2 && doodler.vy < 0) {
    platForms.forEach((platform) => {
      platform.y += -doodler.vy * 3;
    });

    platForms.push(
      new Platform(
        randomInteger(25, canvas.width - 25 - 100),
        platForms[platForms.length - 2].y - platFormGap * 2
      )
    );
  }

  doodler.draw();
  doodler.updatePosition();

  platForms.forEach((platform) => {
    platform.draw();
  });

  scoreText();
  if (doodler.y > canvas.height) {
    showEndMenu();
    return;
  }

  updatePlatformsAndScore();

  requestAnimationFrame(loop);
}

addListeners();
setup();

