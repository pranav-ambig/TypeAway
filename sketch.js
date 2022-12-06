trailLength = 10
let x = []
class ball {
  constructor(x, y, xv, yv, color3, r) {
    this.x = x
    this.y = y
    this.xv = xv
    this.yv = yv
    this.color = [color3[0], color3[1], color3[2]]
    this.r = r
    this.trail = []
  }

  draw() {
    this.move()
    // console.log(this.trail)
    this.trail.forEach((b, i) => {
      let a = map(i, 0, this.trail.length - 1, 1, 255)
      let r = map(i, 0, this.trail.length - 1, 2, this.r)
      // console.log(this.trail.length)
      fill(this.color[0], this.color[1], this.color[2], a)
      noStroke()
      circle(b[0], b[1], r)
    })
  }

  move() {

    if (this.trail.length == trailLength)
      this.trail.shift()

    this.x += this.xv
    this.y += this.yv
    if (this.x + this.r >= width) {
      this.xv = -this.xv
    }
    if (this.x - this.r <= 0) {
      this.xv = -this.xv
    }
    if (this.y + this.r >= height) {
      this.yv = -this.yv
    }
    if (this.y - this.r <= 0) {
      this.yv = -this.yv
    }

    this.trail.push([this.x, this.y, this.r])
  }
}

class Player extends ball {
  constructor() {
    super(width * 0.5, height * 0.7, 0, 0, [0, 0, 0], 15)
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.xv = -4
      this.yv = 0
    }
    else if (keyIsDown(RIGHT_ARROW)) {
      this.xv = 4
      this.yv = 0
    }

    if (keyIsDown(UP_ARROW)) {
      this.yv = -4
      this.xv = 0
    }
    else if (keyIsDown(DOWN_ARROW)) {
      this.yv = 4
      this.xv = 0
    }
    super.move()
  }

}

let player;

class Obstacle extends ball {
  constructor(x, y, xv, yv, color3, r) {
    super(x, y, xv, yv, color3, r)
    this.dis2 = 0;
  }

  move() {
    if (abs(this.xv) > 8 || abs(this.yv) > 8){
      x.splice(x.indexOf(this), 1);

    }
    let dx = player.x - this.x
    let dy = player.y - this.y
    this.dis2 = sqrt(dx*dx + dy*dy);
    // console.log(this.xv)
    // if (dis2 == 0)
    //   dis2 = 0.1;
    // let F = 1/dis2;
    let ang = atan(dy/dx);
    // let fx = F*cos(ang);
    // let fy = F*sin(ang);

    this.xv += dx*0.0005;
    this.yv += dy*0.0005;
    super.move()
  }

  draw(){
    let idk = round(map(this.dis2, 0, width, 0, 120))
    // console.log(idk);
    let c2 = color(`hsba(${idk}, 70%, 100%, 255)`)
    this.color = [red(c2), green(c2), blue(c2)];
    super.draw()
  }

}

function setup() {
  createCanvas(600, 600);
  // x.push(new player())
  player = new Player();
  for (let i = 0; i < 1; i++) {
    x.push(new Obstacle(random(0, width - 20), random(0, height - 20), 1, 1, [0, 0, 0], 10))
  }
}

function keyTyped() {
  if (key == ' ') {
    trailLength += 10
  }
  else if (key == 'a')
    x.push(new Obstacle(random(0, width - 20), random(0, height - 20), 1, 1, [0, 0, 0], 10))
}

function draw() {
  background(220);
  x.forEach((b, i) => {
    b.draw()
  })
  player.draw()
}