import type { AttributeSchema, TextColorTokenSchema } from '../../../types';

const color: AttributeSchema<TextColorTokenSchema> = {
  color: {
    text: {
      selected: {
        attributes: {
          group: 'paint',
          description:
            'Use for text, icons, borders, or other visual indicators in selected states',
        },
      },
      highEmphasis: {
        attributes: {
          group: 'paint',
          description:
            'Use for primary text, such as body copy, sentence case headers, and buttons',
        },
      },
      mediumEmphasis: {
        attributes: {
          group: 'paint',
          description: `
Use for secondary text, such navigation, subtle button links, input field labels, and all caps subheadings.

Use for icon-only buttons, or icons paired with text.highEmphasis text
      `,
        },
      },
      lowEmphasis: {
        attributes: {
          group: 'paint',
          description: `
Use for tertiary text, such as meta-data, breadcrumbs, input field placeholder and helper text.

Use for icons that are paired with text.medEmphasis text`,
        },
      },
      onBold: {
        attributes: {
          group: 'paint',
          description: 'Use for text and icons when on bold backgrounds',
        },
      },
      onBoldWarning: {
        attributes: {
          group: 'paint',
          description:
            'Use for text and icons when on bold warning backgrounds',
        },
      },
      link: {
        resting: {
          attributes: {
            group: 'paint',
            description:
              'Use for links in a resting or hover state. Add an underline for hover states',
          },
        },
        pressed: {
          attributes: {
            group: 'paint',
            description: 'Use for links in a pressed state',
          },
        },
      },
      brand: {
        attributes: {
          group: 'paint',
          description:
            'Use rarely for text on subtle brand backgrounds, such as in progress lozenges, or on subtle blue accent backgrounds, such as colored tags.',
        },
      },
      warning: {
        attributes: {
          group: 'paint',
          description:
            'Use rarely for text on subtle warning backgrounds, such as in lozenges, or text on subtle warning backgrounds, such as in moved lozenges',
        },
      },
      danger: {
        attributes: {
          group: 'paint',
          description:
            'Use rarely for critical text, such as input field error messaging, or text on subtle danger backgrounds, such as in removed lozenges, or text on subtle red accent backgrounds, such as colored tags.',
        },
      },
      success: {
        attributes: {
          group: 'paint',
          description:
            'Use rarely for positive text, such as input field success messaging, or text on subtle success backgrounds, such as in success lozenges, or text on subtle green accent backgrounds, such as colored tags.',
        },
      },
      discovery: {
        attributes: {
          group: 'paint',
          description:
            'Use rarely for text on subtle discovery backgrounds, such as in new lozenges, or text on subtle purple accent backgrounds, such as colored tags.',
        },
      },
      disabled: {
        attributes: {
          group: 'paint',
          description: 'Use for text and icons in disabled states',
        },
      },
    },
  },
};

export default color;
