let newsArray = [];
let YellowinPopulation = 0;
let GreenaePopulation = 0;
let OrangetPopulation = 0;

const headlines = {
	spawn: '- You spawned your first Greenae! Greenae are small plants that grow using sunlight.',
	adulthood: '- Your first Greenae reaches adulthood! You can tell adults by their black exterior.',
	breed: '- Your Greenae just reproduced! Greenae seedlings are small and have a white exterior.',
	death: '- Awww your first Greenae just died :( Dead Greenae have a green exterior and transparent body.',
	yellowinMutated: '- Woah! One of your Greenae just mutated into a Yellowin, a new species!',
	yellowinEats: '- Looks like Yellowin love to eat Greenae. Not sure how I feel about that...',
	yellowinNoEnergy:
		'- A Yellowin just died from hunger! Yellowin must eat Greenae to survive and fade when they are starving.',
	sunlight: '- Woah so bright! Greenae love more sun, I think it makes them reproduce a lot faster.',
	fastForward: '- Hyperspeed! Fast forwarding time makes everything faster!',
	planted5: '- Seeding 5 Greenae should be enough to start them off. They can grow by themselves from here.',
	moreYellowinThanGreenae: '- Wow the Yellowin have really taken over! There are more of them than Greenae now.',
	healthyPopulationGreenae:
		'- Your Greenae population has finally grown to a healthy level! See population status below.',
	yellowinExtinct:
		'- Aww no your Yellowin population just went extinct! Hopefully another Greenae might mutate into a Yellowin soon.',
	greenaeExtinct:
		"Aww no your Greenae population just went extinct! Without them your ecosystem can't survive unfortunately. Restart to try again!",
	orangetMutated: '- Wow what is that? Is that an Oranget I see?!!',
	orangetExtinct: "- It's a tough life out there for Oranget, they can only eat Yellowin and there's so little food.",
	orangetEats: '- If I look carefully, it looks like the Oranget eat the Yellowin. How brutal.'
};

function checkForHeadlines() {
	if (headlines['spawn'] !== null) {
		if (greenaeArray.length > 0) {
			reportNews('spawn');
		}
	}

	if (headlines['adulthood'] !== null) {
		greenaeArray.forEach((e) => {
			if (e.life > e.puberty) {
				reportNews('adulthood');
			}
		});
	}

	if (headlines['breed'] !== null) {
		if (greenaeArray.length > 5) {
			reportNews('breed');
		}
	}

	if (headlines['death'] !== null) {
		greenaeArray.forEach((e) => {
			if (e.dead === true) {
				reportNews('death');
			}
		});
	}

	if (headlines['yellowinMutated'] !== null) {
		if (yellowinArray.length > 0) {
			reportNews('yellowinMutated');
		}
	}

	if (headlines['sunlight'] !== null) {
		if (sunlightFraction > 1.1) {
			reportNews('sunlight');
		}
	}

	if (headlines['yellowinEats'] !== null) {
		yellowinArray.forEach((e) => {
			if (e.energy > 20000) {
				reportNews('yellowinEats');
			}
		});
	}

	if (headlines['yellowinNoEnergy'] !== null) {
		yellowinArray.forEach((e) => {
			if (e.dead === true) {
				reportNews('yellowinNoEnergy');
			}
		});
	}

	if (headlines['fastForward'] !== null) {
		if (gameSpeed > 1) {
			reportNews('fastForward');
		}
	}

	if (headlines['planted5'] !== null) {
		if (spawnCount > 4) {
			reportNews('planted5');
		}
	}

	if (headlines['moreYellowinThanGreenae'] !== null) {
		if (parseInt(speciesCountNodeList[1].textContent) > parseInt(speciesCountNodeList[0].textContent)) {
			reportNews('moreYellowinThanGreenae');
		}
	}

	if (headlines['healthyPopulationGreenae'] !== null) {
		let populationCount = 0;
		greenaeArray.forEach((e) => {
			if (e.dead !== true) {
				populationCount++;
			}
		});
		if (populationCount > 199) {
			reportNews('healthyPopulationGreenae');
		}
	}

	if (headlines['yellowinExtinct'] !== null) {
		let tempPopulation = 0;
		yellowinArray.forEach((e) => {
			if (e.dead !== true) {
				tempPopulation++;
			}
		});
		if (tempPopulation > 10) {
			YellowinPopulation = tempPopulation;
		}
		if (tempPopulation === 0 && YellowinPopulation > 10) {
			reportNews('yellowinExtinct');
		}
	}

	if (headlines['greenaeExtinct'] !== null) {
		let tempPopulation = 0;
		greenaeArray.forEach((e) => {
			if (e.dead !== true) {
				tempPopulation++;
			}
		});
		if (tempPopulation > 0) {
			GreenaePopulation = tempPopulation;
		}
		if (tempPopulation === 0 && GreenaePopulation > 0) {
			reportNews('greenaeExtinct');
		}
	}

	if (headlines['orangetMutated'] !== null) {
		if (orangetArray.length > 0) {
			reportNews('orangetMutated');
		}
	}

	if (headlines['orangetExtinct'] !== null) {
		let tempPopulation = 0;
		orangetArray.forEach((e) => {
			if (e.dead !== true) {
				tempPopulation++;
			}
		});
		if (tempPopulation > 10) {
			OrangetPopulation = tempPopulation;
		}
		if (tempPopulation === 0 && OrangetPopulation > 5) {
			reportNews('orangetExtinct');
		}
	}

	if (headlines['orangetEats'] !== null) {
		orangetArray.forEach((e) => {
			if (e.energy > 20000) {
				reportNews('orangetEats');
			}
		});
	}
}

function reportNews(newsText) {
	if (headlines[newsText] === null) {
		return null;
	}

	const newsSound = new Audio();
	newsSound.src = 'news-sound.wav';
	newsSound.play();
	let newsDiv = document.createElement('div');
	newsDiv.classList.add('headline');
	newsDiv.textContent = headlines[newsText];
	headlines[newsText] = null;
	newsArray.push(newsDiv);
	let newsOpacity = 1;

	for (let index = newsArray.length - 1; index >= 0; index--) {
		newsArray[index].style.opacity = newsOpacity;
		newsOpacity -= 0.2;
		newsfeed.appendChild(newsArray[index]);
	}
}
