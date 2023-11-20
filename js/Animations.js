export function FadeProps(propGroup, fadeSpeed) {
	const epsilon = 0.00001;
	propGroup.traverse((prop) => {
		if (prop.type === "Mesh") {
			let limitOpacity =
				fadeSpeed > 0
					? prop.fadeInTarget !== undefined
						? prop.fadeInTarget
						: 1
					: prop.fadeOutTarget !== undefined
					? prop.fadeOutTarget
					: 0;
			if (
				(fadeSpeed > 0 && prop.material.opacity < limitOpacity - epsilon) ||
				(fadeSpeed < 0 && prop.material.opacity > limitOpacity + epsilon)
			) {
				prop.material.opacity += fadeSpeed;
			}
		}
	});

	propGroup.opacity += fadeSpeed;
}

export function TransitionProps(
	scene,
	clock,
	transitionProps,
	transitionSpeed,
	pages,
	currentPageIndex,
	gamePropIndexes,
) {
	const [fadeOutProp, fadeInProp] = transitionProps;

	switch (true) {
		case fadeOutProp.opacity > 0:
			FadeProps(fadeOutProp, -transitionSpeed);

			if (fadeOutProp.opacity <= 0) {
				scene.remove(fadeOutProp);
			}
			break;

		case fadeInProp.opacity < 1:
			FadeProps(fadeInProp, transitionSpeed);

			if (fadeInProp.opacity >= 1) {
				if (pages[currentPageIndex] === "game") {
					fadeInProp.children[gamePropIndexes.cardContent].visible = true;
					fadeInProp.children[gamePropIndexes.cards].children[1].visible = true;
					clock.start();
				}

				transitionProps[0] = null;
				transitionProps[1] = null;

				document.body.style.cursor = "default";

				return pages[currentPageIndex];
			}
			break;

		default:
			break;
	}

	return "transition";
}

export function TransitionRegistrationProps(
	transitionRegistrationProps,
	registrationTitleOptions,
	transitionSpeed,
	pages,
	currentPageIndex,
) {
	const [fadeOutGroups, fadeInGroups, registrationTitleProp] =
		transitionRegistrationProps;
	let page = "transition";
	let allFadedOut = true;
	let notFaded = [];

	for (let i = 0; i < fadeOutGroups.length; i++) {
		let fadeOutProp = fadeOutGroups[i];

		if (fadeOutProp.opacity > 0) {
			notFaded.push(fadeOutProp);
		}
	}

	for (let i = 0; i < notFaded.length; i++) {
		if (!fadeInGroups.includes(notFaded[i])) {
			allFadedOut = false;
		}
	}

	if (!allFadedOut) {
		let allFadedOut = true;
		for (let i = 0; i < notFaded.length; i++) {
			let fadeOutProp = notFaded[i];

			FadeProps(fadeOutProp, -transitionSpeed);

			if (fadeOutProp.opacity > 0) {
				allFadedOut = false;
			}

			if (allFadedOut) {
				let nextPage = pages[currentPageIndex];
				let registrationIndex = nextPage.charAt(nextPage.length - 1);
				registrationTitleProp.children[0].text =
					registrationTitleOptions[registrationIndex];
			}
		}
	} else {
		let allFadedIn = true;
		for (let i = 0; i < fadeInGroups.length; i++) {
			let fadeInProp = fadeInGroups[i];

			if (fadeInProp.opacity < 1) {
				FadeProps(fadeInProp, transitionSpeed);
				allFadedIn = false;
			}
		}

		if (allFadedIn) {
			transitionRegistrationProps[0] = [];
			transitionRegistrationProps[1] = [];
			transitionRegistrationProps[2] = null;

			document.body.style.cursor = "default";
			page = pages[currentPageIndex];
		}
	}

	return page;
}

export function HandleTransitionClick() {
	document.body.style.cursor = "not-allowed";
	setTimeout(() => {
		document.body.style.cursor = "progress";
	}, 100);
}

export function HandleTransitionHover() {
	document.body.style.cursor = "progress";
}
