new p5();

let player
let font
let words
let currentWord
let currentIndex = 0
let cellSize = 30


let level = {
	coords: [[50, 100],[450, 100],[450, 300], [250, 300], [250, 400], [400,400]]
	// coords: [[50, 250],[250, 250],[250, 400], [500, 400]]
}

let temp = []

level.coords.forEach(e=>{
	temp.push(createVector(e[0], e[1]))
})
level.coords = temp;

let towerSpawnable = []

for (let i=0; i<level.coords.length; i++){
	
}

// console.log(level.coords)


let obstacles = []
let towers = []
let currStage = 1


function setup(){
	createCanvas(600, 600)
	rectMode(CENTER)
	player = new Player()
	for (let i=0; i<1; i++){
		towers.push(new Tower(random(0, width), random(0, 400)))
	}
	// keyTyped({key: 'n'})
}
class Player{
	constructor(){
		this.health = 100
		this.pos = level.coords[0].copy()
	}

	draw(){
		fill("#153462")
		rect(this.pos.x, this.pos.y, cellSize, cellSize, 6)
	}

	move(){
		let command = level.coords[currStage]
		// console.log(level.coords[0].x)
		
		let vel = command.copy()
		vel.sub(this.pos)
		vel.normalize()
		this.pos.add(vel.mult(10))
		console.log(vel.x, vel.y)
		
		vel = command.copy()
		vel.sub(this.pos)
		if (vel.mag()<10)
			currStage += 1

		// if (this.pos.x == command.x && this.pos.y == command.y){
		// 	currStage += 1
		// }
	}
}


class Tower{
	constructor(x, y){
		this.pos = createVector(x, y)
	}

	draw(){
		fill("#FF731D")
		noStroke()
		rect(this.pos.x, this.pos.y, 30, 30, 6)
	}

	fire(){
		obstacles.push(new Projectile(this.pos.x, this.pos.y))
	}
}

class Projectile{
	constructor(x, y){
		this.pos = createVector(x, y)
		// this.ind = i
		// this.s = 0;
	}

	draw(){
		noStroke()
		fill("#FF731D")
		circle(this.pos.x, this.pos.y, 15)
	}

	move(){
		let dx = player.pos.x - this.pos.x
		let dy = player.pos.y - this.pos.y
		if (abs(dx) < 10 && abs(dy) < 10){
			let index = obstacles.indexOf(this)
			obstacles.splice(index, 1)
		}
		let d = createVector(dx, dy)
		d.normalize()
		this.pos.add(d.mult(2))
	}
}

function getTowerPos(){
	let p = random(1, level.coords.length-2)
	let p2 = random([1, -1])

	p2 = level.coords[p+p2]
	p = level.coords[p]
}



function draw(){
	background("#FFF7E9")
	frameRate(60)
	drawLevel()
	player.draw()
	towers.forEach((e)=>{
		e.draw()
	})
	obstacles.forEach((e)=>{
		e.move()
		e.draw()
	})
	drawText()
}

function drawLevel(){
	// console.log(level.coords.length)
	for (let i=0; i<level.coords.length -1; i++){
		// fill("#ff000055")
		stroke("#FFA1A1")
		strokeWeight(cellSize*1.5)
		// let x = level.coords[i+1][0]-level.coords[i][0]
		// let y = level.coords[i+1][1]-level.coords[i][1]
		// rect(level.coords[i][0]+x/2, level.coords[i][1]+y/2, map(x, 0, width, cellSize, width), map(y, 0, height, cellSize, height), 6)
		line(level.coords[i].x, level.coords[i].y, level.coords[i+1].x, level.coords[i+1].y)
	}
	noStroke();
	
}

function preload() {
	font = loadFont('Akaju_demo.otf');
	words = loadStrings('words.txt', ()=>{
		currentWord = random(words)+' '
	})
}

function drawText(){

	if (!currentWord)
		return
	if (currentIndex == currentWord.length){
		currentWord = random(words)+' '
		currentIndex = 0
		
	}

	let x;
	textSize(60)
	textFont(font)
	fill("#5F9DF788")
	textAlign(LEFT)
	x = (width/2)-(textWidth(currentWord))/2
	text(currentWord, x, 550)
	
	fill("#1746A2ff")
	text(currentWord.slice(0, currentIndex)+'', x, 550)


}

function keyTyped(key){
	if (key.key === currentWord[currentIndex]){
		currentIndex += 1
		player.move()
	}
	// console.log(currentWord[currentIndex]== key.key)
}

function keyPressed(){
	if (keyCode == ESCAPE){
		random(towers).fire()
	}
	else if (keyCode == LEFT_ARROW){
		
	}
}