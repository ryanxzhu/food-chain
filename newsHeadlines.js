const headlines = {
	spawn: '- You spawned your first Greenae! Greenae are small creatures that grow using sunlight.',
	adulthood: '- Your first Greenae reaches adulthood! You can tell adults by their black skin.',
	breed: '- Your Greenae just reproduced an offspring! Offsprings are small and have a white skin.',
	death: '- Awww your first Greenae just died :( Dead Greenae have a green outer skin and transparent body.',
	yellowinMutated: '- Woah! One of your Greenae just mutated into a Yellowin, a new species!',
	yellowinEats: '- Looks like Yellowin love to eat Greenae. Not sure how I feel about that...',
	yellowinNoEnergy:
		'- A Yellowin just died from hunger! Yellowin must eat Greenae to survive and fade when they are starving.',
	sunlight: '- Woah so bright! Greenae love more sun, I think it makes them reproduce a lot faster.',
	fastForward: '- Hyperspeed! Fast forwarding time makes everything faster!'
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

	if (headlines['sunlight'] !== null) {
		if (sunlightFraction > 1.1) {
			reportNews('sunlight');
		}
	}

	if (headlines['fastForward'] !== null) {
		if (gameSpeed > 1) {
			reportNews('fastForward');
		}
	}
}

function reportNews(newsText) {
	if (headlines[newsText] === null) {
		return null;
	}

	let newsDiv = document.createElement('div');
	newsDiv.classList.add('headline');
	newsDiv.textContent = headlines[newsText];
	headlines[newsText] = null;
	newsArray.push(newsDiv);
	for (let index = Math.min(6, newsArray.length - 1); index >= 0; index--) {
		newsArray[index].style.opacity = (index + 1) / (Math.min(6, newsArray.length - 1) + 1);
		newsfeed.appendChild(newsArray[index]);
	}
}
