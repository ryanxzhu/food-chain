const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const controlsSection = document.querySelector('#controls');
const sunlightSlider = document.querySelector('#sunlightSlider');
const worldSpeedSlider = document.querySelector('#worldSpeedSlider');
const h4Container = document.querySelector('#h4-container');
const h4 = document.querySelector('h4');
const gameSpeedArray = [ 1, 2, 3, 4 ];
const sizesArray = [];
const dietArray = [];

for (let index = 0; index < 7; index++) {
	sizesArray.push(4 * Math.pow(2, index));
	Math.random() < 0.5 ? dietArray.push('carnivore') : dietArray.push('herbivore');
}

var gameSpeed = gameSpeedArray[0];
var mouse = {
	x: 200,
	y: 200
};

var initialVelocity = 1;

var greenaeArray = [];
var yellowinArray = [];
let greenae;
let yellowin;
let redla;
let blueson;
let purpleg;
let blackarr;
let oranget;

//Utility Functions

function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// creates an array of shades of brown. Used for sunlight range slider
function createBrownArray() {
	var rgb = {
		r: 0,
		g: 0,
		b: 0
	};

	const brownColorArray = [];

	for (var i = 1; i < 26; i++) {
		rgb.r = 111 + Math.floor(53 / 25 * i);
		rgb.g = 56 + Math.floor(53 / 25 * i);
		rgb.b = 2 + Math.floor(53 / 25 * i);
		brownColorArray.push({ ...rgb });
	}

	for (var i = 1; i < 26; i++) {
		rgb.r = 164 + Math.floor(65 / 25 * i);
		rgb.g = 109 + Math.floor(100 / 25 * i);
		rgb.b = 55 + Math.floor(133 / 25 * i);
		brownColorArray.push({ ...rgb });
	}

	for (var i = 1; i < 26; i++) {
		rgb.r = 229 + Math.floor(17 / 25 * i);
		rgb.g = 209 + Math.floor(23 / 25 * i);
		rgb.b = 188 + Math.floor(23 / 25 * i);
		brownColorArray.push({ ...rgb });
	}

	for (var i = 1; i < 26; i++) {
		rgb.r = 249 + Math.floor(6 / 22 * i);
		rgb.g = 232 + Math.floor(9 / 22 * i);
		rgb.b = 216 + Math.floor(10 / 22 * i);
		brownColorArray.push({ ...rgb });
	}

	for (let i = 0; i < brownColorArray.length; i++) {
		brownColorArray[i] =
			'rgb(' + brownColorArray[i].r + ', ' + brownColorArray[i].g + ', ' + brownColorArray[i].b + ')';
	}

	return brownColorArray;
}

// Objects

class Organism {
	constructor(x, y, baseVelocity) {
		this.x = x;
		this.y = y;
		this.name;
		this.size;
		this.color;
		this.baseVelocity = baseVelocity;
		this.velocity = this.baseVelocity;
		this.angle = Math.random() * 2 * Math.PI;
		this.xVelocity = 0;
		this.yVelocity = 0;
		this.dead = false;
		this.life = 0;
		this.lifeSpan = 3000 + Math.floor(Math.random() * 1200);
		this.death = 0;
		this.deathSpan = 1000;
		this.puberty = 1400 + Math.floor(Math.random() * 800);
		this.energy = 10000;
		this.opacity = this.energy / 10000;
	}

	resultantVelocity(xVelocity, yVelocity) {
		return Math.sqrt(Math.pow(xVelocity, 2) + Math.pow(yVelocity, 2)) * gameSpeed;
	}

	angleOfDirection(xVelocity, yVelocity, resultantVelocity) {
		if (xVelocity >= 0 && yVelocity >= 0) {
			return Math.asin(xVelocity / resultantVelocity);
		}
		if (xVelocity >= 0 && yVelocity <= 0) {
			return Math.PI / 2 + Math.acos(xVelocity / resultantVelocity);
		}
		if (xVelocity <= 0 && yVelocity <= 0) {
			return Math.PI + Math.asin(Math.abs(xVelocity) / resultantVelocity);
		}
		if (xVelocity <= 0 && yVelocity >= 0) {
			return Math.PI * 3 / 2 + Math.asin(yVelocity / resultantVelocity);
		}
	}

	findXVelocity(angle, velocity) {
		if (angle <= Math.PI / 2) {
			return Math.sin(angle) * velocity;
		}
		if (angle <= Math.PI) {
			angle = angle - Math.PI / 2;
			return Math.cos(angle) * velocity;
		}
		if (angle <= Math.PI * 3 / 2) {
			angle = angle - Math.PI;
			return Math.sin(angle) * velocity * -1;
		}
		if (angle <= Math.PI * 2) {
			angle = angle - Math.PI * 3 / 2;
			return Math.cos(angle) * velocity * -1;
		}
	}

	findYVelocity(angle, velocity) {
		if (angle <= Math.PI / 2) {
			return Math.cos(angle) * velocity;
		}
		if (angle <= Math.PI) {
			angle = angle - Math.PI / 2;
			return Math.sin(angle) * velocity * -1;
		}
		if (angle <= Math.PI * 3 / 2) {
			angle = angle - Math.PI;
			return Math.cos(angle) * velocity * -1;
		}
		if (angle <= Math.PI * 2) {
			angle = angle - Math.PI * 3 / 2;
			return Math.sin(angle) * velocity;
		}
	}

	changeAngle(angle) {
		let random = Math.random();
		angle = random < 0.5 ? angle + 0.1 : angle - 0.1;
		angle = angle < 0 ? Math.PI * 2 + angle : angle;
		angle = angle >= Math.PI * 2 ? angle - Math.PI * 2 : angle;
		return angle;
	}

	draw() {
		c.beginPath();
		c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
		if (this.dead === true) {
			c.strokeStyle = this.color;
			c.stroke();
		} else {
			c.fillStyle = this.color;
			c.save();
			c.globalAlpha = this.opacity;
			c.fill();

			c.strokeStyle = 'black';
			c.stroke();
			c.restore();
		}
	}

	update() {
		// life and death
		if (this.dead === true) {
			this.death = this.death + gameSpeed;
			if (this.death > this.deathSpan) {
				greenaeArray.splice(greenaeArray.indexOf(this), 1);
				yellowinArray.splice(yellowinArray.indexOf(this), 1);
			}
			this.draw();
			return;
		}

		this.life = this.life + gameSpeed;
		if (this.life > this.lifeSpan || this.energy < 0) {
			this.baseVelocity = 0.000000000000000000000000000000000000001;
			this.dead = true;
		}

		// energy loss
		this.energy = this.energy - this.energyLoss;
		this.opacity = this.energy / 10000;

		// movement
		this.velocity = this.baseVelocity * gameSpeed;
		this.angle = this.changeAngle(this.angle);
		this.xVelocity = this.findXVelocity(this.angle, this.velocity);
		this.yVelocity = this.findYVelocity(this.angle, this.velocity);
		if (this.x + this.size > canvas.width || this.x - this.size < 0) {
			this.xVelocity = -this.xVelocity;
		}
		if (this.y + this.size > canvas.height || this.y - this.size < 0) {
			this.yVelocity = -this.yVelocity;
		}
		this.angle = this.angleOfDirection(this.xVelocity, this.yVelocity, this.velocity);
		this.x += this.xVelocity;
		this.y += this.yVelocity;

		// breeding
		this.chanceToBreed = this.chanceToBreedBase * gameSpeed;
		if (this.life > this.puberty && Math.random() < this.chanceToBreed && this.name === 'greenae') {
			greenaeArray.push(new Greenae(this.x, this.y, Math.random() * 0.1));
		}
		if (this.life > this.puberty && this.life % 100 < 10 && this.name === 'yellowin' && this.energy > 10000) {
			yellowinArray.push(new Yellowin(this.x, this.y, this.velocity * (1 + (Math.random() - 0.5) / 2.5)));
			this.energy = this.energy - 8000;
		}

		// draw
		this.draw();
	}
}

class Greenae extends Organism {
	constructor(x, y, baseVelocity) {
		super(x, y, baseVelocity);
		this.name = 'greenae';
		this.size = sizesArray[0];
		this.color = 'rgb(24, 222, 84)';
		this.energyLoss = 0;
		this.chanceToBreedBase = 0.004;
		this.chanceToBreed = this.chanceToBreedBase;
	}
}
class Yellowin extends Organism {
	constructor(x, y, baseVelocity) {
		super(x, y, baseVelocity);
		this.name = 'yellowin';
		this.size = sizesArray[1];
		this.diet = 'herbivore';
		this.color = 'yellow';
		this.energyLoss = 1 + 3 * Math.pow(this.baseVelocity, 2) * this.size;
	}
}

// initilisation function
function init() {
	controlsSection.style.height = '95px';

	canvas.width = innerWidth;
	canvas.height = innerHeight;

	for (let index = 0; index < 100; index++) {
		greenaeArray.push(
			new Greenae(
				randomIntFromRange(sizesArray[0] * 2, canvas.width - sizesArray[0] * 2),
				randomIntFromRange(sizesArray[0] * 2, canvas.height - sizesArray[0] * 2),
				Math.random() * 0.1
			)
		);
	}

	for (let index = 0; index < 10; index++) {
		yellowinArray.push(
			new Yellowin(
				randomIntFromRange(sizesArray[1] * 2, canvas.width - sizesArray[1] * 2),
				randomIntFromRange(sizesArray[1] * 2, canvas.height - sizesArray[1] * 2),
				Math.random() * initialVelocity
			)
		);
	}

	const brownColorArray = createBrownArray();

	canvas.style.backgroundColor = brownColorArray[50];

	// Event Listeners for sunlight and work speed range input
	sunlightSlider.addEventListener('input', function() {
		canvas.style.backgroundColor = brownColorArray[this.value];
		for (let index = 0; index < greenaeArray.length; index++) {
			greenaeArray[index].chanceToBreed = 0.001 * this.value / 50;
		}
	});

	h4Container.style.left = '0px';
	worldSpeedSlider.addEventListener('input', function() {
		h4Container.style.left = parseFloat(this.value) * 93.5 + 'px';
		gameSpeed = gameSpeedArray[this.value];
		h4.innerHTML = gameSpeed + 'x' + '<span></span>';
	});

	// Basic Event Listeners
	addEventListener('mousemove', function(e) {
		mouse.x = e.x;
		mouse.y = e.y;

		// Hover down menu due to mouse moved to the top of the screen
		if (mouse.y < 100) {
			controlsSection.style.transform = 'translateY(100px)';
		} else {
			controlsSection.style.transform = 'translateY(0px)';
		}
	});

	addEventListener('resize', function() {
		canvas.width = innerWidth;
		canvas.height = innerHeight;
	});
}

//Animation loop
function animate() {
	requestAnimationFrame(animate);

	c.clearRect(0, 0, canvas.width, canvas.height);

	yellowinArray.forEach((e) => e.update());
	greenaeArray.forEach((e) => e.update());

	console.log(yellowinArray.length, greenaeArray.length);

	for (var i = 0; i < yellowinArray.length; i++) {
		if (yellowinArray[i].dead === true || yellowinArray[i].energy > 20000) {
			continue;
		}
		for (let j = 0; j < greenaeArray.length; j++) {
			if (
				getDistance(greenaeArray[j].x, greenaeArray[j].y, yellowinArray[i].x, yellowinArray[i].y) <
				greenaeArray[j].size + yellowinArray[i].size
			) {
				greenaeArray.splice(j, 1);
				yellowinArray[i].energy = yellowinArray[i].energy + 10000;
			}
		}
	}
}

init();

animate();
