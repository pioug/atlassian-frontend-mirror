import type {
  AttributeSchema,
  IconBorderColorTokenSchema,
} from '../../../types';

const color: AttributeSchema<IconBorderColorTokenSchema> = {
  color: {
    iconBorder: {
      brand: {
        attributes: {
          group: 'paint',
          description: `
Use rarely for icons or borders representing brand, in-progress, or information, such as the icons in information sections messages.

Also use for blue icons or borders when there is no meaning tied to the color, such as file type icons.`,
        },
      },
      danger: {
        attributes: {
          group: 'paint',
          description: `
Use rarely for icons and borders representing critical information, such the icons in error section messages or the borders on invalid text fields.

Also use for red icons or borders when there is no meaning tied to the color, such as file type icons.`,
        },
      },
      warning: {
        attributes: {
          group: 'paint',
          description: `
Use rarely for icons and borders representing semi-urgent information, such as the icons in warning section messages.

Also use for yellow icons or borders when there is no meaning tied to the color, such as file type icons.
`,
        },
      },
      success: {
        attributes: {
          group: 'paint',
          description: `
Use rarely for icons and borders representing positive information, such as the icons in success section messages or the borders on validated text fields.

Also use for green icons or borders when there is no meaning tied to the color, such as file type icons.
`,
        },
      },
      discovery: {
        attributes: {
          group: 'paint',
          description: `
Use rarely for icons and borders representing new information, such as the icons in discovery section mesages or the borders in onboarding spotlights.

Also use for purple icons or borders when there is no meaning tied to the color, such as file type icons.
`,
        },
      },
    },
  },
};

export default color;
