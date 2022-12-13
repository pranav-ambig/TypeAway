new p5();


function setup(){
	createCanvas(400, 400);
	background(220);
}
let x = createVector(100, 200)
let y = createVector(50, 150)
let z = p5.Vector.sub(x, y)
let n = p5.Vector(0, 0)
function draw(){
	stroke("#000000")
	strokeWeight(10)
	line(0, 0, x.x, x.y)
	line(0, 0, y.x, y.y)
	line(y.x, y.y, z.x, z.y)
}


// console.log(x)
