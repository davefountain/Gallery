let paused = false;
let arrow;
let dim;
let fillc = "rgb(67,67,67)";
let rv = 10;
function keyPressed()    {if (key == " ") {if (paused) {loop();} else {noLoop();} paused=!paused;}}

function setup() {
    dim = 650/2;
    createCanvas(dim*2, dim*2);
    colorMode(HSL, 359, 100, 100);
    angleMode(DEGREES);
    imageMode(CENTER);
    background(0);
    noStroke();
    arrow = createVector(0, dim-50);
}

function draw() {
    let i = get();
    i.filter(DILATE);
    let t = map(mouseY, 0, height, 0, 100);
    tint(t);
    image(i, dim, dim , dim*2-10, dim*2-10);
    translate(dim,dim);
    arrow.rotate(rv);
    fill((arrow.heading()+180+frameCount*4) %360, 100, 50);
    let size = map(mouseX, 0, width, 10, 80);
    circle(arrow.x, arrow.y, size);
    fill(fillc);
    circle(arrow.x, arrow.y, size-10);
}