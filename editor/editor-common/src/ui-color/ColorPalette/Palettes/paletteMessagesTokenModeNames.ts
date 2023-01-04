import { defineMessages } from 'react-intl-next';

// These messages are only to be used when useSomewhatSemanticTextColorNames feature flag is true.
// They are used only in Jira and are part of work for https://product-fabric.atlassian.net/wiki/spaces/EUXQ/pages/3365994869/EXTERNAL+MAKE+PP+COMMIT-5058+Enable+dark+mode+usage+of+text+colors+in+UGC+and+non+custom+panels+in+Jira
export const newLightPalette = defineMessages({
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
    description: 'Name of a color',
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

const darkModeWhite = defineMessages({
  '#FFFFFF': {
    id: 'fabric.theme.dark-gray',
    defaultMessage: 'Dark gray',
    description: 'Name of a color',
  },
});

export const newDarkPalette = { ...newLightPalette, ...darkModeWhite };
