new p5();

let player
let font
let words
let currentWord
let currentIndex = 0
let cellSize = 30
let moveTimeOut = 20
const WIDTH = 600
const HEIGHT = 600


// let socket = io.connect("http://192.168.214.161:8081")
let socket = io()
// let socket = io.connect("http://10.20.203.99:8081")
let dts = [] //data to send

let levelCoords = [
	[[50, 50],[150, 150],[300,150], [300, 400], [500, 400], [500, 300], [100, 300], [100, 400]],
	[[100, 100], [500, 100], [500, 250], [400, 200], [200, 200], [200, 300], [100, 300], [100, 400], [300, 400], [300, 300], [400, 300], [400, 400]],
	[[50, 50], [200, 50], [200, 200], [550, 200], [550, 50], [400, 50], [400, 400], [50, 400]],
	[[50, 50], [50, 201], [300, 201], [300, 50], [200, 50], [200, 351], [350, 351], [450, 150], [550, 150], [551, 351]]
]

let level = {
	// coords: [[50, 50],[150, 150],[300,150], [300, 400], [500, 400], [500, 300], [100, 300], [100, 400]]
	// coords: [[100, 100], [500, 100], [500, 250], [400, 200], [200, 200], [200, 300], [100, 300], [100, 400], [300, 400], [300, 300], [400, 300], [400, 400]] 
	coords: [[50, 50], [200, 50], [200, 200], [550, 200], [550, 50], [400, 50], [400, 400], [50, 400]]
	// coords: [[50, 50], [50, 201], [300, 201], [300, 50], [200, 50], [200, 351], [350, 351], [450, 150], [550, 150], [551, 351]]  
}



function createLevelVectors(){
	let temp = []
	level.coords.forEach(e=>{
		temp.push(createVector(e[0], e[1]))
	})
	level.coords = temp;
}

createLevelVectors()
let obstacles = []
let towers = []
let currStage = 1
let towerDict = {}
let playerVel = 10
let projectileDamage = 0;

function preload() {
	font = loadFont('Akaju_demo.otf');
	words = loadStrings('words.txt', ()=>{
		currentWord = random(words)+' '
	})

	// console.log(typeof terrain, typeof terrainImg)
}

function setup(){
	createCanvas(WIDTH, HEIGHT)
	rectMode(CENTER)
	player = new Player()
	// updateProjectileDamage()
	// for (let i=0; i<1; i++){
	// 	towers.push(new Tower(random(0, width), random(0, 400)))
	// }
	// keyTyped({key: 'n'})
}

class Player{
	constructor(){
		this.health = 100
		this.pos = level.coords[0].copy()
		this.died = false
		this.won = false
		this.moving = false
		this.moveTimeOut = moveTimeOut
	}

	draw(){
		if (!this.died){
			fill("#153462")
		}
		else {
			fill("#252A34")
		}
		
		if (this.won) {
			fill("#5F9DF7")
		}
		
		rect(this.pos.x, this.pos.y, cellSize, cellSize, 6)
		textSize(15)
		textAlign(CENTER)
		
		text(this.health.toString().replace(/0/g, "O"), this.pos.x, this.pos.y+cellSize)
	}

	move(){

		// if (this.pos.x == level.coords[level.coords.length-1][0] && this.pos.y == level.coords[level.coords.length-1][1]){
		if (currStage == level.coords.length){
			socket.emit("player-won")
			this.won = true
			// console.log('won')
			return;
		}
	
		let command = level.coords[currStage]
		// console.log(level.coords[0].x)
		let vel = command.copy()
		if (this.moveTimeOut > 0 && this.moving){
			vel.sub(this.pos)
			vel.normalize()
			this.pos.add(vel.mult(1))
			this.moveTimeOut -= 1
		}
		else {
			this.moveTimeOut = moveTimeOut
			this.moving = false
		}
		// this.pos.add(vel.mult(playerVel))
		
		
		vel = command.copy()
		vel.sub(this.pos)
		if (vel.mag() < 0.5)
			currStage += 1

	}
}

class Tower{
	constructor(x, y, name){
		this.pos = createVector(x, y)
		this.name = name
		this.canFire = true;
	}

	draw(){
		fill("#FF731D")
		noStroke()
		rect(this.pos.x, this.pos.y, 30, 30, 6)
		textSize(15)
		textAlign(CENTER)
		text(this.name, this.pos.x, this.pos.y+cellSize)
	}

	fire(){
		obstacles.push(new Projectile(this.pos.x, this.pos.y))
	}
}

class Projectile{
	constructor(x, y){
		this.pos = createVector(x, y)
		// this.damage = map(20, 20, 1, obstacles.length, 1)
		this.trail = []
		this.draw2 = {func: this.draw()}
	}

	draw(){
		noStroke()
		fill("#FF731D")
		// console.log(this.trail)
		this.trail.forEach((b, i)=>{
			let r = map(i, 0, this.trail.length-1, 10, 2)
			// console.log(b.x, b.y)
			circle(b[0], b[1], r)
		})
	}

	move(){

		if (this.trail.length == 10)
      		this.trail.pop()

		let dx = player.pos.x - this.pos.x
		let dy = player.pos.y - this.pos.y
		if (abs(dx) < 10 && abs(dy) < 10){
			let index = obstacles.indexOf(this)
			obstacles.splice(index, 1)
			if (!player.won){
				player.health -= 3
				if (player.health <= 0){
					player.died = true
					player.health = 0
					socket.emit("died")
				}
			}
		}
		let d = createVector(dx, dy)
		d.normalize()
		this.pos.add(d.mult(2))

		this.trail.unshift([this.pos.x, this.pos.y])
	}
}

function updateProjectileDamage(){
	len = 0
	prev = createVector(0, 0);
	level.coords.forEach((coord)=>{
		len += prev.dist(coord)
		prev = coord
	})
	len = Math.ceil(len)
	len = Math.round(len / playerVel+2) // +2 since assuming length 5 words, player will have 60 dist 
	//added for every word including space, implying it moves 60/5 => 12 per key press 
	console.log(len)
	// projectileDamage = Math.floor(100/(len*towers.length))
	// console.log(projectileDamage)
}

function isTowerPosValid(pos){

	if (pos.y > 450)
		return false;

	let isValid = true
	
	for (let i=0; i<level.coords.length-1; i++){
		
		let curr = level.coords[i].copy()
		let next = level.coords[i+1].copy()
	
		for (let amount=0; amount <1.0; amount += 0.05){
			curr = p5.Vector.lerp(curr, next, amount)
			// curr.lerp(next, amount)
			// console.log(curr.x, curr.y)
			if (curr.dist(pos)<2*cellSize){
				isValid = false
				break;
			}
		}

	}


	return isValid;

}

function getTowerPos(){
	
	let pos = createVector(random(2*cellSize, width-cellSize), random(2*cellSize, height-cellSize))
	while (!isTowerPosValid(pos)){
		pos = createVector(random(0, width), random(0, height))
	}
	return pos

}

function testing(){
	if (isTowerPosValid(createVector(mouseX, mouseY))){
		stroke("#00ff00")
	}
	else {
		stroke("#ff0000")
	}
	strokeWeight(10)
	line(0, 0, mouseX, mouseY)
}

function draw(){
	background("#FFF7E9")
	// for (let i=0; i<WIDTH/cellSize; i++){
	// 	image(terrain, cellSize*i, 0, terrain.width, terrain.height)
	// }
	frameRate(60)
	drawLevel()
	player.draw()
	player.move()
	towers.forEach((e)=>{
		e.draw()
	})
	obstacles.forEach((e)=>{
		e.move()
		e.draw()
	})
	drawText()
	comm()

	// testing()

}

socket.on("tower-spawn", msg=>{
	if (!towerDict[msg]){
		
		let towerPos = getTowerPos()
		let tower = new Tower(towerPos.x, towerPos.y, msg)
		towers.push(tower)
		towerDict[msg] = tower;
		updateProjectileDamage()
		// socket.emit('level', level.coords)
	}
})

socket.on("fire", msg=>{
	if (towerDict[msg].canFire){
		towerDict[msg].fire()
		towerDict[msg].canFire = false;
		setTimeout(()=>{towerDict[msg].canFire = true}, 200)
	}
})


function comm(){
	
	socket.emit("msg", [player, towers, obstacles, level.coords])
	// console.log('sent', player.pos.x)
	
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
	text(currentWord, x, 500)
	
	fill("#1746A2ff")
	text(currentWord.slice(0, currentIndex)+'', x, 500)

	// text(player.moveTimeOut.toString().replace(/0/g, "O"), x, 550)
}

function restart(){
	player.won = false
	player.died = false
	currStage = 1
	currentWord = random(words)+' '
	currentIndex = 0
	player.health = 100
	player.pos = level.coords[0].copy()
	player.moving = false
	player.moveTimeOut = moveTimeOut
	obstacles = []
	towers.forEach(tower=>{
		pos = getTowerPos()
		tower.pos.x = pos.x
		tower.pos.y = pos.y
	})
}

function keyTyped(key){

	if (!player.died){
		if (key.key === currentWord[currentIndex]){
			currentIndex += 1
			if (player.moving)
				player.moveTimeOut += 10
			player.moving = true
			// player.move()
		}
	}
	// console.log(currentWord[currentIndex]== key.key)
}

function createNewLevel(){
	newLevel = {
		coords: [[50,50]]
	}
}

function keyPressed(){
	if (player.died || player.won){
		if (keyCode == ENTER){
			socket.emit("restart")
			// createNewLevel()
			level.coords = levelCoords[Math.floor(Math.random()*levelCoords.length)]
			socket.emit("level", level.coords)
			createLevelVectors()
			// console.log(level.coords)
			restart()
		}
	}
}