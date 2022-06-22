import { Question } from '../types';

/**
 * An object type can't use its own keys in its object definition
 * An alternative approach is to let TS infer the type of the whole object structure
 *
 *        const questions = {
 *          root: {
 *            ...
 *            answers: [{
 *              // Note: all 'next' values would need to be declared "as const" to let TS infer a string literal
 *              next: 'text' as const
 *              ...
 *            }]
 *          }
 *        }
 *
 * Then we can use the inferred type to get the question names, and use it to enforce types on the original
 * questions object
 *
 *        export type Questions = {
 *            [key in keyof typeof questions]: Question;
 *        };
 *        export default typedQuestions: Questions = questions;
 *
 */

export type Questions = {
  [key in keyof questionID]: Question;
};

// Index types can't be optionals, so questionID is an object with `any` values instead
type questionID = {
  root: any;
  text: any;
  'text/neutral': any;
  'text/link': any;
  'text/colored': any;
  'text/colored/accent': any;
  'background-surface': any;
  'background-surface/surface': any;
  'background-surface/background': any;
  'background-surface/background/colored': any;
  'background-surface/background/colored/accent': any;
  'background-surface/background/neutral': any;
  shadow: any;
  border: any;
  'border/colored': any;
  'border/colored/accent': any;
  'border/neutral': any;
  icon: any;
  'icon/colored': any;
  'icon/colored/accent': any;
  'icon/neutral': any;
  other: any;
  'other/blanket': any;
  'other/skeleton': any;
};

const questions: Questions = {
  root: {
    title: 'What kind of element is the color used for?',
    summary: 'Element',
    answers: [
      {
        next: 'text',
        summary: 'Text',
      },
      {
        next: 'background-surface',
        summary: 'Background/surface',
      },
      {
        next: 'shadow',
        summary: 'Shadow',
      },
      {
        next: 'icon',
        summary: 'Icon',
      },
      {
        next: 'border',
        summary: 'Border',
      },
      {
        next: 'other',
        summary: 'Other',
      },
    ],
  },
  text: {
    title: 'What kind of text?',
    summary: 'Element',
    answers: [
      {
        next: 'text/neutral',
        summary: 'Neutral text',
      },
      {
        next: 'text/link',
        summary: 'Link text',
      },
      {
        next: 'text/colored',
        summary: 'Colored text',
      },
    ],
  },
  'text/neutral': {
    title: 'What is the text used for?',
    summary: 'Purpose',
    answers: [
      {
        result: 'text/default',
        summary: 'Default',
        description:
          'Sentence case headings or subheadings; body text; other UI text not mentioned elsewhere',
      },
      {
        result: 'text/neutral/subtle',
        summary: 'Subtle',
        description:
          'Navigation, all caps headings, input labels, subtle link buttons',
      },
      {
        result: 'text/neutral/subtlest',
        summary: 'Very subtle',
        description: 'Metadata, placeholder text, helper text, breadcrumbs',
      },
      {
        result: 'text/neutral/disabled',
        summary: 'Disabled text',
      },
      {
        result: 'text/neutral/on-bold',
        summary: 'On bold',
        description: 'Text sitting on a bold background',
      },
      {
        result: 'text/colored/accent/gray',
        summary: 'Accent',
        description:
          'Users can choose a text color from a set of accents, and one option is unsaturated/gray',
      },
    ],
  },
  'text/link': {
    title: 'What kind of link?',
    summary: 'Link type',
    answers: [
      {
        result: 'text/link/default',
        summary: 'Default',
      },
      {
        result: 'text/link/subtle',
        summary: 'Subtle',
      },
    ],
  },
  'text/colored': {
    title: 'How would you describe the meaning of the color?',
    summary: 'Semantic meaning',
    answers: [
      {
        result: 'text/colored/brand',
        summary: 'Brand',
        description: 'Reinforces our brand',
      },
      {
        result: 'text/colored/information',
        summary: 'Information',
        description:
          'Informative or communicates something is in progress, such as in-progress lozenges.',
      },
      {
        result: 'text/colored/success',
        summary: 'Success',
        description:
          'Communicates a favorable outcome, such as input field success messaging.',
      },
      {
        result: 'text/colored/warning',
        summary: 'Warning',
        description: 'Emphasizes caution, such as in moved lozenges.',
      },
      {
        result: 'text/colored/danger',
        summary: 'Danger',
        description: 'Critical text, such as input field error messaging',
      },
      {
        result: 'text/colored/discovery',
        summary: 'Discovery',
        description:
          'Emphasizes change or something new, such as in new lozenges.',
      },
      {
        result: 'text/colored/selected',
        summary: 'Selected',
        description:
          'Used in a selected or opened state, such as tabs and dropdown buttons.',
      },
      {
        next: 'text/colored/accent',
        summary: 'None (accent)',
      },
    ],
    metadata: {
      description:
        'If you are using color to communicate a specific state or meaning to the user, it has a *semantic meaning*. Otherwise the color is an accent.',
    },
  },
  'text/colored/accent': {
    title: 'How would you describe the color?',
    summary: 'Hue/shade',
    answers: [
      {
        result: 'text/colored/accent/blue',
        summary: 'Blue',
      },
      {
        result: 'text/colored/accent/teal',
        summary: 'Teal',
      },
      {
        result: 'text/colored/accent/green',
        summary: 'Green',
      },
      {
        result: 'text/colored/accent/yellow',
        summary: 'Yellow',
      },
      {
        result: 'text/colored/accent/orange',
        summary: 'Orange',
      },
      {
        result: 'text/colored/accent/red',
        summary: 'Red',
      },
      {
        result: 'text/colored/accent/magenta',
        summary: 'Magenta',
      },
      {
        result: 'text/colored/accent/purple',
        summary: 'Purple',
      },
      {
        result: 'text/colored/accent/gray',
        summary: 'Gray',
      },
    ],
  },

  'background-surface': {
    title: 'Where is it being applied?',
    summary: 'Type',
    answers: [
      {
        next: 'background-surface/surface',
        summary: 'The fill of a surface area',
        description:
          'For example the main screen UI, or elevated UI such as modals, cards, or dropdown menus.',
      },
      {
        next: 'background-surface/background',
        summary: 'The fill of a component',
        description: 'For example a button or section message.',
      },
    ],
  },
  'background-surface/surface': {
    title: 'What kind of element is this a surface of?',
    summary: 'Surface type',
    answers: [
      {
        result: 'background-surface/surface/main-background',
        summary: 'Main background',
      },
      {
        result: 'background-surface/surface/modal-dropdown',
        summary: 'Modal or dropdown',
      },
      {
        result: 'background-surface/surface/card',
        summary: 'Card',
      },
      {
        result: 'background-surface/surface/grouping',
        summary: 'Grouping',
        description: 'An area grouping other elevations',
      },
    ],
  },
  'background-surface/background': {
    title: 'Is the background colored or neutral?',
    summary: 'Colored or neutral',
    answers: [
      {
        next: 'background-surface/background/colored',
        summary: 'Colored',
      },
      {
        next: 'background-surface/background/neutral',
        summary: 'Neutral',
      },
    ],
  },
  'background-surface/background/colored': {
    title: 'What semantic meaning does color have for this background?',
    summary: 'Semantic meaning',
    answers: [
      {
        result: 'background-surface/background/colored/brand',
        summary: 'Brand',
        description: 'The elements reinforces our brand with emphasis.',
      },
      {
        result: 'background-surface/background/colored/information',
        summary: 'Information',
        description: 'Communicates information or something in-progress.',
      },
      {
        result: 'background-surface/background/colored/success',
        summary: 'Success',
        description: 'Communicates a favorable outcome.',
      },
      {
        result: 'background-surface/background/colored/warning',
        summary: 'Warning',
        description: 'Communicates caution.',
      },
      {
        result: 'background-surface/background/colored/danger',
        summary: 'Danger',
        description: 'Communicates critical information.',
      },
      {
        result: 'background-surface/background/colored/discovery',
        summary: 'Discovery',
        description: 'Communicates change or something new.',
      },
      {
        result: 'background-surface/background/colored/selected',
        summary: 'Selected',
        description: 'The background of elements in a selected state.',
      },
      {
        next: 'background-surface/background/colored/accent',
        summary: 'None (accent)',
        description: 'Color has no particular meaning',
      },
    ],
    metadata: {
      description:
        'If you are using color to communicate a specific state or meaning to the user, it has a *semantic meaning*. Otherwise the color is an accent.',
    },
  },

  'background-surface/background/colored/accent': {
    title: 'How would you describe the color?',
    summary: 'Hue/shade',
    answers: [
      {
        result: 'background-surface/background/colored/accent/blue',
        summary: 'Blue',
      },
      {
        result: 'background-surface/background/colored/accent/teal',
        summary: 'Teal',
      },
      {
        result: 'background-surface/background/colored/accent/green',
        summary: 'Green',
      },
      {
        result: 'background-surface/background/colored/accent/yellow',
        summary: 'Yellow',
      },
      {
        result: 'background-surface/background/colored/accent/orange',
        summary: 'Orange',
      },
      {
        result: 'background-surface/background/colored/accent/red',
        summary: 'Red',
      },
      {
        result: 'background-surface/background/colored/accent/magenta',
        summary: 'Magenta',
      },
      {
        result: 'background-surface/background/colored/accent/purple',
        summary: 'Purple',
      },
      {
        result: 'background-surface/background/colored/accent/gray',
        summary: 'Gray',
      },
    ],
  },
  'background-surface/background/neutral': {
    title: 'What is the background used for?',
    summary: 'Purpose',
    answers: [
      {
        result: 'background-surface/background/neutral/input',
        summary: 'Input field',
      },
      {
        result: 'background-surface/background/neutral/disabled',
        summary: 'Disabled state',
      },
      {
        result: 'background-surface/background/neutral/neutral',
        summary: 'Neutral element',
      },
      {
        result: 'background-surface/background/neutral/subtle',
        summary: 'Subtle neutral',
        description: 'i.e. the background is only visible on interaction',
      },
      {
        result: 'background-surface/background/neutral/vibrant',
        summary: 'Vibrant background',
        description: 'e.g. banners',
      },
      {
        result: 'background-surface/background/neutral/on-bold',
        summary: 'On bold',
        description:
          "Background of an element that's placed on a bold background",
      },
      {
        result: 'background-surface/background/colored/accent/gray',
        summary: 'Accent',
        description:
          'Users can choose a background color from a set of accents, and one option is unsaturated/gray',
      },
    ],
  },
  shadow: {
    title: 'What is the surface you are using?',
    summary: 'Surface',
    answers: [
      {
        result: 'shadow/raised',
        summary: 'Raised',
        description: 'A raised surface such as a card element.',
      },
      {
        result: 'shadow/overlay',
        summary: 'Overlay',
        description:
          'An overlay surface (e.g. modals, dropdown menus, flags, inline dialogs).',
      },
      {
        result: 'shadow/overflow',
        summary: 'Overflow',
        description: 'Used when content scrolls under other content.',
      },
    ],
  },
  border: {
    title: 'Is the border colored or neutral?',
    summary: 'Colored or neutral',
    answers: [
      {
        next: 'border/colored',
        summary: 'Colored',
      },
      {
        next: 'border/neutral',
        summary: 'Neutral',
      },
    ],
  },
  'border/colored': {
    title: 'What semantic meaning does color have for this border?',
    summary: 'Semantic meaning',
    answers: [
      {
        result: 'border/colored/brand',
        summary: 'Brand',
        description: 'The elements reinforces our brand with emphasis.',
      },
      {
        result: 'border/colored/information',
        summary: 'Information',
        description: 'Communicates information or something in-progress.',
      },
      {
        result: 'border/colored/success',
        summary: 'Success',
        description: 'Communicates a favorable outcome.',
      },
      {
        result: 'border/colored/warning',
        summary: 'Warning',
        description: 'Communicates caution.',
      },
      {
        result: 'border/colored/danger',
        summary: 'Danger',
        description: 'Communicates critical information.',
      },
      {
        result: 'border/colored/discovery',
        summary: 'Discovery',
        description: 'Communicates change or something new.',
      },
      {
        result: 'border/colored/focused',
        summary: 'Focused',
        description: 'Indicates a focus state.',
      },
      {
        result: 'border/colored/selected',
        summary: 'Selected',
        description: 'Indicates a selected state.',
      },
      {
        next: 'border/colored/accent',
        summary: 'None (accent)',
        description: 'Color has no particular meaning',
      },
    ],
    metadata: {
      description:
        'If you are using color to communicate a specific state or meaning to the user, it has a *semantic meaning*. Otherwise the color is an accent.',
    },
  },
  'border/colored/accent': {
    title: 'How would you describe the color?',
    summary: 'Hue/shade',
    answers: [
      {
        result: 'border/colored/blue',
        summary: 'Blue',
      },
      {
        result: 'border/colored/teal',
        summary: 'Teal',
      },
      {
        result: 'border/colored/green',
        summary: 'Green',
      },
      {
        result: 'border/colored/yellow',
        summary: 'Yellow',
      },
      {
        result: 'border/colored/orange',
        summary: 'Orange',
      },
      {
        result: 'border/colored/red',
        summary: 'Red',
      },
      {
        result: 'border/colored/magenta',
        summary: 'Magenta',
      },
      {
        result: 'border/colored/purple',
        summary: 'Purple',
      },
      {
        result: 'border/colored/gray',
        summary: 'Gray',
      },
    ],
  },

  'border/neutral': {
    title: 'What is the border used for?',
    summary: 'Purpose',
    answers: [
      {
        result: 'border/neutral/input',
        summary: 'Input fields',
      },
      {
        result: 'border/neutral/disabled',
        summary: 'Disabled controls',
      },
      {
        result: 'border/colored/gray',
        summary: 'Accent',
        description:
          'Users can choose a border color from a set of accents, and one option is unsaturated/gray',
      },
      {
        result: 'border/neutral/neutral',
        summary: 'Other',
      },
    ],
  },

  icon: {
    title: 'Is the icon colored or neutral?',
    summary: 'Colored or neutral',
    answers: [
      {
        next: 'icon/colored',
        summary: 'Colored',
      },
      {
        next: 'icon/neutral',
        summary: 'Neutral',
      },
    ],
  },
  'icon/colored': {
    title: 'What semantic meaning does color have for this icon?',
    summary: 'Semantic meaning',
    answers: [
      {
        result: 'icon/colored/brand',
        summary: 'Brand',
        description: 'The elements reinforces our brand with emphasis.',
      },
      {
        result: 'icon/colored/information',
        summary: 'Information',
        description: 'Communicates information or something in-progress.',
      },
      {
        result: 'icon/colored/success',
        summary: 'Success',
        description: 'Communicates a favorable outcome.',
      },
      {
        result: 'icon/colored/warning',
        summary: 'Warning',
        description: 'Communicates caution.',
      },
      {
        result: 'icon/colored/danger',
        summary: 'Danger',
        description: 'Communicates critical information.',
      },
      {
        result: 'icon/colored/discovery',
        summary: 'Discovery',
        description: 'Communicates change or something new.',
      },
      {
        result: 'icon/colored/selected',
        summary: 'Selected',
        description: 'Indicates selected or open state.',
      },
      {
        next: 'icon/colored/accent',
        summary: 'None (accent)',
        description: 'Color has no particular meaning',
      },
    ],
    metadata: {
      description:
        'If you are using color to communicate a specific state or meaning to the user, it has a *semantic meaning*. Otherwise the color is an accent.',
    },
  },
  'icon/colored/accent': {
    title: 'How would you describe the color?',
    summary: 'Hue/shade',
    answers: [
      {
        result: 'icon/colored/blue',
        summary: 'Blue',
      },
      {
        result: 'icon/colored/teal',
        summary: 'Teal',
      },
      {
        result: 'icon/colored/green',
        summary: 'Green',
      },
      {
        result: 'icon/colored/yellow',
        summary: 'Yellow',
      },
      {
        result: 'icon/colored/orange',
        summary: 'Orange',
      },
      {
        result: 'icon/colored/red',
        summary: 'Red',
      },
      {
        result: 'icon/colored/magenta',
        summary: 'Magenta',
      },
      {
        result: 'icon/colored/purple',
        summary: 'Purple',
      },
      {
        result: 'icon/colored/gray',
        summary: 'Gray',
      },
    ],
  },

  'icon/neutral': {
    title: 'What is the icon used for?',
    summary: 'Purpose',
    answers: [
      {
        result: 'icon/neutral/default',
        summary: 'Paired with default text',
      },
      {
        result: 'icon/neutral/subtle',
        summary: 'Paired with subtle text',
      },
      {
        result: 'icon/neutral/on-bold',
        summary: 'On a bold background',
      },
      {
        result: 'icon/neutral/disabled',
        summary: 'Something disabled',
      },
      {
        result: 'icon/colored/gray',
        summary: 'Accent',
        description:
          'Users can choose an icon color from a set of accents, and one option is unsaturated/gray',
      },
    ],
  },

  other: {
    title: 'What is your use case?',
    summary: 'Use case',
    answers: [
      {
        next: 'other/blanket',
        summary: 'Blanket',
      },
      {
        next: 'other/skeleton',
        summary: 'Skeleton',
      },
    ],
  },
  'other/blanket': {
    title: 'What do you need a blanket for?',
    summary: 'Blanket type',
    answers: [
      {
        result: 'other/blanket/modal',
        summary: 'Under a modal',
        description: 'Modal',
      },
      {
        result: 'other/blanket/deletion',
        summary: 'Deletion',
        description: 'Over a section that is hovered to be deleted',
      },
      {
        result: 'other/blanket/selection',
        summary: 'Selected',
        description: 'Over a section that is selected',
      },
    ],
  },
  'other/skeleton': {
    title: 'What do you need a skeleton for?',
    summary: 'Blanket type',
    answers: [
      {
        result: 'other/skeleton',
        summary: 'Loading state',
        description: 'Use for skeleton loading states',
      },
      {
        result: 'other/skeleton/subtle',
        summary: 'Pulse or shimmer effect',
        description:
          'Use for the pulse or shimmer effect in skeleton loading states',
      },
    ],
  },
};
export default questions;
