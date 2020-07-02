//-----------------------Global Var---------------------//

let enemyCounter = 0;
const bulletObj = {};
const deltaT = 16;

const player = {
  oldX: 500,
  oldY: 500,
  x: 500,
  y: 500,
  width: 18,
  height: 29,
  live: 10,
  origin: { x: 500, y: 500 },
  place: "diningRoom",
  image: new Image(),
  spriteCount: 0,
};

player.image.src = "./img/characters/fsprite.png";

const house = {};
const imgObj = {};
const keys = {};

let bulletId = 0;
let walk = false;
let gameStatus = false;
const enemies = {
  livingRoom: {
    number: 5,
    x: [66, 60, 226, 362, 340],
    y: [658, 876, 888, 960, 696],
    enemiesEl: {},
  },
  diningRoom: {
    number: 3,
    x: [60, 60, 342],
    y: [530, 274, 282],
    enemiesEl: {},
  },
  kitchen: {
    number: 3,
    x: [662, 662, 580],
    y: [366, 108, 228],
    enemiesEl: {},
  },
  studio: {
    number: 3,
    x: [540, 448, 448],
    y: [786, 924, 708],
    enemiesEl: {},
  },
  storageRoom: {
    number: 3,
    x: [862, 974, 882],
    y: [184, 340, 48],
    enemiesEl: {},
  },
  bedRoom: {
    number: 1,
    x: [950],
    y: [710],
    enemiesEl: {},
  },
  bathroom: {
    number: 1,
    x: [390],
    y: [50],
    enemiesEl: {},
  },
};
//--------------------CANVAS---------------------------//

const canvasEl = document.createElement("canvas");

canvasEl.width = 1200;
canvasEl.height = 800;
canvasEl.id = "myCanvas";
canvasEl.style.display = "none";

document.querySelector(".container").appendChild(canvasEl);

const ctx = canvasEl.getContext("2d");
ctx.fillStyle = "beige";
ctx.fillRect(0, 0, 1200, 800);
//---------------------------Stop----------------------//

const button = document.createElement("button");
button.style.display = "none";
button.innerText = "stop/start";
const stop = () => {
  gameStatus = !gameStatus;
};
button.addEventListener("click", stop);
document.querySelector(".container").appendChild(button);
//--------------------buttons----//

displayCanvas = () => {
  const msg = document.querySelector(".msg");
  msg.style.display = "none";
  canvasEl.style.display = "block";
  button.style.display = "block";
  gameStatus = true;
  healthBarCont.style.display = "block";
  displayHealth();
};

showMsg = () => {
  const legend = document.querySelector(".legend");
  legend.style.display = "none";
  const msg = document.createElement("div");
  msg.classList = "msg";
  msg.innerText = msgText.msg1;

  const container = document.querySelector(".container");
  container.appendChild(msg);

  const play = document.createElement("h1");
  play.innerText = "Play";
  play.classList = "play";
  msg.appendChild(play);
  play.addEventListener("click", displayCanvas);
};
const enterButton = document.querySelector("button");
enterButton.addEventListener("click", showMsg);

//--------------------------Health bar--------------------//
const healthBarCont = document.createElement("div");
const healthBar = document.createElement("div");

const displayHealth = () => {
  const container = document.querySelector(".container");
  const healthText = document.createElement("p");
  healthText.innerText = "Player life";

  healthBarCont.style.width = 100 + "px";
  healthBarCont.style.marginTop = 50 + "px";
  healthBarCont.style.height = 50 + "px";
  healthBarCont.style.border = "2px solid black";
  healthBarCont.style.backgroundColor = "	#bae1ff";

  healthBar.style.height = 50 + "px";
  healthBar.style.backgroundColor = "blue";
  healthBarCont.appendChild(healthBar);
  healthBarCont.appendChild(healthText);
  container.appendChild(healthBarCont);
};
const updateHealth = () => {
  // console.log("LIVE", player.live);
  // console.log((200 * player.live) / 10);
  healthBar.style.width = (100 * player.live) / 10 + "px";
};

//---------------------------CLASSES-----------------------//

class Enemy {
  constructor(
    id,
    x,
    y,
    widthOfSprite,
    heightOfSingleEnemy,
    deltax,
    deltay,
    imgUrl,
    imgYPos
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.widthOfSprite = widthOfSprite;

    this.heightOfSingleEnemy = heightOfSingleEnemy;
    this.deltay = deltax;
    this.deltax = deltay;
    this.oldX;
    this.oldY;
    this.img = document.createElement("img");
    this.img.src = imgUrl;
    this.direction;
    this.countEnemy = 0;
    this.imgFrameNumberX = 0;
    this.totalNumberOfFramesX = 3;
    this.imgFrameNumberX = 0;
    this.imgFrameNumberY;
    this.widthOfSingleEnemy = this.widthOfSprite / this.totalNumberOfFramesX;
  
    this.imgYPos = imgYPos;
  }

  update() {
    this.oldX = this.x;
    this.oldY = this.y;
    this.x = this.x - ((this.x - player.x) * deltaT) / 1000;
    this.y = this.y - ((this.y - player.y) * deltaT) / 1000;

    if (this.oldX < this.x) {
      this.direction = "right";
    } else {
      this.direction = "left";
    }
    if (this.oldY > this.y) {
      this.direction = "up";
    } else {
      this.direction = "down";
    }
  }

  draw() {
    this.countEnemy++;
    if (this.countEnemy == 8){
      this.imgFrameNumberX++;

      this.countEnemy = 0;
    }

    this.imgFrameNumberX = this.imgFrameNumberX % this.totalNumberOfFramesX;

    if (this.direction == "down") {
      this.imageFrameNumberY = this.imgYPos;
    }
    if (this.direction == "left") {
      this.imageFrameNumberY =this.imgYPos+ this.heightOfSingleEnemy;
    }
    if (this.direction == "right") {
      this.imageFrameNumberY = this.imgYPos+this.heightOfSingleEnemy * 2;
    }
    if (this.direction == "up") {
      this.imageFrameNumberY =this.imgYPos+ this.heightOfSingleEnemy * 3;
    }
    // console.log(imageFrameNumberY);

    const x = this.x - player.x + player.origin.x;
    const y = this.y - player.y + player.origin.y;

    ctx.drawImage(
      this.img,
      this.imgFrameNumberX * this.widthOfSingleEnemy,
      this.imageFrameNumberY,
      this.widthOfSingleEnemy,
      this.heightOfSingleEnemy,
      x,
      y,
      this.widthOfSingleEnemy,
      this.widthOfSingleEnemy
    );
  }

  hittingPlayer() {
    if (
      Math.abs(this.x - player.x) <= player.width &&
      Math.abs(this.y - player.y) <= player.width
    ) {
      player.live -= 0.01;
    }
  }
}

class Bullet {
  constructor(x, y, w, h, id, direction = "right") {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.id = id;
    this.direction = direction;
  }
  update() {
    if (this.direction === "right") {
      this.x = this.x + 10;
    }
    if (this.direction === "left") {
      this.x = this.x - 10;
    }
    if (this.direction === "down") {
      this.y = this.y + 10;
    }
    if (this.direction === "up") {
      this.y = this.y - 10;
    }
    if (
      Math.abs(this.x - player.x) > 100 ||
      Math.abs(this.y - player.y) > 100
    ) {
      delete bulletObj[this.id];
    }
  }
  draw() {
    ctx.fillStyle = "red";

    ctx.fillRect(
      this.x - player.x + player.origin.x,
      this.y - player.y + player.origin.y,
      this.width,
      this.height
    );
  }

  shootingEnemies() {
    const enemyOb = enemies[player.place].enemiesEl;
    for (const key in enemyOb) {
      if (
        Math.abs(this.x - enemyOb[key].x) <= enemyOb[key].widthOfSingleEnemy &&
        Math.abs(this.y - enemyOb[key].y) <= enemyOb[key].heightOfSingleEnemy
      ) {
        delete enemyOb[key];
      }
    }
  }
}

class Ornament {
  constructor(x, y, width, height, color = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
  draw() {
    let x = this.x - player.x + player.origin.x;
    let y = this.y - player.y + player.origin.y;

    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.width, this.height);
  }

  checkCollisionPlayer() {
    // console.log(this.direction)

    if (
      player.x + player.width - 30 > this.x && //right
      player.y + 15 < this.y + this.height && //up
      player.x + 30 < this.x + this.width && //left
      player.y + player.height > this.y //down
    ) {
      player.x = player.oldX;
      player.y = player.oldY;
    }
  }
  checkCollisionEnemy() {
    const enemyOb = enemies[player.place].enemiesEl;
    //  console.log("enemyObj", enemies[player.place].enemiesEl);
    // console.log(this.direction)
    for (const key in enemyOb) {
      if (
        enemyOb[key].x + enemyOb[key].width > this.x &&
        enemyOb[key].y < this.y + this.height &&
        enemyOb[key].x < this.x + this.width &&
        enemyOb[key].y + enemyOb[key].width > this.y
      ) {
        enemyOb[key].x = enemyOb[key].oldX;
        enemyOb[key].y = enemyOb[key].oldY;
      }
    }
  }
  checkCollisionBullet() {
    // console.log(this.direction)
    for (const key in bulletObj) {
      if (
        bulletObj[key].x + bulletObj[key].width > this.x &&
        bulletObj[key].y < this.y + this.height &&
        bulletObj[key].x < this.x + this.width &&
        bulletObj[key].y + bulletObj[key].width > this.y
      ) {
        //console.log('mama');
        delete bulletObj[key];
      }
    }
  }
}

class Img extends Ornament {
  constructor(x, y, width, height, color = null, imgUrl) {
    super(x, y, width, height, (color = null));
    this.img = document.createElement("img");
    this.imgUrl = imgUrl;
  }

  draw() {
    this.img.src = this.imgUrl;
    let x = this.x - player.x + player.origin.x;
    let y = this.y - player.y + player.origin.y;

    ctx.drawImage(this.img, x, y, this.width, this.height);
  }
}

class Floor {
  constructor(x, y, w, h, imgUrl) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = document.createElement("img");
    this.img.src = imgUrl;
  }
  draw() {
    let x = this.x - player.x + player.origin.x;
    let y = this.y - player.y + player.origin.y;

    ctx.drawImage(this.img, x, y, this.w, this.h);
  }
}
//------------------------PLayer------------------------------------//

const checkingPosition = () => {
  if (player.x + player.width / 2 < 400 && player.y + player.height / 2 < 200) {
    player.place = "bathroom";
  }
  if (
    player.x + player.width / 2 < 400 &&
    player.y + player.height / 2 > 200 &&
    player.y + player.height / 2 < 600
  ) {
    player.place = "diningRoom";
  }
  if (player.x + player.width / 2 < 400 && player.y + player.height / 2 > 600) {
    player.place = "livingRoom";
  }
  if (
    player.x + player.width / 2 > 400 &&
    player.x + player.width / 2 < 700 &&
    player.y + player.height / 2 < 400
  ) {
    player.place = "kitchen";
  }
  if (
    player.x + player.width / 2 > 400 &&
    player.x + player.width / 2 < 700 &&
    player.y + player.height / 2 > 600
  ) {
    player.place = "studio";
  }
  if (player.x + player.width / 2 > 700 && player.y + player.height / 2 < 400) {
    player.place = "storageRoom";
  }
  if (player.x + player.width / 2 > 700 && player.y + player.height / 2 > 600) {
    player.place = "bedRoom";
  }
};
let imgFrameNumberX = 0;

const totalNumberOfFramesX = 4;

const widthOfImage = 256;
const heightOfImage = 64;
const widthOfSingleImage = widthOfImage / totalNumberOfFramesX;
player.width = widthOfSingleImage;
player.height = heightOfImage;

const makingPlayer = () => {
  player.spriteCount++;
  if (player.spriteCount % 8 == 0) {
    imgFrameNumberX++;
    player.spriteCount = 0;
  }
  let imageFrameNumberY = 0;

  if (imgFrameNumberX == totalNumberOfFramesX) {
    imgFrameNumberX = 0;
  }

  console.log(8 % 15);

  if (keys.direction == "down") {
    imageFrameNumberY = 0;
  }
  if (keys.direction == "left") {
    imageFrameNumberY = 64;
  }
  if (keys.direction == "right") {
    imageFrameNumberY = 128;
  }
  if (keys.direction == "up") {
    imageFrameNumberY = 192;
  }

  ctx.drawImage(
    player.image,
    imgFrameNumberX * widthOfSingleImage,
    imageFrameNumberY,
    widthOfSingleImage,
    heightOfImage,
    player.origin.x,
    player.origin.y,
    widthOfSingleImage,
    heightOfImage
  );
};
const movingKeysArr = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const moving = () => {
  player.oldX = player.x;
  player.oldY = player.y;
  if (keys["ArrowRight"]) {
    player.x = player.x + 2;
    keys.direction = "right";
  }
  if (keys["ArrowLeft"]) {
    player.x = player.x - 2;
    keys.direction = "left";
  }
  if (keys["ArrowDown"]) {
    player.y = player.y + 2;
    keys.direction = "down";
  }
  if (keys["ArrowUp"]) {
    player.y = player.y - 2;
    keys.direction = "up";
  }
};

const playerMoving = (e) => {
  movingKeysArr.forEach((val) => {
    if (e.code === val) {
      e.preventDefault();
    }
  });
  // console.log(e.type);
  if (e.type === "keydown") {
    keys[e.code] = true;
    //  console.log(keys);
  }
  if (e.type === "keyup") {
    keys[e.code] = false;
  }
};
const dying = () => {
  if (player.live < 0) {
    gameStatus = false;
    alert("sorry, you are dead");
  }
};

window.addEventListener("keydown", playerMoving);
window.addEventListener("keyup", playerMoving);

//----------------------CallingGameCharacters-------------------------//
const floorArr = [];
const doorArrx = [400, 150, 150, 400, 550, 500, 700, 800, 700, 800];
const doorArry = [50, 200, 600, 750, 400, 600, 150, 400, 600, 600];
const doorArrW = [10, 100, 100, 10, 100, 150, 10, 100, 10, 100];
const doorArrH = [100, 10, 10, 100, 10, 10, 100, 10, 100, 10];

(function makingFloor() {
  const livFloor = new Floor(10, 600, 400, 400, "./img/floor/floor6.jpg");
  floorArr.push(livFloor);
  const dinFloor1 = new Floor(10, 200, 400, 400, "./img/floor/floor6.jpg");
  floorArr.push(dinFloor1);
  const dinFloor2 = new Floor(400, 400, 600, 200, "./img/floor/floor6.jpg");
  floorArr.push(dinFloor2);
  const studio = new Floor(400, 600, 300, 400, "./img/floor/carpet4.png");
  floorArr.push(studio);
  const bath = new Floor(10, 10, 400, 200, "./img/floor/tiles2.jpeg");
  floorArr.push(bath);
  const kitchen = new Floor(400, 10, 300, 400, "./img/floor/floor5.jpg");
  floorArr.push(kitchen);
  const storage = new Floor(700, 10, 300, 400, "./img/floor/carpet6.png");
  floorArr.push(storage);
  const bed = new Floor(700, 600, 300, 400, "./img/floor/carpet6.png");
  floorArr.push(bed);
  for (let i = 0; i < doorArrx.length; i++) {
    floorArr.push(
      new Floor(
        doorArrx[i],
        doorArry[i],
        doorArrW[i],
        doorArrH[i],
        "./img/floor/tiles1.jpg"
      )
    );
  }
})();

//-calling enemies----//
const enemyImages = [
  "./img/characters/batsheet.png",
  "./img/monkssheet.png",
  "./img/characters/gostSprite.png",
  "./img/characters/golemSprite.png",
  "./img/characters/skullsheet.png",
  "./img/characters/skullsheet.png",
];
const enemySpriteWidth = [144, 144, 134, 138, 144, 144];
const enemyImgHeight = [48, 48, 46.75, 48.75, 48, 48];

const enemyImgYPos = [0, 0, 0,0, 0, 48*4];


const callingEnemies = () => {
  const currentRoom = enemies[player.place];
  enemyCounter += 0.01;
  if (Math.floor(enemyCounter) % 2 == 0) {
    if (Object.values(currentRoom.enemiesEl).length < currentRoom.number) {
      const i = Math.floor(Math.random() * currentRoom.x.length);
      const enemyIndex = Math.floor(Math.random() * enemyImages.length);
      currentRoom.enemiesEl[enemyCounter] = new Enemy(
        enemyCounter,
        currentRoom.x[i],
        currentRoom.y[i],
        enemySpriteWidth[enemyIndex],
        enemyImgHeight[enemyIndex],

        1,
        1,
        enemyImages[enemyIndex],
        enemyImgYPos[enemyIndex]
      );
    }
  }
};

//---calling bullets---//
const callingBalls = (e) => {
  if (e.code === "KeyX") {
    bulletId = bulletId + 1;
    let bullet = new Bullet(
      player.x + player.width / 2,
      player.y + player.height / 2,
      5,
      5,
      bulletId,
      keys.direction
    );
    bulletObj[bulletId] = bullet;
  }
};

//---calling house---//
const xArr = [
  0,
  0,
  1000,
  0,
  400,
  400,
  250,
  0,
  400,
  400,
  250,
  0,
  400,
  400,
  700,
  650,
  400,
  700,
  700,
  700,
  900,
  650,
  700,
  900,
];
const yArr = [
  0,
  1000,
  0,
  0,
  850,
  600,
  600,
  600,
  400,
  200,
  200,
  200,
  150,
  0,
  700,
  600,
  600,
  250,
  0,
  600,
  600,
  400,
  400,
  400,
];
const wArr = [
  10,
  1000,
  10,
  1000,
  10,
  10,
  150,
  150,
  150,
  10,
  150,
  150,
  10,
  10,
  10,
  100,
  100,
  10,
  10,
  100,
  100,
  150,
  100,
  100,
];
const hArr = [
  1000,
  10,
  1000,
  10,
  150,
  150,
  10,
  10,
  10,
  200,
  10,
  10,
  50,
  50,
  300,
  10,
  10,
  150,
  150,
  10,
  10,
  10,
  10,
  10,
];

for (let i = 0; i < xArr.length; i++) {
  house[`wall${i}`] = new Ornament(
    xArr[i],
    yArr[i],
    wArr[i],
    hArr[i],
    "#432c19"
  );
}

//-ornaments-----//
const imgX = [
  930,
  750,
  630,
  550,
  415,
  410,
  10,
  175,
  10,
  170,
  325,
  680,
  100,
  10,
  100,
  200,
  570,
  450,
  480,
  410,
  410,
  710,
  910,
  710,
  780,
  950,
  660,
];
const imgY = [
  615,
  800,
  900,
  920,
  970,
  610,
  710,
  920,
  910,
  750,
  610,
  740,
  300,
  70,
  14,
  10,
  10,
  10,
  350,
  230,
  150,
  10,
  10,
  310,
  210,
  350,
  410,
];
const imgW = [
  60,
  200,
  70,
  60,
  50,
  70,
  70,
  150,
  100,
  100,
  70,
  20,
  200,
  60,
  50,
  150,
  130,
  120,
  70,
  70,
  70,
  150,
  100,
  100,
  50,
  50,
  120,
];
const imgH = [
  40,
  200,
  100,
  70,
  30,
  50,
  150,
  70,
  100,
  100,
  70,
  100,
  200,
  60,
  50,
  70,
  50,
  50,
  50,
  170,
  80,
  70,
  90,
  90,
  50,
  50,
  50,
];
const imgUrl = [
  "./img/comoda.png",
  "./img/bed1.png",
  "./img/table2.png",
  "./img/sofa2.png",
  "./img/books1.png",
  "./img/comoda.png",
  "./img/sofa4.png",
  "./img/sofa5.png",
  "./img/plant1.png",
  "./img/cofeetable1.png",
  "./img/redchair.png",
  "./img/tv2.png",
  "./img/dining1.png",
  "./img/toilet.png",
  "./img/lavabo.png",
  "./img/bath.png",
  "./img/sink1.png",
  "./img/table3.png",
  "./img/stove1.png",
  "./img/table5.png",
  "./img/washing1.png",
  "./img/coach1.png",
  "./img/box3.png",
  "./img/box4.png",
  "./img/mirror1.png",
  "./img/paper2.png",
  "./img/coach2.png",
];
for (let i = 0; i < imgX.length; i++) {
  imgObj[i] = new Img(imgX[i], imgY[i], imgW[i], imgH[i], null, imgUrl[i]);
}

//----------event listener for bullets-//

window.addEventListener("keydown", callingBalls);

//---------------------------Set Interval---------------------------//

const loop = () => {
  if (!gameStatus) {
    return;
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1200, 800);

  floorArr.forEach((floor) => {
    floor.draw();
  });

  for (const key in enemies[player.place].enemiesEl) {
    const enemyOb = enemies[player.place].enemiesEl[key];
    enemyOb.update();
    enemyOb.draw();
    enemyOb.hittingPlayer();
  }

  const bulletArr = Object.values(bulletObj);

  bulletArr.forEach((bullet) => {
    bullet.update();

    bullet.shootingEnemies();
    bullet.draw();
  });
  for (const key in house) {
    house[key].checkCollisionPlayer();
    house[key].checkCollisionEnemy();
    house[key].checkCollisionBullet();
  }
  for (const key in imgObj) {
    imgObj[key].checkCollisionPlayer();
    imgObj[key].checkCollisionEnemy();
    imgObj[key].checkCollisionBullet();
    imgObj[key].draw();
  }

  for (const key in house) {
    house[key].draw();
  }

  callingEnemies();
  moving();
  checkingPosition();
  makingPlayer();
  dying();
  updateHealth();
};

setInterval(loop, deltaT);
