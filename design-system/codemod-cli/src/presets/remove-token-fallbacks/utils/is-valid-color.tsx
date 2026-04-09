const namedColors: { [key: string]: string } = {
	black: '#000000',
	silver: '#C0C0C0',
	gray: '#808080',
	grey: '#808080',
	pink: '#FFC0CB',
	white: '#FFFFFF',
	maroon: '#800000',
	red: '#FF0000',
	purple: '#800080',
	fuchsia: '#FF00FF',
	green: '#008000',
	lime: '#00FF00',
	olive: '#808000',
	yellow: '#FFFF00',
	navy: '#000080',
	blue: '#0000FF',
	teal: '#008080',
	aqua: '#00FFFF',
};

export function isValidColor(color: string): boolean {
	// Check if it's a named color
	if (namedColors[color.toLowerCase()]) {
		return true;
	}
	// Check for hex colors (including those with alpha)
	if (/^#([0-9A-F]{3}){1,2}([0-9A-F]{2})?$/i.test(color)) {
		return true;
	}
	// Check for rgba() values
	if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0?\.)?\d+\s*)?\)$/i.test(color)) {
		return true;
	}
	return false;
}
