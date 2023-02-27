import { Questions } from './types';
const questions: Questions = {
  root: {
    title: 'What kind of element is the token used for?',
    summary: 'Element',
    answers: [
      {
        id: 'text_next',
        summary: 'Text',
        next: 'text',
      },
      {
        id: 'background-surface_next',
        summary: 'Background or surface',
        next: 'background-surface',
      },
      {
        id: 'shadow_next',
        summary: 'Shadow',
        next: 'shadow',
      },
      {
        id: 'icon_next',
        summary: 'Icon',
        next: 'icon',
      },
      {
        id: 'border_next',
        summary: 'Border',
        next: 'border',
      },
      {
        id: 'data-visualisation_next',
        summary: 'Chart or data visualisation',
        next: 'data-visualisation',
      },
      {
        id: 'other_next',
        summary: 'Other',
        next: 'other',
      },
    ],
  },
  text: {
    title: 'What kind of text?',
    summary: 'Element',
    answers: [
      {
        id: 'text/neutral_next',
        summary: 'Neutral text',
        next: 'text/neutral',
      },
      {
        id: 'text/link_next',
        summary: 'Link text',
        next: 'text/link',
      },
      {
        id: 'text/colored_next',
        summary: 'Colored text',
        next: 'text/colored',
      },
    ],
  },
  'text/neutral': {
    title: 'What is the text used for?',
    summary: 'Purpose',
    answers: [
      {
        id: 'text/default_result',
        summary: 'Default',
        description:
          'Sentence case headings or subheadings; body text; other UI text not mentioned elsewhere',
        result: 'text/default_resultNode',
      },
      {
        id: 'text/neutral/subtle_result',
        summary: 'Subtle',
        description:
          'Navigation, all caps headings, input labels, subtle link buttons',
        result: 'text/neutral/subtle_resultNode',
      },
      {
        id: 'text/neutral/subtlest_result',
        summary: 'Very subtle',
        description: 'Metadata, placeholder text, helper text, breadcrumbs',
        result: 'text/neutral/subtlest_resultNode',
      },
      {
        id: 'text/neutral/disabled_result',
        summary: 'Disabled text',
        result: 'text/neutral/disabled_resultNode',
      },
      {
        id: 'text/neutral/on-bold_result',
        summary: 'On bold',
        description: 'Text sitting on a bold background',
        result: 'text/neutral/on-bold_resultNode',
      },
      {
        id: 'text/colored/accent/gray_result',
        summary: 'Accent',
        description:
          'Users can choose a text color from a set of accents, and one option is unsaturated/gray',
        result: 'text/colored/accent/gray_resultNode',
      },
    ],
  },
  'text/link': {
    title: 'What kind of link?',
    summary: 'Link type',
    answers: [
      {
        id: 'text/link/default_result',
        summary: 'Default',
        result: 'text/link/default_resultNode',
      },
      {
        id: 'text/link/subtle_result',
        summary: 'Subtle',
        result: 'text/link/subtle_resultNode',
      },
    ],
  },
  'text/colored': {
    title: 'How would you describe the meaning of the color?',
    summary: 'Semantic meaning',
    answers: [
      {
        id: 'text/colored/brand_result',
        summary: 'Brand',
        description: 'Reinforces our brand',
        result: 'text/colored/brand_resultNode',
      },
      {
        id: 'text/colored/information_result',
        summary: 'Information',
        description:
          'Informative or communicates something is in progress, such as in-progress lozenges.',
        result: 'text/colored/information_resultNode',
      },
      {
        id: 'text/colored/success_result',
        summary: 'Success',
        description:
          'Communicates a favorable outcome, such as input field success messaging.',
        result: 'text/colored/success_resultNode',
      },
      {
        id: 'text/colored/warning_result',
        summary: 'Warning',
        description: 'Emphasizes caution, such as in moved lozenges.',
        result: 'text/colored/warning_resultNode',
      },
      {
        id: 'text/colored/danger_result',
        summary: 'Danger',
        description: 'Critical text, such as input field error messaging',
        result: 'text/colored/danger_resultNode',
      },
      {
        id: 'text/colored/discovery_result',
        summary: 'Discovery',
        description:
          'Emphasizes change or something new, such as in new lozenges.',
        result: 'text/colored/discovery_resultNode',
      },
      {
        id: 'text/colored/selected_result',
        summary: 'Selected',
        description:
          'Used in a selected or opened state, such as tabs and dropdown buttons.',
        result: 'text/colored/selected_resultNode',
      },
      {
        id: 'text/colored/accent_next',
        summary: 'None (accent)',
        next: 'text/colored/accent',
      },
    ],
  },
  'text/colored/accent': {
    title: 'How would you describe the color?',
    summary: 'Hue/shade',
    answers: [
      {
        id: 'text/colored/accent/blue_result',
        summary: 'Blue',
        result: 'text/colored/accent/blue_resultNode',
      },
      {
        id: 'text/colored/accent/teal_result',
        summary: 'Teal',
        result: 'text/colored/accent/teal_resultNode',
      },
      {
        id: 'text/colored/accent/green_result',
        summary: 'Green',
        result: 'text/colored/accent/green_resultNode',
      },
      {
        id: 'text/colored/accent/yellow_result',
        summary: 'Yellow',
        result: 'text/colored/accent/yellow_resultNode',
      },
      {
        id: 'text/colored/accent/orange_result',
        summary: 'Orange',
        result: 'text/colored/accent/orange_resultNode',
      },
      {
        id: 'text/colored/accent/red_result',
        summary: 'Red',
        result: 'text/colored/accent/red_resultNode',
      },
      {
        id: 'text/colored/accent/magenta_result',
        summary: 'Magenta',
        result: 'text/colored/accent/magenta_resultNode',
      },
      {
        id: 'text/colored/accent/purple_result',
        summary: 'Purple',
        result: 'text/colored/accent/purple_resultNode',
      },
      {
        id: 'text/colored/accent_text/colored/accent/gray_result',
        summary: 'Gray',
        result: 'text/colored/accent/gray_resultNode',
      },
    ],
  },
  'background-surface': {
    title: 'Where is it being applied?',
    summary: 'Type',
    answers: [
      {
        id: 'background-surface/surface_next',
        summary: 'The fill of a surface area',
        description:
          'For example the main screen UI, or elevated UI such as modals, cards, or dropdown menus.',
        next: 'background-surface/surface',
      },
      {
        id: 'background-surface/background_next',
        summary: 'The fill of a component',
        description: 'For example a button or section message.',
        next: 'background-surface/background',
      },
    ],
  },
  'background-surface/surface': {
    title: 'What kind of element is this a surface of?',
    summary: 'Surface type',
    answers: [
      {
        id: 'background-surface/surface/main-background_result',
        summary: 'Main background',
        result: 'background-surface/surface/main-background_resultNode',
      },
      {
        id: 'background-surface/surface/modal-dropdown_result',
        summary: 'Modal or dropdown',
        result: 'background-surface/surface/modal-dropdown_resultNode',
      },
      {
        id: 'background-surface/surface/card_result',
        summary: 'Card',
        result: 'background-surface/surface/card_resultNode',
      },
      {
        id: 'background-surface/surface/grouping_result',
        summary: 'Grouping',
        description: 'An area grouping other elevations',
        result: 'background-surface/surface/grouping_resultNode',
      },
    ],
  },
  'background-surface/background': {
    title: 'Is the background colored or neutral?',
    summary: 'Colored or neutral',
    answers: [
      {
        id: 'background-surface/background/colored_next',
        summary: 'Colored',
        next: 'background-surface/background/colored',
      },
      {
        id: 'background-surface/background/neutral_next',
        summary: 'Neutral',
        next: 'background-surface/background/neutral',
      },
    ],
  },
  'background-surface/background/colored': {
    title: 'What semantic meaning does color have for this background?',
    summary: 'Semantic meaning',
    answers: [
      {
        id: 'background-surface/background/colored/brand_result',
        summary: 'Brand',
        description: 'The elements reinforces our brand with emphasis.',
        result: 'background-surface/background/colored/brand_resultNode',
      },
      {
        id: 'background-surface/background/colored/information_result',
        summary: 'Information',
        description: 'Communicates information or something in-progress.',
        result: 'background-surface/background/colored/information_resultNode',
      },
      {
        id: 'background-surface/background/colored/success_result',
        summary: 'Success',
        description: 'Communicates a favorable outcome.',
        result: 'background-surface/background/colored/success_resultNode',
      },
      {
        id: 'background-surface/background/colored/warning_result',
        summary: 'Warning',
        description: 'Communicates caution.',
        result: 'background-surface/background/colored/warning_resultNode',
      },
      {
        id: 'background-surface/background/colored/danger_result',
        summary: 'Danger',
        description: 'Communicates critical information.',
        result: 'background-surface/background/colored/danger_resultNode',
      },
      {
        id: 'background-surface/background/colored/discovery_result',
        summary: 'Discovery',
        description: 'Communicates change or something new.',
        result: 'background-surface/background/colored/discovery_resultNode',
      },
      {
        id: 'background-surface/background/colored/selected_result',
        summary: 'Selected',
        description: 'The background of elements in a selected state.',
        result: 'background-surface/background/colored/selected_resultNode',
      },
      {
        id: 'background-surface/background/colored/accent_next',
        summary: 'None (accent)',
        description: 'Color has no particular meaning',
        next: 'background-surface/background/colored/accent',
      },
    ],
  },
  'background-surface/background/colored/accent': {
    title: 'How would you describe the color?',
    summary: 'Hue/shade',
    answers: [
      {
        id: 'background-surface/background/colored/accent/blue_result',
        summary: 'Blue',
        result: 'background-surface/background/colored/accent/blue_resultNode',
      },
      {
        id: 'background-surface/background/colored/accent/teal_result',
        summary: 'Teal',
        result: 'background-surface/background/colored/accent/teal_resultNode',
      },
      {
        id: 'background-surface/background/colored/accent/green_result',
        summary: 'Green',
        result: 'background-surface/background/colored/accent/green_resultNode',
      },
      {
        id: 'background-surface/background/colored/accent/yellow_result',
        summary: 'Yellow',
        result:
          'background-surface/background/colored/accent/yellow_resultNode',
      },
      {
        id: 'background-surface/background/colored/accent/orange_result',
        summary: 'Orange',
        result:
          'background-surface/background/colored/accent/orange_resultNode',
      },
      {
        id: 'background-surface/background/colored/accent/red_result',
        summary: 'Red',
        result: 'background-surface/background/colored/accent/red_resultNode',
      },
      {
        id: 'background-surface/background/colored/accent/magenta_result',
        summary: 'Magenta',
        result:
          'background-surface/background/colored/accent/magenta_resultNode',
      },
      {
        id: 'background-surface/background/colored/accent/purple_result',
        summary: 'Purple',
        result:
          'background-surface/background/colored/accent/purple_resultNode',
      },
      {
        id: 'background-surface/background/colored/accent/gray_result',
        summary: 'Gray',
        result: 'background-surface/background/colored/accent/gray_resultNode',
      },
    ],
  },
  'background-surface/background/neutral': {
    title: 'What is the background used for?',
    summary: 'Purpose',
    answers: [
      {
        id: 'background-surface/background/neutral/input_result',
        summary: 'Input field',
        result: 'background-surface/background/neutral/input_resultNode',
      },
      {
        id: 'background-surface/background/neutral/disabled_result',
        summary: 'Disabled state',
        result: 'background-surface/background/neutral/disabled_resultNode',
      },
      {
        id: 'background-surface/background/neutral/neutral_result',
        summary: 'Neutral element',
        result: 'background-surface/background/neutral/neutral_resultNode',
      },
      {
        id: 'background-surface/background/neutral/subtle_result',
        summary: 'Subtle neutral',
        description: 'i.e. the background is only visible on interaction',
        result: 'background-surface/background/neutral/subtle_resultNode',
      },
      {
        id: 'background-surface/background/neutral/vibrant_result',
        summary: 'Vibrant background',
        description: 'e.g. banners',
        result: 'background-surface/background/neutral/vibrant_resultNode',
      },
      {
        id: 'background-surface/background/neutral/on-bold_result',
        summary: 'On bold',
        description:
          "Background of an element that's placed on a bold background",
        result: 'background-surface/background/neutral/on-bold_resultNode',
      },
      {
        id: 'background-surface/background/neutral_background-surface/background/colored/accent/gray_result',
        summary: 'Accent',
        description:
          'Users can choose a background color from a set of accents, and one option is unsaturated/gray',
        result: 'background-surface/background/colored/accent/gray_resultNode',
      },
    ],
  },
  shadow: {
    title: 'What is the surface you are using?',
    summary: 'Surface',
    answers: [
      {
        id: 'shadow/raised_result',
        summary: 'Raised',
        description: 'A raised surface such as a card element.',
        result: 'shadow/raised_resultNode',
      },
      {
        id: 'shadow/overlay_result',
        summary: 'Overlay',
        description:
          'An overlay surface (e.g. modals, dropdown menus, flags, inline dialogs).',
        result: 'shadow/overlay_resultNode',
      },
      {
        id: 'shadow/overflow_result',
        summary: 'Overflow',
        description: 'Used when content scrolls under other content.',
        result: 'shadow/overflow_resultNode',
      },
    ],
  },
  border: {
    title: 'Is the border colored or neutral?',
    summary: 'Colored or neutral',
    answers: [
      {
        id: 'border/colored_next',
        summary: 'Colored',
        next: 'border/colored',
      },
      {
        id: 'border/neutral_next',
        summary: 'Neutral',
        next: 'border/neutral',
      },
    ],
  },
  'border/colored': {
    title: 'What semantic meaning does color have for this border?',
    summary: 'Semantic meaning',
    answers: [
      {
        id: 'border/colored/brand_result',
        summary: 'Brand',
        description: 'The elements reinforces our brand with emphasis.',
        result: 'border/colored/brand_resultNode',
      },
      {
        id: 'border/colored/information_result',
        summary: 'Information',
        description: 'Communicates information or something in-progress.',
        result: 'border/colored/information_resultNode',
      },
      {
        id: 'border/colored/success_result',
        summary: 'Success',
        description: 'Communicates a favorable outcome.',
        result: 'border/colored/success_resultNode',
      },
      {
        id: 'border/colored/warning_result',
        summary: 'Warning',
        description: 'Communicates caution.',
        result: 'border/colored/warning_resultNode',
      },
      {
        id: 'border/colored/danger_result',
        summary: 'Danger',
        description: 'Communicates critical information.',
        result: 'border/colored/danger_resultNode',
      },
      {
        id: 'border/colored/discovery_result',
        summary: 'Discovery',
        description: 'Communicates change or something new.',
        result: 'border/colored/discovery_resultNode',
      },
      {
        id: 'border/colored/focused_result',
        summary: 'Focused',
        description: 'Indicates a focus state.',
        result: 'border/colored/focused_resultNode',
      },
      {
        id: 'border/colored/selected_result',
        summary: 'Selected',
        description: 'Indicates a selected state.',
        result: 'border/colored/selected_resultNode',
      },
      {
        id: 'border/colored/accent_next',
        summary: 'None (accent)',
        description: 'Color has no particular meaning',
        next: 'border/colored/accent',
      },
    ],
  },
  'border/colored/accent': {
    title: 'How would you describe the color?',
    summary: 'Hue/shade',
    answers: [
      {
        id: 'border/colored/blue_result',
        summary: 'Blue',
        result: 'border/colored/blue_resultNode',
      },
      {
        id: 'border/colored/teal_result',
        summary: 'Teal',
        result: 'border/colored/teal_resultNode',
      },
      {
        id: 'border/colored/green_result',
        summary: 'Green',
        result: 'border/colored/green_resultNode',
      },
      {
        id: 'border/colored/yellow_result',
        summary: 'Yellow',
        result: 'border/colored/yellow_resultNode',
      },
      {
        id: 'border/colored/orange_result',
        summary: 'Orange',
        result: 'border/colored/orange_resultNode',
      },
      {
        id: 'border/colored/red_result',
        summary: 'Red',
        result: 'border/colored/red_resultNode',
      },
      {
        id: 'border/colored/magenta_result',
        summary: 'Magenta',
        result: 'border/colored/magenta_resultNode',
      },
      {
        id: 'border/colored/purple_result',
        summary: 'Purple',
        result: 'border/colored/purple_resultNode',
      },
      {
        id: 'border/colored/gray_result',
        summary: 'Gray',
        result: 'border/colored/gray_resultNode',
      },
    ],
  },
  'border/neutral': {
    title: 'What is the border used for?',
    summary: 'Purpose',
    answers: [
      {
        id: 'border/neutral/input_result',
        summary: 'Input fields',
        result: 'border/neutral/input_resultNode',
      },
      {
        id: 'border/neutral/disabled_result',
        summary: 'Disabled controls',
        result: 'border/neutral/disabled_resultNode',
      },
      {
        id: 'border/neutral_border/colored/gray_result',
        summary: 'Accent',
        description:
          'Users can choose a border color from a set of accents, and one option is unsaturated/gray',
        result: 'border/colored/gray_resultNode',
      },
      {
        id: 'border/neutral/neutral_result',
        summary: 'Other',
        result: 'border/neutral/neutral_resultNode',
      },
    ],
  },
  icon: {
    title: 'Is the icon colored or neutral?',
    summary: 'Colored or neutral',
    answers: [
      {
        id: 'icon/colored_next',
        summary: 'Colored',
        next: 'icon/colored',
      },
      {
        id: 'icon/neutral_next',
        summary: 'Neutral',
        next: 'icon/neutral',
      },
    ],
  },
  'icon/colored': {
    title: 'What semantic meaning does color have for this icon?',
    summary: 'Semantic meaning',
    answers: [
      {
        id: 'icon/colored/brand_result',
        summary: 'Brand',
        description: 'The elements reinforces our brand with emphasis.',
        result: 'icon/colored/brand_resultNode',
      },
      {
        id: 'icon/colored/information_result',
        summary: 'Information',
        description: 'Communicates information or something in-progress.',
        result: 'icon/colored/information_resultNode',
      },
      {
        id: 'icon/colored/success_result',
        summary: 'Success',
        description: 'Communicates a favorable outcome.',
        result: 'icon/colored/success_resultNode',
      },
      {
        id: 'icon/colored/warning_result',
        summary: 'Warning',
        description: 'Communicates caution.',
        result: 'icon/colored/warning_resultNode',
      },
      {
        id: 'icon/colored/danger_result',
        summary: 'Danger',
        description: 'Communicates critical information.',
        result: 'icon/colored/danger_resultNode',
      },
      {
        id: 'icon/colored/discovery_result',
        summary: 'Discovery',
        description: 'Communicates change or something new.',
        result: 'icon/colored/discovery_resultNode',
      },
      {
        id: 'icon/colored/selected_result',
        summary: 'Selected',
        description: 'Indicates selected or open state.',
        result: 'icon/colored/selected_resultNode',
      },
      {
        id: 'icon/colored/accent_next',
        summary: 'None (accent)',
        description: 'Color has no particular meaning',
        next: 'icon/colored/accent',
      },
    ],
  },
  'icon/colored/accent': {
    title: 'How would you describe the color?',
    summary: 'Hue/shade',
    answers: [
      {
        id: 'icon/colored/blue_result',
        summary: 'Blue',
        result: 'icon/colored/blue_resultNode',
      },
      {
        id: 'icon/colored/teal_result',
        summary: 'Teal',
        result: 'icon/colored/teal_resultNode',
      },
      {
        id: 'icon/colored/green_result',
        summary: 'Green',
        result: 'icon/colored/green_resultNode',
      },
      {
        id: 'icon/colored/yellow_result',
        summary: 'Yellow',
        result: 'icon/colored/yellow_resultNode',
      },
      {
        id: 'icon/colored/orange_result',
        summary: 'Orange',
        result: 'icon/colored/orange_resultNode',
      },
      {
        id: 'icon/colored/red_result',
        summary: 'Red',
        result: 'icon/colored/red_resultNode',
      },
      {
        id: 'icon/colored/magenta_result',
        summary: 'Magenta',
        result: 'icon/colored/magenta_resultNode',
      },
      {
        id: 'icon/colored/purple_result',
        summary: 'Purple',
        result: 'icon/colored/purple_resultNode',
      },
      {
        id: 'icon/colored/gray_result',
        summary: 'Gray',
        result: 'icon/colored/gray_resultNode',
      },
    ],
  },
  'icon/neutral': {
    title: 'What is the icon used for?',
    summary: 'Purpose',
    answers: [
      {
        id: 'icon/neutral/default_result',
        summary: 'Paired with default text',
        result: 'icon/neutral/default_resultNode',
      },
      {
        id: 'icon/neutral/subtle_result',
        summary: 'Paired with subtle text',
        result: 'icon/neutral/subtle_resultNode',
      },
      {
        id: 'icon/neutral/on-bold_result',
        summary: 'On a bold background',
        result: 'icon/neutral/on-bold_resultNode',
      },
      {
        id: 'icon/neutral/disabled_result',
        summary: 'Something disabled',
        result: 'icon/neutral/disabled_resultNode',
      },
      {
        id: 'icon/neutral_icon/colored/gray_result',
        summary: 'Accent',
        description:
          'Users can choose an icon color from a set of accents, and one option is unsaturated/gray',
        result: 'icon/colored/gray_resultNode',
      },
    ],
  },
  'data-visualisation': {
    title: 'Who chooses the color?',
    summary: 'Chosen by',
    answers: [
      {
        id: 'data-visualisation/product_next',
        summary: 'Product',
        description: 'Colors are generated by the product experience',
        next: 'data-visualisation/product',
      },
      {
        id: 'data-visualisation/end-user_result',
        summary: 'End user',
        description: 'Colors can be chosen by the end user',
        result: 'data-visualisation/end-user_resultNode',
      },
    ],
  },
  'data-visualisation/product': {
    title: 'What meaning does the color communicate?',
    summary: 'Color meaning',
    answers: [
      {
        id: 'data-visualisation/product/none_next',
        summary: 'None',
        description: 'Color has no particular meaning.',
        next: 'data-visualisation/product/none',
      },
      {
        id: 'data-visualisation/product/success_next',
        summary: 'Success',
        description: 'Communicates a favorable outcome.',
        next: 'data-visualisation/product/success',
      },
      {
        id: 'data-visualisation/product/warning_next',
        summary: 'Warning',
        description: 'Communicates caution.',
        next: 'data-visualisation/product/warning',
      },
      {
        id: 'data-visualisation/product/danger_next',
        summary: 'Danger',
        description: 'Communicates critical information.',
        next: 'data-visualisation/product/danger',
      },
      {
        id: 'data-visualisation/product/discovery_next',
        summary: 'Discovery',
        description: 'Communicates change or something new.',
        next: 'data-visualisation/product/discovery',
      },
      {
        id: 'data-visualisation/product/information_next',
        summary: 'Information',
        description: 'Communications information or something in-progress.',
        next: 'data-visualisation/product/information',
      },
      {
        id: 'data-visualisation/product/neutral_result',
        summary: 'Neutral',
        description: 'Communicates to-do.',
        result: 'data-visualisation/product/neutral_resultNode',
      },
      {
        id: 'data-visualisation/product/brand_next',
        summary: 'Brand',
        description: 'The elements reinforces our brand with emphasis.',
        next: 'data-visualisation/product/brand',
      },
    ],
  },
  'data-visualisation/product/none': {
    title: 'How many colors are required?',
    summary: 'Number of colors',
    answers: [
      {
        id: 'data-visualisation/product/none/one-color_result',
        summary: 'One color',
        result: 'data-visualisation/product/none/one-color_resultNode',
      },
      {
        id: 'data-visualisation/product/none/primary-and-neutral_result',
        summary: 'Primary and neutral',
        result:
          'data-visualisation/product/none/primary-and-neutral_resultNode',
      },
      {
        id: 'data-visualisation/product/none/more-than-one-color_result',
        summary: 'More than one color',
        result:
          'data-visualisation/product/none/more-than-one-color_resultNode',
      },
    ],
  },
  'data-visualisation/product/success': {
    title: 'How many colors are required?',
    summary: 'Number of colors',
    answers: [
      {
        id: 'data-visualisation/product/success/one-or-more_result',
        summary: 'One or more color',
        result: 'data-visualisation/product/success/one-or-more_resultNode',
      },
      {
        id: 'data-visualisation/product/success/primary-and-neutral_result',
        summary: 'Primary and neutral',
        result:
          'data-visualisation/product/success/primary-and-neutral_resultNode',
      },
    ],
  },
  'data-visualisation/product/warning': {
    title: 'How many colors are required?',
    summary: 'Number of colors',
    answers: [
      {
        id: 'data-visualisation/product/warning/one-or-more_result',
        summary: 'One or more color',
        result: 'data-visualisation/product/warning/one-or-more_resultNode',
      },
      {
        id: 'data-visualisation/product/warning/primary-and-neutral_result',
        summary: 'Primary and neutral',
        result:
          'data-visualisation/product/warning/primary-and-neutral_resultNode',
      },
    ],
  },
  'data-visualisation/product/danger': {
    title: 'How many colors are required?',
    summary: 'Number of colors',
    answers: [
      {
        id: 'data-visualisation/product/danger/one-or-more_result',
        summary: 'One or more color',
        result: 'data-visualisation/product/danger/one-or-more_resultNode',
      },
      {
        id: 'data-visualisation/product/danger/primary-and-neutral_result',
        summary: 'Primary and neutral',
        result:
          'data-visualisation/product/danger/primary-and-neutral_resultNode',
      },
    ],
  },
  'data-visualisation/product/discovery': {
    title: 'How many colors are required?',
    summary: 'Number of colors',
    answers: [
      {
        id: 'data-visualisation/product/discovery/one-or-more_result',
        summary: 'One or more color',
        result: 'data-visualisation/product/discovery/one-or-more_resultNode',
      },
      {
        id: 'data-visualisation/product/discovery/primary-and-neutral_result',
        summary: 'Primary and neutral',
        result:
          'data-visualisation/product/discovery/primary-and-neutral_resultNode',
      },
    ],
  },
  'data-visualisation/product/information': {
    title: 'How many colors are required?',
    summary: 'Number of colors',
    answers: [
      {
        id: 'data-visualisation/product/information/one-or-more_result',
        summary: 'One or more color',
        result: 'data-visualisation/product/information/one-or-more_resultNode',
      },
      {
        id: 'data-visualisation/product/information/primary-and-neutral_result',
        summary: 'Primary and neutral',
        result:
          'data-visualisation/product/information/primary-and-neutral_resultNode',
      },
    ],
  },
  'data-visualisation/product/brand': {
    title: 'How many colors are required?',
    summary: 'Number of colors',
    answers: [
      {
        id: 'data-visualisation/product/brand/one-or-more_result',
        summary: 'One or more color',
        result: 'data-visualisation/product/brand/one-or-more_resultNode',
      },
      {
        id: 'data-visualisation/product/brand/primary-and-neutral_result',
        summary: 'Primary and neutral',
        result:
          'data-visualisation/product/brand/primary-and-neutral_resultNode',
      },
    ],
  },
  other: {
    title: 'What is your use case?',
    summary: 'Use case',
    answers: [
      {
        id: 'other/blanket_next',
        summary: 'Blanket',
        description: 'Covering content with a blanket',
        next: 'other/blanket',
      },
      {
        id: 'other/skeleton_next',
        summary: 'Skeleton',
        description: 'Displaying a loading skeleton',
        next: 'other/skeleton',
      },
      {
        id: 'opacity/disabled_result',
        summary: 'Disabled opacity',
        description: 'Disabling an image',
        result: 'opacity/disabled_resultNode',
      },
      {
        id: 'opacity/loading_result',
        summary: 'Loading opacity',
        description: 'De-emphasizing content under a loading spinner',
        result: 'opacity/loading_resultNode',
      },
    ],
  },
  'other/blanket': {
    title: 'What do you need a blanket for?',
    summary: 'Blanket type',
    answers: [
      {
        id: 'other/blanket/modal_result',
        summary: 'Under a modal',
        description: 'Modal',
        result: 'other/blanket/modal_resultNode',
      },
      {
        id: 'other/blanket/deletion_result',
        summary: 'Deletion',
        description: 'Over a section that is hovered to be deleted',
        result: 'other/blanket/deletion_resultNode',
      },
      {
        id: 'other/blanket/selection_result',
        summary: 'Selected',
        description: 'Over a section that is selected',
        result: 'other/blanket/selection_resultNode',
      },
    ],
  },
  'other/skeleton': {
    title: 'What do you need a skeleton for?',
    summary: 'Blanket type',
    answers: [
      {
        id: 'other/skeleton_result',
        summary: 'Loading state',
        description: 'Use for skeleton loading states',
        result: 'other/skeleton_resultNode',
      },
      {
        id: 'other/skeleton/subtle_result',
        summary: 'Pulse or shimmer effect',
        description:
          'Use for the pulse or shimmer effect in skeleton loading states',
        result: 'other/skeleton/subtle_resultNode',
      },
    ],
  },
};
export default questions;
