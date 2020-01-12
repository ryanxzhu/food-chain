const canvas = document.querySelector('canvas');
const infoBox = document.querySelector('#infoBox');
const statusBox = document.querySelector('#statusBox');
const c = canvas.getContext('2d');
const controlsSection = document.querySelector('#controls');
const sunlightSlider = document.querySelector('#sunlightSlider');
const worldSpeedSlider = document.querySelector('#worldSpeedSlider');
const h4Container = document.querySelectorAll('#h4-container');
const h4 = document.querySelectorAll('h4');
const gameSpeedArray = [ 1, 2, 3, 4 ];
const sizesArray = [];
const dietArray = [];
var nameCount = 0;
var usedControlCount = 0;

for (let index = 0; index < 7; index++) {
	sizesArray.push(8 * Math.pow(2, index));
	Math.random() < 0.5 ? dietArray.push('carnivore') : dietArray.push('herbivore');
}

var gameSpeed = gameSpeedArray[0];
var sunlightFraction = 1;
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

const statusBoxElArray = [];

// function makeStatusBoxShell() {
// 	for (let index = 0; index < 7; index++) {
// 		let statusDiv = document.createElement('div');
// 		let statusSpeciesCount = document.createElement('span');
// 		statusSpeciesCount.classList.add('speciesCount');
// 		statusDiv.appendChild(statusSpeciesCount);
// 		let statusSpeciesCircle = document.createElement('div');
// 		statusSpeciesCircle.classList.add('speciesCircle');
// 		statusDiv.appendChild(statusSpeciesCircle);
// 		let statusSpeciesName = document.createElement('span');
// 		statusSpeciesName.classList.add('speciesName');
// 		statusDiv.appendChild(statusSpeciesName);
// 		let statusSpeciesDescription = document.createElement('span');
// 		statusSpeciesDescription.classList.add('speciesDescription');
// 		statusDiv.appendChild(statusSpeciesDescription);
// 		statusBox.appendChild(statusDiv);
// 	}
// }

function makeStatusBoxShell() {
	let statusDiv = document.createElement('div');
	let statusSpeciesCount = document.createElement('span');
	statusSpeciesCount.classList.add('speciesCount');
	statusDiv.appendChild(statusSpeciesCount);
	let statusSpeciesCircle = document.createElement('div');
	statusSpeciesCircle.classList.add('speciesCircle');
	statusDiv.appendChild(statusSpeciesCircle);
	let statusSpeciesName = document.createElement('span');
	statusSpeciesName.classList.add('speciesName');
	statusDiv.appendChild(statusSpeciesName);
	let statusSpeciesDescription = document.createElement('span');
	statusSpeciesDescription.classList.add('speciesDescription');
	statusDiv.appendChild(statusSpeciesDescription);
	statusBox.appendChild(statusDiv);
}

makeStatusBoxShell();
makeStatusBoxShell();

const speciesCountNodeList = statusBox.querySelectorAll('.speciesCount');
const speciesCircleNodeList = statusBox.querySelectorAll('.speciesCircle');
const speciesNameNodeList = statusBox.querySelectorAll('.speciesName');
speciesCountNodeList[0].textContent = '10';
speciesCircleNodeList[0].style.backgroundColor = 'rgb(24, 222, 84)';
speciesNameNodeList[0].textContent = 'Greenae';
speciesCountNodeList[1].textContent = '';
speciesCircleNodeList[1].style.backgroundColor = 'yellow';
speciesNameNodeList[1].textContent = 'Yellowin';

// function fillStatusBox(array, count, color, name, description) {
// 	for (let index = 0; index < array.length; index++) {

// 	}
// }

const statusBoxNodeList = document.querySelectorAll('#statusBox > div');
// console.log(statusBox.elem);

// statusBox[i].speciesCount.textContent = greenaeArray.length;
// statusBox.species.textContent = greenaeArray.length;
// statusBox.speciesCount.textContent = greenaeArray.length;

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

	for (var i = 1; i < 27; i++) {
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

function removeBouncingArrow() {
	if (document.querySelector('.icon') !== null) {
		document.querySelector('.icon').remove();
	}
	console.log('hit');
	sunlightSlider.removeEventListener('mousedown', removeBouncingArrow);
	worldSpeedSlider.removeEventListener('mousedown', removeBouncingArrow);
}

// Objects

class Organism {
	constructor(x, y, baseVelocity) {
		this.x = x;
		this.y = y;
		this.name = namesArray[nameCount];
		nameCount++;
		this.adultSize;
		this.color;
		this.baseVelocity = baseVelocity;
		this.velocity = this.baseVelocity;
		this.angle = Math.random() * 2 * Math.PI;
		this.xVelocity = 0;
		this.yVelocity = 0;
		this.dead = false;
		this.life = 1;
		this.puberty = 400 + Math.floor(Math.random() * 800);
		this.lifeSpan = 3000 + Math.floor(Math.random() * 1200);
		this.size = this.adultSize * Math.min(1, Math.max(0.25, this.life / this.puberty));
		this.death = 0;
		this.deathSpan = 1000;
		this.chanceToEvolveBase = 0.01;
		this.chanceToEvolve = this.chanceToEvolveBase;
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
			return;
		}

		c.fillStyle = this.color;
		c.save();
		c.globalAlpha = this.opacity;
		c.fill();

		this.life < this.puberty ? (c.strokeStyle = 'white') : (c.strokeStyle = 'black');
		c.stroke();
		c.restore();
	}

	update() {
		// life and death
		if (this.dead === true) {
			this.death = this.death + gameSpeed;
			if (this.death > this.deathSpan) {
				this.decompose();
			}
			this.draw();
			return;
		}

		this.life = this.life + gameSpeed;
		if (this.life > this.lifeSpan || this.energy < 0) {
			this.baseVelocity = 0.0000000000000000000000000001;
			this.dead = true;
		}

		// growth
		this.size = this.adultSize * Math.min(1, Math.max(0.25, this.life / this.puberty));

		// energy loss
		this.energyLoss = 1 + 6 * Math.pow(this.velocity, 2) * this.size;
		this.energy = this.energy - this.energyLoss;
		this.opacity = Math.max(this.energy / 10000, 0);

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

		// breeding and evolving
		this.chanceToBreed = this.chanceToBreedBase * gameSpeed * sunlightFraction;
		this.chanceToEvolve = this.chanceToEvolveBase * gameSpeed;
		if (this.life > this.puberty && Math.random() < this.chanceToBreed && this.constructor.name === 'Greenae') {
			this.evolve();
			greenaeArray.push(new Greenae(this.x, this.y, Math.random() * 0.4));
		}
		if (
			this.life > this.puberty &&
			this.life % 100 < 10 &&
			this.constructor.name === 'Yellowin' &&
			this.energy > 10000
		) {
			yellowinArray.push(new Yellowin(this.x, this.y, this.velocity * (1 + (Math.random() - 0.5) / 5)));
			this.energy = this.energy - 5000;
		}

		// draw
		this.draw();
	}
}

class Greenae extends Organism {
	constructor(x, y, baseVelocity) {
		super(x, y, baseVelocity);
		this.hierarchy = 0;
		this.adultSize = sizesArray[0];
		this.color = 'rgb(24, 222, 84)';
		this.lifeSpan = 1000 + Math.floor(Math.random() * 1200);
		this.chanceToBreedBase = 0.004;
		this.chanceToBreed = this.chanceToBreedBase;
	}

	evolve() {
		if (Math.random() < this.chanceToEvolve) {
			yellowinArray.push(new Yellowin(this.x, this.y, Math.random() * initialVelocity));
		}
	}

	decompose() {
		greenaeArray.splice(greenaeArray.indexOf(this), 1);
	}
}
class Yellowin extends Organism {
	constructor(x, y, baseVelocity) {
		super(x, y, baseVelocity);
		this.hierarchy = 1;
		this.adultSize = sizesArray[1];
		this.size = this.adultSize * Math.min(1, Math.max(0.25, this.life / this.puberty));
		this.diet = 'herbivore';
		this.color = 'yellow';
		this.energy = 5000;
		this.opacity = this.energy / 20000;
		this.energyLoss = 1 + 6 * Math.pow(this.velocity, 2) * this.size;
	}

	decompose() {
		console.log('decompose yellowin');
		yellowinArray.splice(yellowinArray.indexOf(this), 1);
	}
}

// initilisation function
function init() {
	controlsSection.style.height = '95px';

	infoBox.style.width = '200px';
	canvas.width = innerWidth - parseFloat(infoBox.style.width);
	canvas.height = innerHeight;
	infoBox.height = innerHeight;

	for (let index = 0; index < 5; index++) {
		greenaeArray.push(
			new Greenae(
				randomIntFromRange(sizesArray[0] * 2, canvas.width - sizesArray[0] * 2),
				randomIntFromRange(sizesArray[0] * 2, canvas.height - sizesArray[0] * 2),
				Math.random() * 0.4
			)
		);
	}

	const brownColorArray = createBrownArray();

	canvas.style.backgroundColor = brownColorArray[50];

	// Event Listeners for sunlight and work speed range input
	sunlightSlider.addEventListener('input', function() {
		canvas.style.backgroundColor = brownColorArray[this.value];
		sunlightFraction = this.value / 50;
		h4Container[0].style.left = parseFloat(this.value) * 2.805 + 'px';
		h4[0].innerHTML = this.value * 2 + '%' + '<span></span>';
	});

	sunlightSlider.addEventListener('mousedown', removeBouncingArrow);

	h4Container[1].style.left = '0px';
	h4Container[0].style.left = '140px';
	worldSpeedSlider.addEventListener('input', function() {
		h4Container[1].style.left = parseFloat(this.value) * 93.5 + 'px';
		gameSpeed = gameSpeedArray[this.value];
		h4[1].innerHTML = gameSpeed + 'x' + '<span></span>';
	});

	worldSpeedSlider.addEventListener('mousedown', removeBouncingArrow);

	// Basic Event Listeners
	addEventListener('mousemove', function(e) {
		mouse.x = e.x;
		mouse.y = e.y;

		// Hover down menu due to mouse moved to the top of the screen
		if (mouse.y < 120) {
			controlsSection.style.transform = 'translateY(100px)';
		} else {
			controlsSection.style.transform = 'translateY(0px)';
		}
	});

	addEventListener('resize', function() {
		canvas.width = innerWidth - parseFloat(infoBox.style.width);
		canvas.height = innerHeight;
	});
}

//Animation loop
function animate() {
	requestAnimationFrame(animate);

	if (nameCount > namesArray.length - 1) {
		nameCount = 0;
	}

	c.clearRect(0, 0, canvas.width, canvas.height);

	yellowinArray.forEach((e) => e.update());
	greenaeArray.forEach((e) => e.update());

	for (var i = 0; i < yellowinArray.length; i++) {
		if (yellowinArray[i].dead === true || yellowinArray[i].energy > 20000) {
			continue;
		}
		for (let j = 0; j < greenaeArray.length; j++) {
			if (
				getDistance(greenaeArray[j].x, greenaeArray[j].y, yellowinArray[i].x, yellowinArray[i].y) <
				greenaeArray[j].size + yellowinArray[i].size
			) {
				yellowinArray[i].energy =
					yellowinArray[i].energy + 4000 * greenaeArray[j].size / greenaeArray[j].adultSize;
				greenaeArray.splice(j, 1);
			}
		}
	}

	updatePopulation(greenaeArray, 0);
	updatePopulation(yellowinArray, 1);
}

function updatePopulation(array, i) {
	let populationCount = 0;
	array.forEach(function(e) {
		e.dead === false ? populationCount++ : populationCount;
	});
	if (populationCount === 0) {
		speciesCountNodeList[i].style.color = 'rgb(80, 80, 80)';
		speciesNameNodeList[i].style.color = 'rgb(80, 80, 80)';
	} else if (populationCount < 11) {
		speciesCountNodeList[i].style.color = 'red';
		speciesNameNodeList[i].style.color = 'red';
	} else if (populationCount < 50) {
		speciesCountNodeList[i].style.color = 'orange';
		speciesNameNodeList[i].style.color = 'orange';
	} else if (populationCount < 200) {
		speciesCountNodeList[i].style.color = 'yellow';
		speciesNameNodeList[i].style.color = 'yellow';
	} else {
		speciesCountNodeList[i].style.color = 'white';
		speciesNameNodeList[i].style.color = 'white';
	}
	speciesCountNodeList[i].textContent = populationCount;
	return;
}

init();

animate();
