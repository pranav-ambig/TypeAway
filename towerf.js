new p5();


let font
let words
let currentWord
let currentIndex = 0
let cellSize = 30
let nameSent = false
let nameToSend = ""
let died = false;


let data = []
let socket = io.connect("http://192.168.214.161:8081")
// let socket = io.connect("http://10.20.203.99:8081")

let level = {
	// coords: [[50, 50],[150, 150],[300,150], [300, 400], [500, 400], [500, 300], [100, 300], [100, 400]]
	// coords: [[100, 100], [500, 100], [500, 250], [400, 200], [200, 200], [200, 300], [100, 300], [100, 400], [300, 400], [300, 300], [400, 300], [400, 400]] 
	coords: [[50, 50], [200, 50], [200, 200], [550, 200], [550, 50], [400, 50], [400, 400], [50, 400]] 
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


let currStage = 1


function setup(){
	createCanvas(600, 600)
	rectMode(CENTER)
	// inp = createInput()
	// inp.position(400, 0)
	// button = createButton("Play")
	// button.position(inp.x + inp.width, 0)
	// button.mousePressed(()=>{
	// 	socket.emit("name-event", inp.value())
	// })

}

function draw(){
	background("#FFF7E9")
	frameRate(60)
	
	if (!nameSent){
		sendName()
		return;
	}

	drawLevel()
	if (data.length > 0){
		let p = data[0]
		noStroke()
		if (!p.died){
			fill("#153462")
		}
		else {
			fill("#252A34")
		}
		
		if (p.won){
			fill("#5F9DF7")
		}
		
		textSize(15)
		textAlign(CENTER)
		rect(p.pos.x, p.pos.y, cellSize, cellSize, 6)
		text(p.health.toString().replace(/0/g, "O"), p.pos.x, p.pos.y+cellSize)

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
	}
	drawText()
	comm()
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


}

function keyTyped(key){

	if (!nameSent){
		nameToSend += key.key
	}

	if (key.key === currentWord[currentIndex]){
		currentIndex += 1
	}
	
}

function keyPressed(){
	if (keyCode == BACKSPACE){
		nameToSend = nameToSend.slice(0, -1)
	}
	else if (keyCode == ENTER){
		socket.emit("name-event", nameToSend)
		nameSent = true;
		currentIndex = 0;
	}
}