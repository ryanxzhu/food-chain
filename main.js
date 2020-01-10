const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const controlsSection = document.querySelector('#controls');
const sunlightSlider = document.querySelector('#sunlightSlider');
const worldSpeedSlider = document.querySelector('#worldSpeedSlider');
const h4Container = document.querySelector('#h4-container');
const h4 = document.querySelector('h4');
const gameSpeedArray = [ 1, 2, 3, 4 ];
var gameSpeed = gameSpeedArray[0];
var mouse = {
	x: -200,
	y: 200
};

init();

animate();

// initilisation function
function init() {
	controlsSection.style.height = '95px';

	canvas.width = innerWidth;
	canvas.height = innerHeight;

	const brownColorArray = createBrownArray();

	canvas.style.backgroundColor = brownColorArray[50];

	// Event Listeners for sunlight and work speed range input
	sunlightSlider.addEventListener('input', function() {
		canvas.style.backgroundColor = brownColorArray[this.value];
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

//Utility Functions

function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function resultantVelocity(xVelocity, yVelocity) {
	return Math.sqrt(Math.pow(xVelocity, 2) + Math.pow(yVelocity, 2));
}

function angleOfDirection(xVelocity, yVelocity, resultantVelocity) {
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

function changeAngle(angle) {
	let random = Math.random();
	let newAngle = random < 0.5 ? angle + 0.1 : angle - 0.1;
	newAngle = newAngle < 0 ? Math.PI * 2 + newAngle : newAngle;
	newAngle = newAngle >= Math.PI * 2 ? newAngle - Math.PI * 2 : newAngle;

	return newAngle;
}

function findXVelocity(angle, velocity) {
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

function findYVelocity(angle, velocity) {
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

//Animation loop
function animate() {
	requestAnimationFrame(animate);

	c.clearRect(0, 0, canvas.width, canvas.height);
	c.fillText('mouse', mouse.x, mouse.y);
}

// Objects
function Organism(x, y, size, color) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.color = color;
}
