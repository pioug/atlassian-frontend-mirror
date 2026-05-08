const hex = '[a-z0-9]';
const shortHandHexColorPattern = new RegExp(`#(${hex})(${hex})(${hex})`, 'i');

const repeat = (str: string, times: number) => [...Array(times)].map(() => str).join('');

const isShortHexColor = (color: string) => color && color.length === 4;

const completeHexColor = (colors: string[]) => {
	const hex = colors.map((color) => repeat(color, 2)).join('');
	return `#${hex}`;
};

const completeTriplet = (colors: string[]) => `#${repeat(colors[1], 6)}`;

const isTriplet = (colors: string[]) => colors[0] === colors[1] && colors[1] === colors[2];

export const convertHexShorthand = (color: string): string => {
	if (isShortHexColor(color)) {
		// when color = '#ccc', matches is structured as ['#ccc', 'c', 'c', 'c', ...]
		const matches = color.match(shortHandHexColorPattern);
		if (matches) {
			const colors = matches.slice(1, 4);
			if (isTriplet(colors)) {
				return completeTriplet(colors);
			} else {
				return completeHexColor(colors);
			}
		}
	}

	// return the color as is when it's not hex color shorthand
	return color;
};
