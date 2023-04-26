new p5();

const WIDTH = 600
const HEIGHT = 600
let button;
let PlayerTextWidth;
let TowerTextWidth;

function preload() {
	font = loadFont('Akaju_demo.otf');
}

function setup(){
	createCanvas(WIDTH, HEIGHT)
	textSize(40)
	textAlign(CENTER)
	textFont(font)
	PlayerTextWidth = textWidth("Player")
	TowerTextWidth = textWidth("Tower")

	// button = createButton('Player')
	// button.position(WIDTH/2, HEIGHT/2+40)
	// button.style('background-color:red')
}

function draw(){
	background("#FFF7E9")
	

	// if (mouseX >= WIDTH/2-PlayerTextWidth && mouseX <= WIDTH/2+PlayerTextWidth){
	// 	fill('#000000')
	// 	circle(mouseX, mouseY, 30)
	// 	// console.log(mouseX, mouseY)
	// 	rect(WIDTH/2-PlayerTextWidth/2, HEIGHT/2+40-20, PlayerTextWidth, 40)
	// }

	fill("#1746A2ff")
	text("What would you like", WIDTH/2, HEIGHT/3)
	text("to play as?", WIDTH/2, HEIGHT/3+40)

	

	text("Player", WIDTH/2, HEIGHT/2+40)
	text("Tower", WIDTH/2, HEIGHT/2+120)
}