const canvas = document.querySelector('canvas');
const infoBox = document.querySelector('#infoBox');
const newsfeed = document.querySelector('#newsfeed');
const c = canvas.getContext('2d');
const statusBox = document.querySelector('#statusBox');
const organismStatus = document.querySelector('#organismStatus');
const controlsSection = document.querySelector('#controls');
const sunlightSlider = document.querySelector('#sunlightSlider');
const worldSpeedSlider = document.querySelector('#worldSpeedSlider');
const h4Container = document.querySelectorAll('#h4-container');
const h4 = document.querySelectorAll('h4');
const gameSpeedArray = [ 1, 2, 3, 4 ];
const radiusArray = [];
const dietArray = [];
const runOneTime = [];
var firstNameCount = 0;
var lastNameCount = 0;
var numOfSpecies = 0;
var spawnCount = 0;
var animateStartingGreenaeSizeVar = 0;

let greenaeArray = [];
let yellowinArray = [];
let orangetArray = [];
let redlaArray = [];
let purplegArray = [];
let bluesonArray = [];
let blackarrArray = [];

greenaeArray.nameOfOrganism = 'Greenae';
yellowinArray.nameOfOrganism = 'Yellowin';
orangetArray.nameOfOrganism = 'Oranget';
redlaArray.nameOfOrganism = 'Redla';
purplegArray.nameOfOrganism = 'Purpleg';
bluesonArray.nameOfOrganism = 'Blueson';
blackarrArray.nameOfOrganism = 'Blackarr';

let speciesArray = [ greenaeArray, yellowinArray, orangetArray, redlaArray, purplegArray, bluesonArray, blackarrArray ];

for (let index = 0; index < speciesArray.length; index++) {
	speciesArray[index].hasMutated = false;
	speciesArray[index].hierarchy = index;
}

for (let index = 0; index < 7; index++) {
	radiusArray.push(8 * Math.pow(2, index));
	Math.random() < 0.5 ? dietArray.push('carnivore') : dietArray.push('herbivore');
	makeStatusBoxShell();
	makeOrganismStatusShell();
}

var gameSpeed = gameSpeedArray[0];
var sunlightFraction = 1;
var mouse = {
	x: null,
	y: null
};

let initialVelocity = 1;

const statusDivs = statusBox.querySelectorAll('.statusDiv');
const speciesCountNodeList = statusBox.querySelectorAll('.speciesCount');
const speciesCircleNodeList = statusBox.querySelectorAll('.speciesCircle');
const speciesNameNodeList = statusBox.querySelectorAll('.speciesName');
const organismDivs = organismStatus.querySelectorAll('.statusDiv');
const organismCountNodeList = organismStatus.querySelectorAll('.speciesCount');
const organismCircleNodeList = organismStatus.querySelectorAll('.speciesCircle');
const organismNameNodeList = organismStatus.querySelectorAll('.speciesName');
const redListNodeList = organismStatus.querySelectorAll('.redList');
const oldestGenNodeList = organismStatus.querySelectorAll('.statusDiv p:nth-of-type(3)');
const aveSizeNodeList = organismStatus.querySelectorAll('.statusDiv p:nth-of-type(4)');
const aveSpeedNodeList = organismStatus.querySelectorAll('.statusDiv p:nth-of-type(5)');

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
	sunlightSlider.removeEventListener('mousedown', removeBouncingArrow);
	worldSpeedSlider.removeEventListener('mousedown', removeBouncingArrow);
}

// Objects

class Organism {
	constructor(x, y, baseVelocity, generation, lastName) {
		this.x = x;
		this.y = y;
		this.firstName = firstNameArray[firstNameCount];
		firstNameCount++;
		this.lastName = lastName;
		this.generation = generation;
		this.adultRadius = radiusArray[0];
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
		this.radius = this.adultRadius * Math.min(1, Math.max(0.25, this.life / this.puberty));
		this.death = 0;
		this.deathSpan = 1000;
		this.chanceToMutateBase = 0.01;
		this.chanceToMutate = this.chanceToMutateBase;
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
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		if (this.dead === true) {
			c.strokeStyle = this.color;
			c.stroke();
			return;
		}

		c.save();
		c.globalAlpha = this.opacity;
		c.fillStyle = this.color;
		c.fill();

		this.life < this.puberty ? (c.strokeStyle = 'white') : (c.strokeStyle = 'black');
		c.stroke();
		c.restore();
	}

	decompose() {
		speciesArray[this.hierarchy].splice(speciesArray[this.hierarchy].indexOf(this), 1);
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
		this.radius = this.adultRadius * Math.min(1, Math.max(0.25, this.life / this.puberty));

		// energy loss
		this.energyLoss = 3 * this.radius + 3 * this.velocity * this.radius;
		this.energy = this.energy - this.energyLoss;
		this.opacity = Math.max(this.energy / 10000, 0);

		// movement
		this.velocity = this.baseVelocity * gameSpeed;

		this.angle = this.changeAngle(this.angle);

		if (this.x + this.radius > canvas.width) {
			this.angle = 3 / 2 * Math.PI;
		}
		if (this.x - this.radius < 0) {
			this.angle = Math.PI / 2;
		}
		if (this.y + this.radius > canvas.height) {
			this.angle = Math.PI;
		}
		if (this.y - this.radius < 0) {
			this.angle = 0;
		}

		this.xVelocity = this.findXVelocity(this.angle, this.velocity);
		this.yVelocity = this.findYVelocity(this.angle, this.velocity);

		this.angle = this.angleOfDirection(this.xVelocity, this.yVelocity, this.velocity);
		this.x += this.xVelocity;
		this.y += this.yVelocity;

		// breeding and evolving
		this.chanceToBreed = this.chanceToBreedBase * gameSpeed * sunlightFraction;
		this.chanceToMutate = this.chanceToMutateBase * gameSpeed;
		if (
			this.life > this.puberty &&
			Math.random() < this.chanceToBreed &&
			this.constructor.name === 'Greenae'
			// greenaeArray.length + yellowinArray.length < 1500
		) {
			this.mutate();
			this.breed();
			// greenaeArray.push(new Greenae(this.x, this.y, Math.random() * 0.8, this.generation + 1, this.lastName));
		}

		if (
			this.life > this.puberty &&
			this.constructor.name === 'Yellowin' &&
			this.energy > 10000 * Math.pow(this.radius, 2) / Math.pow(radiusArray[1], 2) &&
			this.life % 300 < 5
		) {
			yellowinArray.push(
				new Yellowin(
					this.x,
					this.y,
					this.baseVelocity * (1 + (Math.random() - 0.5) / 5),
					this.generation + 1,
					this.lastName,
					this.adultRadius * (1 + (Math.random() - 0.5) / 5),
					5000 * Math.pow(this.radius, 2) / Math.pow(radiusArray[1], 2) / 2
				)
			);
			this.energy = this.energy - 5000 * Math.pow(this.radius, 2) / Math.pow(radiusArray[1], 2);
			this.mutate();
		}

		if (
			this.life > this.puberty &&
			this.constructor.name === 'Oranget' &&
			this.energy > 20000 * Math.pow(this.radius, 2) / Math.pow(radiusArray[1], 2) &&
			this.life % 300 < 5
		) {
			orangetArray.push(
				new Oranget(
					this.x,
					this.y,
					this.baseVelocity * (1 + (Math.random() - 0.5) / 5),
					this.generation + 1,
					this.lastName,
					this.adultRadius * (1 + (Math.random() - 0.5) / 5),
					10000 * Math.pow(this.radius, 2) / Math.pow(radiusArray[1], 2) / 2
				)
			);
			this.energy = this.energy - 5000 * Math.pow(this.radius, 2) / Math.pow(radiusArray[2], 2);
		}

		// draw
		this.draw();
	}
}

class Greenae extends Organism {
	constructor(x, y, baseVelocity, generation, lastName) {
		super(x, y, baseVelocity, generation, lastName);
		this.color = 'rgb(24, 222, 84)';
		this.hierarchy = 0;
		this.adultNutritionalEnergyValue = 10000;
		this.lifeSpan = 1000 + Math.floor(Math.random() * 1200);
		this.chanceToBreedBase = 0.004;
		this.chanceToBreed = this.chanceToBreedBase;
	}

	breed() {
		let closeGreenaeArray = [];
		for (let index = 0; index < greenaeArray.length; index++) {
			if (
				Math.abs(this.x - greenaeArray[index].x) < this.radius * 4 &&
				Math.abs(this.y - greenaeArray[index].y) < this.radius * 4
			) {
				closeGreenaeArray.push(greenaeArray[index]);
			}
		}

		for (let index = 0; index < 15; index++) {
			let num;
			let num2;
			let touching = false;
			Math.random() < 0.5 ? (num = 1) : (num = -1);
			Math.random() < 0.5 ? (num2 = 1) : (num2 = -1);
			let randomX = this.x + num * randomIntFromRange(this.radius * 2, this.radius * 3);
			let randomY = this.y + num2 * randomIntFromRange(this.radius * 2, this.radius * 3);

			for (let index = 0; index < closeGreenaeArray.length; index++) {
				if (closeGreenaeArray[index].dead === false) {
					if (
						getDistance(randomX, randomY, closeGreenaeArray[index].x, closeGreenaeArray[index].y) <
						this.radius * 2
					) {
						touching = true;
						break;
					}
				}
			}

			if (
				touching === false &&
				randomX > this.radius &&
				randomX < canvas.width - this.radius &&
				randomY > this.radius &&
				randomY < canvas.height - this.radius
			) {
				greenaeArray.push(new Greenae(randomX, randomY, 0.0000001, this.generation + 1, this.lastName));
				return;
			}
		}
	}

	mutate() {
		if (Math.random() < this.chanceToMutate && yellowinArray.length < 6) {
			yellowinArray.push(
				new Yellowin(
					this.x,
					this.y,
					Math.min(0.33, Math.random()) * initialVelocity,
					// initialVelocity,
					1,
					this.lastName,
					radiusArray[1] * (1 + (Math.random() - 0.5)),
					5000
				)
			);
		}
	}
}

class Heterotroph extends Organism {
	constructor(x, y, baseVelocity, generation, lastName, adultRadius, energy) {
		super(x, y, baseVelocity, generation, lastName);
		this.adultRadius = adultRadius;
		this.radius = this.adultRadius * Math.min(1, Math.max(0.25, this.life / this.puberty));
		this.energy = energy;
		this.energyLoss = 3 * this.radius + 3 * this.velocity * this.radius;
	}
}

class Yellowin extends Heterotroph {
	constructor(x, y, baseVelocity, generation, lastName, adultRadius, energy) {
		super(x, y, baseVelocity, generation, lastName, adultRadius, energy);
		this.diet = 'herbivore';
		this.color = 'yellow';
		this.hierarchy = 1;
		// this.energy = 5000 * Math.pow(this.radius, 2) / Math.pow(radiusArray[1], 2);
		this.adultNutritionalEnergyValue = 20000 * Math.pow(adultRadius, 2) / Math.pow(radiusArray[1], 2);
		this.opacity = this.energy / (20000 * Math.pow(this.radius, 2) / Math.pow(radiusArray[1], 2));
		// this.energyLoss = 1 + 6 * Math.pow(this.velocity, 2) * this.radius;
	}

	mutate() {
		if (Math.random() < this.chanceToMutate && orangetArray.length < 6) {
			orangetArray.push(
				new Oranget(
					this.x,
					this.y,
					Math.min(0.33, Math.random()) * initialVelocity,
					// initialVelocity,
					1,
					this.lastName,
					radiusArray[2] * (1 + (Math.random() - 0.5)),
					10000
				)
			);
		}
	}
}

class Oranget extends Heterotroph {
	constructor(x, y, baseVelocity, generation, lastName, adultRadius, energy) {
		super(x, y, baseVelocity, generation, lastName, adultRadius, energy);
		this.diet = 'carnivore';
		this.color = 'orange';
		this.hierarchy = 2;
		this.adultNutritionalEnergyValue = 40000 * Math.pow(adultRadius, 2) / Math.pow(radiusArray[2], 2);
		this.opacity = this.energy / (20000 * Math.pow(this.radius, 2) / Math.pow(radiusArray[2], 2));
	}
}

function clickToSpawn(e) {
	if (spawnCount > 4) {
		canvas.removeEventListener('mousedown', clickToSpawn);
		return;
	}
	greenaeArray.push(new Greenae(e.x, e.y, 0.00000001, 1, lastNameArray[lastNameCount]));
	lastNameCount++;
	spawnCount++;
}

function drawGreenaeAtMousePointer() {
	if (spawnCount > 4) {
		canvas.style.cursor = 'default';
		return;
	}
	canvas.style.cursor = 'pointer';
	c.beginPath();
	c.arc(mouse.x, mouse.y, radiusArray[0] * animateStartingGreenaeSizeVar, 0, Math.PI * 2, false);

	animateStartingGreenaeSizeVar < 1 && mouse.x !== null
		? (animateStartingGreenaeSizeVar += 0.015)
		: (animateStartingGreenaeSizeVar = 0);

	c.fillStyle = 'rgb(24, 222, 84)';
	c.fill();
	c.strokeStyle = 'white';
	c.stroke();
}

// initilisation function
function init() {
	for (let index = 0; index < 20; index++) {
		runOneTime.push(true);
	}
	controlsSection.style.height = '95px';

	infoBox.style.width = '200px';
	canvas.width = innerWidth - parseFloat(infoBox.style.width);
	canvas.height = innerHeight;
	infoBox.height = innerHeight;

	// for (let index = 0; index < 5; index++) {
	// 	greenaeArray.push(
	// 		new Greenae(
	// 			randomIntFromRange(radiusArray[0] * 2, canvas.width - radiusArray[0] * 2),
	// 			randomIntFromRange(radiusArray[0] * 2, canvas.height - radiusArray[0] * 2),
	// 			Math.random() * 0.4,
	// 			1,
	// 			lastNameArray[lastNameCount]
	// 		)
	// 	);

	// 	lastNameCount++;
	// }
	canvas.addEventListener('mousedown', clickToSpawn);

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

	h4Container[1].style.left = '0px';
	h4Container[0].style.left = '140px';

	for (let i = 0; i < statusDivs.length; i++) {
		statusDivs[i].addEventListener('mouseover', function() {
			organismStatus.style.transform = 'translateX(-200px)';
			organismDivs[i].style.display = 'block';
			statusDivs[i].style.backgroundColor = 'rgb(30, 30, 30)';
			statusDivs[i].style.cursor = 'context-menu';
		});
		statusDivs[i].addEventListener('mouseout', function() {
			organismStatus.style.transform = 'translateX(200px)';
			organismDivs[i].style.display = 'none';
			statusDivs[i].style.backgroundColor = 'rgb(35, 35, 35)';
			statusDivs[i].style.cursor = 'default';
		});
	}
}

//Animation loop
function animate() {
	requestAnimationFrame(animate);

	// Refresh first name and last name array if the end of the array is reached
	if (firstNameCount > firstNameArray.length - 1) {
		firstNameCount = 0;
	}

	if (lastNameCount > lastNameArray.length - 1) {
		lastNameCount = 0;
	}

	// Check for collisions
	for (var i = 0; i < yellowinArray.length; i++) {
		if (
			yellowinArray[i].dead === true ||
			yellowinArray[i].energy > 20000 * Math.pow(yellowinArray[i].radius, 2) / Math.pow(radiusArray[1], 2)
		) {
			continue;
		}
		for (let j = 0; j < greenaeArray.length; j++) {
			if (
				getDistance(greenaeArray[j].x, greenaeArray[j].y, yellowinArray[i].x, yellowinArray[i].y) <
				greenaeArray[j].radius + yellowinArray[i].radius
			) {
				yellowinArray[i].energy =
					yellowinArray[i].energy +
					greenaeArray[j].adultNutritionalEnergyValue *
						Math.pow(greenaeArray[j].radius, 2) /
						Math.pow(greenaeArray[j].adultRadius, 2);
				greenaeArray.splice(j, 1);
			}
		}
	}

	for (var i = 0; i < orangetArray.length; i++) {
		if (
			orangetArray[i].dead === true ||
			orangetArray[i].energy > 40000 * Math.pow(orangetArray[i].radius, 2) / Math.pow(radiusArray[2], 2)
		) {
			continue;
		}
		for (let j = 0; j < yellowinArray.length; j++) {
			if (orangetArray[i].radius < yellowinArray[j].radius && yellowinArray[j].dead === false) {
				continue;
			}
			if (
				getDistance(yellowinArray[j].x, yellowinArray[j].y, orangetArray[i].x, orangetArray[i].y) <
				yellowinArray[j].radius + orangetArray[i].radius
			) {
				orangetArray[i].energy =
					orangetArray[i].energy +
					yellowinArray[j].adultNutritionalEnergyValue *
						Math.pow(yellowinArray[j].radius, 2) /
						Math.pow(yellowinArray[j].adultRadius, 2);
				yellowinArray.splice(j, 1);
			}
		}
	}

	// console.log(OrangetArray[Math.floor(OrangetArray.length / 2)]);

	// clear canvas
	c.clearRect(0, 0, canvas.width, canvas.height);

	drawGreenaeAtMousePointer();

	// Check for headlines
	checkForHeadlines();

	// update each Organism and draw the next frame
	for (let index = 0; index < speciesArray.length; index++) {
		speciesArray[index].forEach((e) => e.update());

		// Update bottom status bar
		if (speciesArray[index].hasMutated === true) {
			updatePopulation(speciesArray[index], index);
		} else if (speciesArray[index].length > 0) {
			initialiseStatusInfo(speciesArray[index]);
			speciesArray[index].hasMutated = true;
		}
	}

	let totalOrganisms = 0;
	for (let index = 0; index < speciesArray.length; index++) {
		totalOrganisms = totalOrganisms + speciesArray[index].length;
	}
	// console.log(totalOrganisms);
}

function initialiseStatusInfo(array) {
	speciesCountNodeList[array[0].hierarchy].textContent = array.length;
	speciesCircleNodeList[array[0].hierarchy].style.backgroundColor = array[0].color;
	speciesNameNodeList[array[0].hierarchy].textContent = array.nameOfOrganism;
	organismNameNodeList[array[0].hierarchy].textContent = array.nameOfOrganism;
	organismCircleNodeList[array[0].hierarchy].style.backgroundColor = array[0].color;
	statusDivs[array[0].hierarchy].style.display = 'flex';
}

// InfoBar
function makeStatusBoxShell() {
	let statusDiv = document.createElement('div');
	statusDiv.classList.add('statusDiv');
	let statusSpeciesCount = document.createElement('span');
	statusSpeciesCount.classList.add('speciesCount');
	statusDiv.appendChild(statusSpeciesCount);
	let statusSpeciesCircle = document.createElement('div');
	statusSpeciesCircle.classList.add('speciesCircle');
	statusDiv.appendChild(statusSpeciesCircle);
	let statusSpeciesName = document.createElement('span');
	statusSpeciesName.classList.add('speciesName');
	statusDiv.appendChild(statusSpeciesName);
	statusDiv.style.display = 'none';
	statusBox.appendChild(statusDiv);
}

function updatePopulation(array, i) {
	let oldestGeneration = 0;
	let populationCount = 0;
	let totalSize = 0;
	let totalVelocity = 0;
	array.forEach(function(e) {
		if (e.dead === false) {
			populationCount++;
			totalSize = totalSize + Math.PI * Math.pow(e.adultRadius, 2) / 100;
			totalVelocity = totalVelocity + 10 * e.baseVelocity;
		}
		e.generation > oldestGeneration ? (oldestGeneration = e.generation) : oldestGeneration;
	});

	let averageSize = Math.floor(totalSize / populationCount);
	let averageVelocity = totalVelocity / populationCount;
	averageVelocity = averageVelocity.toFixed(1);

	averageSize > 0
		? (aveSizeNodeList[i].textContent = 'Average Adult Size: ' + averageSize + 'kg')
		: (aveSizeNodeList[i].textContent = 'Average Adult Size: 0kg');

	averageVelocity >= 0
		? (aveSpeedNodeList[i].textContent = 'Average Speed: ' + averageVelocity + 'km/hr')
		: (aveSpeedNodeList[i].textContent = 'Average Speed: 0.0km/hr');
	oldestGenNodeList[i].textContent = 'Oldest Generation: ' + oldestGeneration;

	let extinctColor = 'rgb(80, 80, 80)';
	let criticalColor = 'red';
	let endangeredColor = 'orange';
	let vulnerableColor = 'yellow';
	let healthyColor = 'white';

	if (populationCount === 0) {
		speciesCountNodeList[i].style.color = extinctColor;
		speciesNameNodeList[i].style.color = extinctColor;
		// organismNameNodeList[i].style.color = extinctColor;
		organismCountNodeList[i].style.color = extinctColor;
		redListNodeList[i].style.color = extinctColor;
		redListNodeList[i].textContent = 'Extinct';
	} else if (populationCount < 11) {
		speciesCountNodeList[i].style.color = criticalColor;
		speciesNameNodeList[i].style.color = criticalColor;
		// organismNameNodeList[i].style.color = criticalColor;
		organismCountNodeList[i].style.color = criticalColor;
		redListNodeList[i].style.color = criticalColor;
		redListNodeList[i].textContent = 'Critical';
	} else if (populationCount < 50) {
		speciesCountNodeList[i].style.color = endangeredColor;
		speciesNameNodeList[i].style.color = endangeredColor;
		// organismNameNodeList[i].style.color = endangeredColor;
		organismCountNodeList[i].style.color = endangeredColor;
		redListNodeList[i].style.color = endangeredColor;
		redListNodeList[i].textContent = 'Endangered';
	} else if (populationCount < 200) {
		speciesCountNodeList[i].style.color = vulnerableColor;
		speciesNameNodeList[i].style.color = vulnerableColor;
		// organismNameNodeList[i].style.color = vulnerableColor;
		organismCountNodeList[i].style.color = vulnerableColor;
		redListNodeList[i].style.color = vulnerableColor;
		redListNodeList[i].textContent = 'Vulnerable';
	} else {
		speciesCountNodeList[i].style.color = healthyColor;
		speciesNameNodeList[i].style.color = healthyColor;
		// organismNameNodeList[i].style.color = healthyColor;
		organismCountNodeList[i].style.color = healthyColor;
		redListNodeList[i].style.color = healthyColor;
		redListNodeList[i].textContent = 'Healthy';
	}
	speciesCountNodeList[i].textContent = populationCount;
	organismCountNodeList[i].textContent = populationCount;
	return;
}

// Organism Status
function makeOrganismStatusShell() {
	let organismDiv = document.createElement('div');
	organismDiv.classList.add('statusDiv');
	let smallContainer = document.createElement('div');
	let statusSpeciesCircle = document.createElement('div');
	statusSpeciesCircle.classList.add('speciesCircle');
	smallContainer.appendChild(statusSpeciesCircle);
	let statusSpeciesName = document.createElement('span');
	statusSpeciesName.classList.add('speciesName');
	statusSpeciesName.textContent = 'Greenae';
	smallContainer.appendChild(statusSpeciesName);
	organismDiv.appendChild(smallContainer);
	let popCount = document.createElement('p');
	popCount.innerHTML = 'Population Count: <span class="speciesCount"></span>';
	organismDiv.appendChild(popCount);
	let popStatus = document.createElement('p');
	popStatus.innerHTML = 'Status: <span class="redList"></span>';
	organismDiv.appendChild(popStatus);
	let oldestGen = document.createElement('p');
	oldestGen.textContent = 'Oldest Generation: 6';
	organismDiv.appendChild(oldestGen);
	let aveSize = document.createElement('p');
	aveSize.textContent = 'Average Adult Size: ';
	organismDiv.appendChild(aveSize);
	let aveSpeed = document.createElement('p');
	aveSpeed.textContent = 'Average Speed: ';
	organismDiv.appendChild(aveSpeed);
	organismDiv.style.display = 'none';
	organismStatus.appendChild(organismDiv);
}

init();

animate();
