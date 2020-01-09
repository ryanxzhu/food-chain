const canvas = document.querySelector('canvas');
const controlsSection = document.querySelector('#controls');
const sunlightSlider = document.querySelector('#sunlightSlider');
canvas.style.height = window.innerHeight - parseFloat(controlsSection.style.height) + 'px';

var rgb = {
	r: 0,
	g: 0,
	b: 0
};

// const brownColorArray = [];

// let newRGB = { ...rgb };

// // newRGB.r = 20;
// // newRGB.g = 15;
// // newRGB.b = 10;
// // console.log(newRGB);

// for (var i = 0; i < 34; i++) {
// 	rgb.r = Math.floor(104 / 33 * i);
// 	rgb.g = Math.floor(52 / 33 * i);
// 	brownColorArray.push({ ...rgb });
// }

// for (var i = 1; i < 23; i++) {
// 	rgb.r = 104 + Math.floor(37 / 22 * i);
// 	rgb.g = 52 + Math.floor(43 / 22 * i);
// 	rgb.b = Math.floor(49 / 22 * i);
// 	brownColorArray.push({ ...rgb });
// }

// for (var i = 1; i < 23; i++) {
// 	rgb.r = 141 + Math.floor(50 / 22 * i);
// 	rgb.g = 95 + Math.floor(65 / 22 * i);
// 	rgb.b = 48 + Math.floor(81 / 22 * i);
// 	brownColorArray.push({ ...rgb });
// }

// for (var i = 1; i < 23; i++) {
// 	rgb.r = 191 + Math.floor(64 / 22 * i);
// 	rgb.g = 160 + Math.floor(84 / 22 * i);
// 	rgb.b = 129 + Math.floor(103 / 22 * i);
// 	brownColorArray.push({ ...rgb });
// }

// for (let i = 0; i < brownColorArray.length; i++) {
// 	brownColorArray[i] =
// 		'rgb(' + brownColorArray[i].r + ', ' + brownColorArray[i].g + ', ' + brownColorArray[i].b + ')';
// }

// console.log(brownColorArray);
// canvas.style.backgroundColor = brownColorArray[75];

// sunlightSlider.addEventListener('input', function() {
// 	canvas.style.backgroundColor = brownColorArray[this.value];
// });

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

console.log(brownColorArray);
canvas.style.backgroundColor = brownColorArray[50];

sunlightSlider.addEventListener('input', function() {
	canvas.style.backgroundColor = brownColorArray[this.value];
});
