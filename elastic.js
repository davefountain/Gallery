let NUM_BALLS = 30;
let TOTAL_ENERGY;
let SHOW_MOM = false;
let BALLS = [];
let M_START;
let palette = ["#242853","#713b6e","#b85372","#ec7c68","#ffb65d", "#f9f871"];
class Ball {
    constructor(id, x, y, vx, vy, r) {
        this.pos = createVector(x, y);
        this.vel = createVector(vx, vy);
        this.r = r;
        this.id = id;
        this.mass = PI * sq(r);
        this.color = color(random(palette));
    }
    energy() {
        return 0.5 * this.mass * sq(this.vel.mag());
    }
    momentum() {
        return p5.Vector.mult(this.vel, this.mass);
    }
    update() {
        this.pos.add(this.vel);
        var x = wrap(this.pos.x, -this.r, width+this.r);
        var y = wrap(this.pos.y, -this.r, height+this.r);
        this.pos.set(x, y);
    }
    show() {
        push();
        stroke("black");
        fill(this.color);
        strokeWeight(2);
        circle(this.pos.x, this.pos.y, this.r * 2);
        pop();
    }
    showMomentum() {
        push();
        stroke(this.color);
        strokeWeight(3);
        let p = this.momentum().mult(0.01);
        translate(M_START.x, M_START.y);
        line(0, 0 ,p.x, p.y);
        M_START.add(p);
        pop();
    }
}
function wrap(n, min, max) {
    let divisor = max - min;
    n = n - min;
    let modulo = ((n % divisor) + divisor) % divisor;
    return modulo + min;
}
function areColliding(ballA, ballB) {
    if (ballA.pos.dist(ballB.pos) < ballA.r + ballB.r) return true;
    return false;
}
function elastic_collision(m, n, v) {
    // m = mass1, n = mass2, v = velocity1. Velocity2 MUST BE 0
    let x = v * (m - n) / (m + n);
    let y = v + x;
    return [x, y];
}
function handleCollision(ball1, ball2) {
    // Change to a new FoR in which ball2 is at rest
    let vel_adj = ball2.vel.copy();
    ball1.vel.sub(vel_adj);
    ball2.vel.sub(vel_adj);
    // Now change to a new FoR in which ball2 is at the origin
    let pos_adj = ball2.pos.copy();
    ball1.pos.sub(pos_adj);
    ball2.pos.sub(pos_adj);
    // Rotate frame of reference so the point of collision is on x axis and > 0
    let angle_adj = ball1.pos.heading();
    ball1.pos.rotate(-angle_adj);
    ball1.vel.rotate(-angle_adj);
    // Handle the collision in the new FoR
    let [v1f, v2f] = elastic_collision(ball1.mass, ball2.mass, ball1.vel.x);
    ball1.vel.x = v1f;
    ball2.vel.x = v2f;
    // Remove overlap
    ball1.pos.x = ball2.r + ball1.r + 0.01;
    // Switch back to the original FoR
    ball1.pos.rotate(angle_adj);
    ball1.vel.rotate(angle_adj);
    ball2.vel.rotate(angle_adj);
    ball1.pos.add(pos_adj);
    ball2.pos.add(pos_adj);
    ball1.vel.add(vel_adj);
    ball2.vel.add(vel_adj);
}
function arrow(x1, y1, x2, y2, offset, txt) {
    fill("#fffade")
    line(x1,y1,x2,y2)
    push()
    let angle = atan2(y1 - y2, x1 - x2);
    translate(x2, y2);
    rotate(angle - HALF_PI);
    triangle(-offset * 0.6, offset*1.5, offset * 0.6, offset*1.5, 0, 0);
    rotate(PI/2);
    noStroke();
    text("Total Momentum", 10, -10)
    pop();
}
function showTotalMomentum() {
    push();
    stroke("#fffade");
    strokeWeight(2);
    arrow(width/2, height/2,M_START.x, M_START.y, 7);
    pop();
}
function showTotalEnergy() {
    push();
    stroke("black")
    fill("ivory");
    rect(5, 5, 180, 40);
    noStroke();
    fill("black");
    textStyle(BOLD);
    text(`Total Energy: ${TOTAL_ENERGY}`, 20, 30);
    pop();
}
function restart() {
    for (let i = 0; i < NUM_BALLS; i++)
        BALLS[i] = new Ball(i, i*40, i*40, random(-3,3), random(-1,1), random(15,30));
}
function setup() {
    let can = createCanvas(600, 600);
    colorMode(HSB, 360, 100, 100);
    restart();
}
function draw() {
    background("#005061");
    // Move every ball
    for (let ball of BALLS)
        ball.update();
    // Check for and handle collisions
    for (let i = 0; i < BALLS.length; i++)
        for (let j = i+1; j < BALLS.length; j++)
            if (areColliding(BALLS[i], BALLS[j]))
                handleCollision(BALLS[i], BALLS[j]);
    // Draw every ball
    TOTAL_ENERGY = 0;
    push();
    M_START = createVector(width/2, height/2);
    for (let ball of BALLS) {
        ball.show();
        if (SHOW_MOM) ball.showMomentum();
        TOTAL_ENERGY += ball.energy();
    }
    pop();
    TOTAL_ENERGY = TOTAL_ENERGY.toFixed(3);
    showTotalEnergy();
    if (SHOW_MOM) showTotalMomentum();
}
function mouseClicked() {
    SHOW_MOM = !SHOW_MOM;
}