import type {
  AttributeSchema,
  TypographyTokenSchema,
} from '../../../src/types';

/**
 *
 * @example
 * ```js
 * {
 *   body: {
 *     value: {
 *       fontWeight: 500,
 *       fontSize: "16px",
 *       lineHeight: "22px",
 *       fontFamily: "Helvetica",
 *       fontStyle: "italic"
 *    },
 *    type: "typography"
 *}
 * ```
 */
const font: AttributeSchema<TypographyTokenSchema<any>> = {
  font: {
    code: {
      '[default]': {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description: 'ALPHA - Use with caution. Used for monospace and code.',
        },
      },
    },
    heading: {
      xxlarge: {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description: 'ALPHA - Use with caution. Use for main headings.',
          responsiveSmallerVariant: 'font.heading.xlarge',
        },
      },
      xlarge: {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description: 'ALPHA - Use with caution. Use for main headings.',
          responsiveSmallerVariant: 'font.heading.large',
        },
      },
      large: {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description: 'ALPHA - Use with caution. Use for main headings.',
          responsiveSmallerVariant: 'font.heading.medium',
        },
      },
      medium: {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description:
            'ALPHA - Use with caution. Use for less important headings.',
          responsiveSmallerVariant: 'font.heading.small',
        },
      },
      small: {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description:
            'ALPHA - Use with caution. Use for less important headings.',
        },
      },
      xsmall: {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description: 'ALPHA - Use with caution. Use for smaller headings.',
        },
      },
      xxsmall: {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description:
            'ALPHA - Use with caution. Smallest heading size available.',
        },
      },
    },
    ui: {
      small: {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description:
            'ALPHA - Use with caution. Single-line non-wrapping supporting text like that in a smaller label.',
        },
      },
      '[default]': {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description:
            'ALPHA - Use with caution. Single-line non-wrapping text like that in a button.',
        },
      },
    },
    body: {
      large: {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description:
            'ALPHA - Use with caution. Larger body font or default body font for text rich experiences.',
        },
      },
      small: {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description: 'ALPHA - Use with caution. Smaller body font.',
        },
      },
      '[default]': {
        attributes: {
          group: 'typography',
          state: 'active',
          introduced: '1.14.0',
          description: 'ALPHA - Use with caution. The default body font.',
        },
      },
    },
  },
};

export default font;
