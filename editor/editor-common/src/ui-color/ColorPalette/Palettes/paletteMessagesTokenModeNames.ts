import { defineMessages } from 'react-intl-next';

// These messages are only to be used when showSomewhatSemanticTooltips is true.
export const lightTextPaletteTooltipMessages = defineMessages({
	'#FFFFFF': {
		id: 'fabric.theme.white',
		defaultMessage: 'White',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the white color option.',
	},
	'#B3D4FF': {
		id: 'fabric.theme.subtle-blue',
		defaultMessage: 'Subtle blue',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the subtle blue color option.',
	},
	'#B3F5FF': {
		id: 'fabric.theme.subtle-teal',
		defaultMessage: 'Subtle teal',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the subtle teal color option.',
	},
	'#ABF5D1': {
		id: 'fabric.theme.subtle-green',
		defaultMessage: 'Subtle green',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the subtle green color option.',
	},
	'#FFF0B3': {
		id: 'fabric.theme.subtle-yellow',
		defaultMessage: 'Subtle yellow',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the subtle yellow color option.',
	},
	'#FFBDAD': {
		id: 'fabric.theme.subtle-red',
		defaultMessage: 'Subtle red',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the subtle red color option.',
	},
	'#EAE6FF': {
		id: 'fabric.theme.subtle-purple',
		defaultMessage: 'Subtle purple',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the subtle purple color option.',
	},
	'#97A0AF': {
		id: 'fabric.theme.gray',
		defaultMessage: 'Gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the gray color option.',
	},
	'#4C9AFF': {
		id: 'fabric.theme.blue',
		defaultMessage: 'Blue',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the blue color option.',
	},
	'#00B8D9': {
		id: 'fabric.theme.teal',
		defaultMessage: 'Teal',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the teal color option.',
	},
	'#36B37E': {
		id: 'fabric.theme.green',
		defaultMessage: 'Green',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the green color option.',
	},
	'#FFC400': {
		id: 'fabric.theme.yellow',
		defaultMessage: 'Yellow',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the yellow color option.',
	},
	'#FF5630': {
		id: 'fabric.theme.red',
		defaultMessage: 'Red',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the red color option.',
	},
	'#FF991F': {
		id: 'fabric.theme.bold-orange',
		defaultMessage: 'Bold orange',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the bold orange color option.',
	},
	'#6554C0': {
		id: 'fabric.theme.purple',
		defaultMessage: 'Purple',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the purple color option.',
	},
	'#0747A6': {
		id: 'fabric.theme.bold-blue',
		defaultMessage: 'Bold blue',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the bold blue color option.',
	},
	'#008DA6': {
		id: 'fabric.theme.bold-teal',
		defaultMessage: 'Bold teal',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the bold teal color option.',
	},
	'#006644': {
		id: 'fabric.theme.bold-green',
		defaultMessage: 'Bold green',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the bold green color option.',
	},
	'#BF2600': {
		id: 'fabric.theme.bold-red',
		defaultMessage: 'Bold red',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the bold red color option.',
	},
	'#403294': {
		id: 'fabric.theme.bold-purple',
		defaultMessage: 'Bold purple',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the bold purple color option.',
	},
	'#172B4D': {
		id: 'fabric.theme.default',
		defaultMessage: 'Default',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker when the user hovers over the default color option.',
	},
});

const darkModeTextPaletteOverrides = defineMessages({
	'#FFFFFF': {
		id: 'fabric.theme.dark-gray',
		defaultMessage: 'Dark gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor text color picker in dark mode when the user hovers over the dark gray color option.',
	},
});

export const darkTextPaletteTooltipMessages = {
	...lightTextPaletteTooltipMessages,
	...darkModeTextPaletteOverrides,
};

export const textPaletteTooltipMessages = {
	light: lightTextPaletteTooltipMessages,
	dark: darkTextPaletteTooltipMessages,
};

export const lightBackgroundPaletteTooltipMessages = defineMessages({
	'#DEEBFF': {
		id: 'fabric.theme.subtle-blue',
		defaultMessage: 'Subtle blue',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the subtle blue color option.',
	},
	'#B3D4FF': {
		id: 'fabric.theme.blue',
		defaultMessage: 'Blue',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the blue color option.',
	},
	'#4C9AFF': {
		id: 'fabric.theme.bold-blue',
		defaultMessage: 'Bold blue',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the bold blue color option.',
	},
	'#E6FCFF': {
		id: 'fabric.theme.subtle-teal',
		defaultMessage: 'Subtle teal',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the subtle teal color option.',
	},
	'#B3F5FF': {
		id: 'fabric.theme.teal',
		defaultMessage: 'Teal',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the teal color option.',
	},
	'#79E2F2': {
		id: 'fabric.theme.bold-teal',
		defaultMessage: 'Bold teal',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the bold teal color option.',
	},
	'#E3FCEF': {
		id: 'fabric.theme.subtle-green',
		defaultMessage: 'Subtle green',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the subtle green color option.',
	},
	'#ABF5D1': {
		id: 'fabric.theme.green',
		defaultMessage: 'Green',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the green color option.',
	},
	'#57D9A3': {
		id: 'fabric.theme.bold-green',
		defaultMessage: 'Bold green',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the bold green color option.',
	},
	'#FFFAE6': {
		id: 'fabric.theme.subtle-yellow',
		defaultMessage: 'Subtle yellow',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the subtle yellow color option.',
	},
	'#FFF0B3': {
		id: 'fabric.theme.yellow',
		defaultMessage: 'Yellow',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the yellow color option.',
	},
	'#FFC400': {
		id: 'fabric.theme.bold-yellow',
		defaultMessage: 'Bold yellow',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the bold yellow color option.',
	},
	'#FFEBE6': {
		id: 'fabric.theme.subtle-red',
		defaultMessage: 'Subtle red',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the subtle red color option.',
	},
	'#FFBDAD': {
		id: 'fabric.theme.red',
		defaultMessage: 'Red',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the red color option.',
	},
	'#FF8F73': {
		id: 'fabric.theme.bold-red',
		defaultMessage: 'Bold red',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the bold red color option.',
	},
	'#EAE6FF': {
		id: 'fabric.theme.subtle-purple',
		defaultMessage: 'Subtle purple',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the subtle purple color option.',
	},
	'#C0B6F2': {
		id: 'fabric.theme.purple',
		defaultMessage: 'Purple',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the purple color option.',
	},
	'#998DD9': {
		id: 'fabric.theme.bold-purple',
		defaultMessage: 'Bold purple',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the bold purple color option.',
	},
	'#FFFFFF': {
		id: 'fabric.theme.white',
		defaultMessage: 'White',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the white color option.',
	},
	'#F4F5F7': {
		id: 'fabric.theme.gray',
		defaultMessage: 'Gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the gray color option.',
	},
	'#B3BAC5': {
		id: 'fabric.theme.bold-gray',
		defaultMessage: 'Bold gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker when the user hovers over the bold gray color option.',
	},
});

const darkModeBackgroundPaletteOverrides = defineMessages({
	'#FFFFFF': {
		id: 'fabric.theme.subtle-gray',
		defaultMessage: 'Subtle gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker in dark mode when the user hovers over the subtle gray color option.',
	},
	'#B3BAC5': {
		id: 'fabric.theme.bold-gray',
		defaultMessage: 'Bold gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor background color picker in dark mode when the user hovers over the bold gray color option.',
	},
});

export const darkBackgroundPaletteTooltipMessages = {
	...lightBackgroundPaletteTooltipMessages,
	...darkModeBackgroundPaletteOverrides,
};

export const backgroundPaletteTooltipMessages = {
	light: lightBackgroundPaletteTooltipMessages,
	dark: darkBackgroundPaletteTooltipMessages,
};

export const lightChartsColorPaletteTooltipMessages = defineMessages({
	// Blue color
	'#7AB2FF': {
		id: 'fabric.theme.subtle-blue',
		defaultMessage: 'Subtle blue',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the subtle blue color option.',
	},
	'#247FFF': {
		id: 'fabric.theme.blue',
		defaultMessage: 'Blue',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the blue color option.',
	},
	'#0055CC': {
		id: 'fabric.theme.bold-blue',
		defaultMessage: 'Bold blue',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bold blue color option.',
	},
	'#003884': {
		id: 'fabric.theme.bolder-blue',
		defaultMessage: 'Bolder blue',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bolder blue color option.',
	},

	// Teal color
	'#60C6D2': {
		id: 'fabric.theme.subtle-teal',
		defaultMessage: 'Subtle teal',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the subtle teal color option.',
	},
	'#1D9AAA': {
		id: 'fabric.theme.teal',
		defaultMessage: 'Teal',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the teal color option.',
	},
	'#1D7F8C': {
		id: 'fabric.theme.bold-teal',
		defaultMessage: 'Bold teal',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bold teal color option.',
	},
	'#206B74': {
		id: 'fabric.theme.bolder-teal',
		defaultMessage: 'Bolder teal',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bolder teal color option.',
	},

	// Green color
	'#6BE1B0': {
		id: 'fabric.theme.subtle-green',
		defaultMessage: 'Subtle green',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the subtle green color option.',
	},
	'#23A971': {
		id: 'fabric.theme.green',
		defaultMessage: 'Green',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the green color option.',
	},
	'#177D52': {
		id: 'fabric.theme.bold-green',
		defaultMessage: 'Bold green',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bold green color option.',
	},
	'#055C3F': {
		id: 'fabric.theme.bolder-green',
		defaultMessage: 'Bolder green',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bolder green color option.',
	},

	// Yellow color
	'#FFDB57': {
		id: 'fabric.theme.subtle-yellow',
		defaultMessage: 'Subtle yellow',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the subtle yellow color option.',
	},
	'#FFBE33': {
		id: 'fabric.theme.yellow',
		defaultMessage: 'Yellow',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the yellow color option.',
	},
	'#FF9D00': {
		id: 'fabric.theme.bold-yellow',
		defaultMessage: 'Bold yellow',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bold yellow color option.',
	},
	'#946104': {
		id: 'fabric.theme.bolder-yellow',
		defaultMessage: 'Bolder yellow',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bolder yellow color option.',
	},

	// Red color
	'#FF8F73': {
		id: 'fabric.theme.subtle-red',
		defaultMessage: 'Subtle red',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the subtle red color option.',
	},
	'#FC552C': {
		id: 'fabric.theme.red',
		defaultMessage: 'Red',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the red color option.',
	},
	'#D32D03': {
		id: 'fabric.theme.bold-red',
		defaultMessage: 'Bold red',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bold red color option.',
	},
	'#A32000': {
		id: 'fabric.theme.bolder-red',
		defaultMessage: 'Bolder red',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bolder red color option.',
	},

	// Orange color
	'#FAA53D': {
		id: 'fabric.theme.subtle-orange',
		defaultMessage: 'Subtle orange',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the subtle orange color option.',
	},
	'#D97008': {
		id: 'fabric.theme.orange',
		defaultMessage: 'Orange',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the orange color option.',
	},
	'#B65C02': {
		id: 'fabric.theme.bold-orange',
		defaultMessage: 'Bold orange',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bold orange color option.',
	},
	'#974F0C': {
		id: 'fabric.theme.bolder-orange',
		defaultMessage: 'Bolder orange',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bolder orange color option.',
	},

	// Magenta color
	'#E774BB': {
		id: 'fabric.theme.subtle-magenta',
		defaultMessage: 'Subtle magenta',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the subtle magenta color option.',
	},
	'#DA62AC': {
		id: 'fabric.theme.magenta',
		defaultMessage: 'Magenta',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the magenta color option.',
	},
	'#CD519D': {
		id: 'fabric.theme.bold-magenta',
		defaultMessage: 'Bold magenta',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bold magenta color option.',
	},
	'#943D73': {
		id: 'fabric.theme.bolder-magenta',
		defaultMessage: 'Bolder magenta',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bolder magenta color option.',
	},

	// Purple color
	'#B5A7FB': {
		id: 'fabric.theme.subtle-purple',
		defaultMessage: 'Subtle purple',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the subtle purple color option.',
	},
	'#8B77EE': {
		id: 'fabric.theme.purple',
		defaultMessage: 'Purple',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the purple color option.',
	},
	'#5A43D0': {
		id: 'fabric.theme.bold-purple',
		defaultMessage: 'Bold purple',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bold purple color option.',
	},
	'#44368B': {
		id: 'fabric.theme.bolder-purple',
		defaultMessage: 'Bolder purple',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bolder purple color option.',
	},

	// Gray color
	'#8993A5': {
		id: 'fabric.theme.subtle-gray',
		defaultMessage: 'Subtle gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the subtle gray color option.',
	},
	'#8590A2': {
		id: 'fabric.theme.gray',
		defaultMessage: 'Gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the gray color option.',
	},
	'#758195': {
		id: 'fabric.theme.bold-gray',
		defaultMessage: 'Bold gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bold gray color option.',
	},
	'#44546F': {
		id: 'fabric.theme.bolder-gray',
		defaultMessage: 'Bolder gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor charts color picker when the user hovers over the bolder gray color option.',
	},
});

const darkChartsColorPaletteTooltipMessages = {
	...lightChartsColorPaletteTooltipMessages,
};

export const chartsColorPaletteTooltipMessages = {
	light: lightChartsColorPaletteTooltipMessages,
	dark: darkChartsColorPaletteTooltipMessages,
};

const lightBorderPaletteTooltipMessages = defineMessages({
	'#091E4224': {
		id: 'fabric.theme.subtle-gray',
		defaultMessage: 'Subtle gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor border color picker when the user hovers over the subtle gray color option.',
	},
	'#758195': {
		id: 'fabric.theme.gray',
		defaultMessage: 'Gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor border color picker when the user hovers over the gray color option.',
	},
	'#172B4D': {
		id: 'fabric.theme.bold-gray',
		defaultMessage: 'Bold gray',
		description:
			'The text is shown as a tooltip label for a color swatch in the editor border color picker when the user hovers over the bold gray color option.',
	},
});

const darkBorderPaletteTooltipMessages = {
	...lightBorderPaletteTooltipMessages,
};

export const borderPaletteTooltipMessages = {
	light: lightBorderPaletteTooltipMessages,
	dark: darkBorderPaletteTooltipMessages,
};
