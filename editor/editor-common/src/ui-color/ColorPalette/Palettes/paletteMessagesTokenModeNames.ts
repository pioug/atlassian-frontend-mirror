import { defineMessages } from 'react-intl-next';

// These messages are only to be used when showSomewhatSemanticTooltips is true.
export const lightTextPaletteTooltipMessages = defineMessages({
  '#FFFFFF': {
    id: 'fabric.theme.white',
    defaultMessage: 'White',
    description: 'Name of a color',
  },
  '#B3D4FF': {
    id: 'fabric.theme.subtle-blue',
    defaultMessage: 'Subtle blue',
    description: 'Name of a color',
  },
  '#B3F5FF': {
    id: 'fabric.theme.subtle-teal',
    defaultMessage: 'Subtle teal',
    description: 'Name of a color',
  },
  '#ABF5D1': {
    id: 'fabric.theme.subtle-green',
    defaultMessage: 'Subtle green',
    description: 'Name of a color',
  },
  '#FFF0B3': {
    id: 'fabric.theme.subtle-yellow',
    defaultMessage: 'Subtle yellow',
    description: 'Name of a color',
  },
  '#FFBDAD': {
    id: 'fabric.theme.subtle-red',
    defaultMessage: 'Subtle red',
    description: 'Name of a color',
  },
  '#EAE6FF': {
    id: 'fabric.theme.subtle-purple',
    defaultMessage: 'Subtle purple',
    description: 'Name of a color',
  },
  '#97A0AF': {
    id: 'fabric.theme.gray',
    defaultMessage: 'Gray',
    description: 'Name of a color',
  },
  '#4C9AFF': {
    id: 'fabric.theme.blue',
    defaultMessage: 'Blue',
    description: 'Name of a color',
  },
  '#00B8D9': {
    id: 'fabric.theme.teal',
    defaultMessage: 'Teal',
    description: 'Name of a color',
  },
  '#36B37E': {
    id: 'fabric.theme.green',
    defaultMessage: 'Green',
    description: 'Name of a color',
  },
  '#FFC400': {
    id: 'fabric.theme.yellow',
    defaultMessage: 'Yellow',
    description: 'Name of a color',
  },
  '#FF5630': {
    id: 'fabric.theme.red',
    defaultMessage: 'Red',
    description: 'Name of a color.',
  },
  '#FF991F': {
    id: 'fabric.theme.bold-orange',
    defaultMessage: 'Bold orange',
    description: 'Name of a color.',
  },
  '#6554C0': {
    id: 'fabric.theme.purple',
    defaultMessage: 'Purple',
    description: 'Name of a color',
  },
  '#0747A6': {
    id: 'fabric.theme.bold-blue',
    defaultMessage: 'Bold blue',
    description: 'Name of a color',
  },
  '#008DA6': {
    id: 'fabric.theme.bold-teal',
    defaultMessage: 'Bold teal',
    description: 'Name of a color',
  },
  '#006644': {
    id: 'fabric.theme.bold-green',
    defaultMessage: 'Bold green',
    description: 'Name of a color',
  },
  '#BF2600': {
    id: 'fabric.theme.bold-red',
    defaultMessage: 'Bold red',
    description: 'Name of a color',
  },
  '#403294': {
    id: 'fabric.theme.bold-purple',
    defaultMessage: 'Bold purple',
    description: 'Name of a color',
  },
  '#172B4D': {
    id: 'fabric.theme.default',
    defaultMessage: 'Default',
    description: 'Name of a color',
  },
});

const darkModeTextPaletteOverrides = defineMessages({
  '#FFFFFF': {
    id: 'fabric.theme.dark-gray',
    defaultMessage: 'Dark gray',
    description: 'Name of a color',
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
    description: 'Name of a color',
  },
  '#B3D4FF': {
    id: 'fabric.theme.blue',
    defaultMessage: 'Blue',
    description: 'Name of a color',
  },
  '#4C9AFF': {
    id: 'fabric.theme.bold-blue',
    defaultMessage: 'Bold blue',
    description: 'Name of a color',
  },
  '#E6FCFF': {
    id: 'fabric.theme.subtle-teal',
    defaultMessage: 'Subtle teal',
    description: 'Name of a color',
  },
  '#B3F5FF': {
    id: 'fabric.theme.teal',
    defaultMessage: 'Teal',
    description: 'Name of a color',
  },
  '#79E2F2': {
    id: 'fabric.theme.bold-teal',
    defaultMessage: 'Bold teal',
    description: 'Name of a color',
  },
  '#E3FCEF': {
    id: 'fabric.theme.subtle-green',
    defaultMessage: 'Subtle green',
    description: 'Name of a color',
  },
  '#ABF5D1': {
    id: 'fabric.theme.green',
    defaultMessage: 'Green',
    description: 'Name of a color',
  },
  '#57D9A3': {
    id: 'fabric.theme.bold-green',
    defaultMessage: 'Bold green',
    description: 'Name of a color',
  },
  '#FFFAE6': {
    id: 'fabric.theme.subtle-yellow',
    defaultMessage: 'Subtle yellow',
    description: 'Name of a color',
  },
  '#FFF0B3': {
    id: 'fabric.theme.yellow',
    defaultMessage: 'Yellow',
    description: 'Name of a color',
  },
  '#FFC400': {
    id: 'fabric.theme.bold-yellow',
    defaultMessage: 'Bold yellow',
    description: 'Name of a color',
  },
  '#FFEBE6': {
    id: 'fabric.theme.subtle-red',
    defaultMessage: 'Subtle red',
    description: 'Name of a color',
  },
  '#FFBDAD': {
    id: 'fabric.theme.red',
    defaultMessage: 'Red',
    description: 'Name of a color.',
  },
  '#FF8F73': {
    id: 'fabric.theme.bold-red',
    defaultMessage: 'Bold red',
    description: 'Name of a color',
  },
  '#EAE6FF': {
    id: 'fabric.theme.subtle-purple',
    defaultMessage: 'Subtle purple',
    description: 'Name of a color',
  },
  '#C0B6F2': {
    id: 'fabric.theme.purple',
    defaultMessage: 'Purple',
    description: 'Name of a color',
  },
  '#998DD9': {
    id: 'fabric.theme.bold-purple',
    defaultMessage: 'Bold purple',
    description: 'Name of a color',
  },
  '#FFFFFF': {
    id: 'fabric.theme.white',
    defaultMessage: 'White',
    description: 'Name of a color',
  },
  '#F4F5F7': {
    id: 'fabric.theme.gray',
    defaultMessage: 'Gray',
    description: 'Name of a color',
  },
  '#B3BAC5': {
    id: 'fabric.theme.bold-gray',
    defaultMessage: 'Bold gray',
    description: 'Name of a color',
  },
});

const darkModeBackgroundPaletteOverrides = defineMessages({
  '#FFFFFF': {
    id: 'fabric.theme.subtle-gray',
    defaultMessage: 'Subtle gray',
    description: 'Name of a color',
  },
  '#B3BAC5': {
    id: 'fabric.theme.bold-gray',
    defaultMessage: 'Bold gray',
    description: 'Name of a color',
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
    description: 'Name of a color',
  },
  '#247FFF': {
    id: 'fabric.theme.blue',
    defaultMessage: 'Blue',
    description: 'Name of a color',
  },
  '#0055CC': {
    id: 'fabric.theme.bold-blue',
    defaultMessage: 'Bold blue',
    description: 'Name of a color',
  },
  '#003884': {
    id: 'fabric.theme.bolder-blue',
    defaultMessage: 'Bolder blue',
    description: 'Name of a color',
  },

  // Teal color
  '#60C6D2': {
    id: 'fabric.theme.subtle-teal',
    defaultMessage: 'Subtle teal',
    description: 'Name of a color',
  },
  '#1D9AAA': {
    id: 'fabric.theme.teal',
    defaultMessage: 'Teal',
    description: 'Name of a color',
  },
  '#1D7F8C': {
    id: 'fabric.theme.bold-teal',
    defaultMessage: 'Bold teal',
    description: 'Name of a color',
  },
  '#206B74': {
    id: 'fabric.theme.bolder-teal',
    defaultMessage: 'Bolder teal',
    description: 'Name of a color',
  },

  // Green color
  '#6BE1B0': {
    id: 'fabric.theme.subtle-green',
    defaultMessage: 'Subtle green',
    description: 'Name of a color',
  },
  '#23A971': {
    id: 'fabric.theme.green',
    defaultMessage: 'Green',
    description: 'Name of a color',
  },
  '#177D52': {
    id: 'fabric.theme.bold-green',
    defaultMessage: 'Bold green',
    description: 'Name of a color',
  },
  '#055C3F': {
    id: 'fabric.theme.bolder-green',
    defaultMessage: 'Bolder green',
    description: 'Name of a color',
  },

  // Yellow color
  '#FFDB57': {
    id: 'fabric.theme.subtle-yellow',
    defaultMessage: 'Subtle yellow',
    description: 'Name of a color',
  },
  '#FFBE33': {
    id: 'fabric.theme.yellow',
    defaultMessage: 'Yellow',
    description: 'Name of a color',
  },
  '#FF9D00': {
    id: 'fabric.theme.bold-yellow',
    defaultMessage: 'Bold yellow',
    description: 'Name of a color',
  },
  '#946104': {
    id: 'fabric.theme.bolder-yellow',
    defaultMessage: 'Bolder yellow',
    description: 'Name of a color',
  },

  // Red color
  '#FF8F73': {
    id: 'fabric.theme.subtle-red',
    defaultMessage: 'Subtle red',
    description: 'Name of a color',
  },
  '#FC552C': {
    id: 'fabric.theme.red',
    defaultMessage: 'Red',
    description: 'Name of a color.',
  },
  '#D32D03': {
    id: 'fabric.theme.bold-red',
    defaultMessage: 'Bold red',
    description: 'Name of a color',
  },
  '#A32000': {
    id: 'fabric.theme.bolder-red',
    defaultMessage: 'Bolder red',
    description: 'Name of a color',
  },

  // Orange color
  '#FAA53D': {
    id: 'fabric.theme.subtle-orange',
    defaultMessage: 'Subtle orange',
    description: 'Name of a color',
  },
  '#D97008': {
    id: 'fabric.theme.orange',
    defaultMessage: 'Orange',
    description: 'Name of a color.',
  },
  '#B65C02': {
    id: 'fabric.theme.bold-orange',
    defaultMessage: 'Bold orange',
    description: 'Name of a color.',
  },
  '#974F0C': {
    id: 'fabric.theme.bolder-orange',
    defaultMessage: 'Bolder orange',
    description: 'Name of a color',
  },

  // Magenta color
  '#E774BB': {
    id: 'fabric.theme.subtle-magenta',
    defaultMessage: 'Subtle magenta',
    description: 'Name of a color',
  },
  '#DA62AC': {
    id: 'fabric.theme.magenta',
    defaultMessage: 'Magenta',
    description: 'Name of a color',
  },
  '#CD519D': {
    id: 'fabric.theme.bold-magenta',
    defaultMessage: 'Bold magenta',
    description: 'Name of a color',
  },
  '#943D73': {
    id: 'fabric.theme.bolder-magenta',
    defaultMessage: 'Bolder magenta',
    description: 'Name of a color',
  },

  // Purple color
  '#B5A7FB': {
    id: 'fabric.theme.subtle-purple',
    defaultMessage: 'Subtle purple',
    description: 'Name of a color',
  },
  '#8B77EE': {
    id: 'fabric.theme.purple',
    defaultMessage: 'Purple',
    description: 'Name of a color',
  },
  '#5A43D0': {
    id: 'fabric.theme.bold-purple',
    defaultMessage: 'Bold purple',
    description: 'Name of a color',
  },
  '#44368B': {
    id: 'fabric.theme.bolder-purple',
    defaultMessage: 'Bolder purple',
    description: 'Name of a color',
  },

  // Gray color
  '#8993A5': {
    id: 'fabric.theme.subtle-gray',
    defaultMessage: 'Subtle gray',
    description: 'Name of a color',
  },
  '#8590A2': {
    id: 'fabric.theme.gray',
    defaultMessage: 'Gray',
    description: 'Name of a color',
  },
  '#758195': {
    id: 'fabric.theme.bold-gray',
    defaultMessage: 'Bold gray',
    description: 'Name of a color',
  },
  '#44546F': {
    id: 'fabric.theme.bolder-gray',
    defaultMessage: 'Bolder gray',
    description: 'Name of a color',
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
    description: 'Name of a color',
  },
  '#758195': {
    id: 'fabric.theme.gray',
    defaultMessage: 'Gray',
    description: 'Name of a color',
  },
  '#172B4D': {
    id: 'fabric.theme.bold-gray',
    defaultMessage: 'Bold gray',
    description: 'Name of a color',
  },
});

const darkBorderPaletteTooltipMessages = {
  ...lightBorderPaletteTooltipMessages,
};

export const borderPaletteTooltipMessages = {
  light: lightBorderPaletteTooltipMessages,
  dark: darkBorderPaletteTooltipMessages,
};
