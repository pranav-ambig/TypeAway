new p5();


let font
let words
let currentWord
let currentIndex = 0
let cellSize = 30
let nameSent = false
let nameToSend = ""
let ridSent = false
let rid = ""
let died = false;

const WIDTH = 600
const HEIGHT = 600


let data = []
// let socket = io.connect("http://192.168.214.161:8081")
let socket = io()
// let socket = io.connect("http://10.20.203.99:8081")

let level = {
	// coords: [[50, 50],[150, 150],[300,150], [300, 400], [500, 400], [500, 300], [100, 300], [100, 400]]
	// coords: [[100, 100], [500, 100], [500, 250], [400, 200], [200, 200], [200, 300], [100, 300], [100, 400], [300, 400], [300, 300], [400, 300], [400, 400]] 
	coords: [[50, 50], [200, 50], [200, 200], [550, 200], [550, 50], [400, 50], [400, 400], [50, 400]] 
	// coords: [[50, 250],[250, 250],[250, 400], [500, 400]]
}

function createLevelVectors(){
	let temp = []
	level.coords.forEach(e=>{
		temp.push(createVector(e[0], e[1]))
	})
	level.coords = temp;
}
createLevelVectors()


let player;
let currStage = 1


function setup(){
	createCanvas(WIDTH, HEIGHT)
	rectMode(CENTER)

}

function draw(){
	background("#FFF7E9")
	frameRate(60)
	
	if (!nameSent){
		sendName()
		return;
	}

	if (!ridSent){
		sendRid()
		return;
	}

	drawLevel()
	if (data.length > 0){
		player = data[0]
		noStroke()
		if (!player.died){
			fill("#153462")
		}
		else {
			fill("#252A34")
		}
		
		if (player.won){
			fill("#5F9DF7")
		}
		
		textSize(15)
		textAlign(CENTER)
		rect(player.pos.x, player.pos.y, cellSize, cellSize, 6)
		text(player.health.toString().replace(/0/g, "O"), player.pos.x, player.pos.y+cellSize)

		data[1].forEach(tower=>{
			fill("#FF731D")
			noStroke()
			rect(tower.pos.x, tower.pos.y, 30, 30, 6)
			textSize(15)
			textAlign(CENTER)
			text(tower.name, tower.pos.x, tower.pos.y+cellSize)
		})

		data[2].forEach(proj=>{
			noStroke()
			fill("#FF731D")
			proj.trail.forEach((b, i)=>{
				let r = map(i, 0, proj.trail.length-1, 10, 2)
				// console.log(b.x, b.y)
				circle(b[0], b[1], r)
			})
		})
		level.coords = data[3]
	}
	drawText()
	comm()
}

function sendRid(){
	//get and send Room id
	textSize(40)
	textFont(font)
	fill("#1746A2ff")
	textAlign(LEFT)
	x = (width/2)-(textWidth("Join room id:"))/2
	text("Join room id:", x, height/2-50)
	x = (width/2)-(textWidth(rid))/2
	text(rid, x, height/2)
}

function sendName(){
	// let x;
	textSize(40)
	textFont(font)
	fill("#1746A2ff")
	textAlign(LEFT)
	x = (width/2)-(textWidth("Enter your name:"))/2
	text("Enter your name:", x, height/2-50)
	x = (width/2)-(textWidth(nameToSend))/2
	text(nameToSend, x, height/2)

}

function comm(){
	socket.on("msg", d=>{
		data = d
	})
	socket.on("died", ()=>{died = true})

	socket.on("restart", ()=>{
		currentWord = random(words) +' '
		currentIndex = 0
	})
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
		socket.emit("fire", nameToSend)
		// console.log(nameToSend)
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

	// draw rid
	textSize(20);
	textAlign(CENTER)
	text("Room ID: "+rid, WIDTH/2, HEIGHT-20-4)

	// let x;
	
	// if (player){
	// 	textSize(20)
	// 	textFont(font)
	// 	// fill("#5F9DF7aa")
	// 	fill("#1746A277")
	// 	textAlign(LEFT)
	// 	x = player.pos.x-(textWidth(currentWord))/2
	// 	text(currentWord, x, player.pos.y-20)
		
	// 	fill("#1746A2ff")
	// 	text(currentWord.slice(0, currentIndex)+'', x, player.pos.y-20)
	// }




}

function keyTyped(key){

	if (!nameSent){
		if (key.key != "Enter"){

			// console.log('hit', key)
			nameToSend += key.key
		}
	}

	else if (nameSent && !ridSent){
		if (key.key != "Enter"){

			// console.log('hit', key)
			rid += key.key
		}
	}

	if (key.key === currentWord[currentIndex]){
		currentIndex += 1
	}
	
}

function keyPressed(){
	if (keyCode == BACKSPACE){
		if (!nameSent)
			nameToSend = nameToSend.slice(0, -1)
		else
			rid = rid.slice(0, -1)
	}
	else if (keyCode == ENTER){
		if (!nameSent){
			nameSent = true;
		}
		else {
			socket.emit("join-room", [rid, nameToSend])
			ridSent = true;

			socket.emit("name-event", nameToSend)
			// nameSent = true;
			currentIndex = 0;
			// rid = ""
		}
	}
}