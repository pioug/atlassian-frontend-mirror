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
          state: 'experimental',
          introduced: '1.14.0',
          description: 'Used for monospace and code.',
        },
      },
    },
    heading: {
      xxlarge: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
          responsiveSmallerVariant: 'font.heading.xlarge',
        },
      },
      xlarge: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
          responsiveSmallerVariant: 'font.heading.large',
        },
      },
      large: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
          responsiveSmallerVariant: 'font.heading.medium',
        },
      },
      medium: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
          responsiveSmallerVariant: 'font.heading.small',
        },
      },
      small: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
        },
      },
      xsmall: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
        },
      },
      xxsmall: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
        },
      },
    },
    ui: {
      small: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description:
            'Single-line non-wrapping supporting text like that in a smaller label.',
        },
      },
      '[default]': {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'Single-line non-wrapping text like that in a button.',
        },
      },
    },
    body: {
      large: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description:
            'Larger body font or default body font for text rich experiences.',
        },
      },
      small: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'Smaller body font.',
        },
      },
      '[default]': {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'The default body font.',
        },
      },
    },
  },
};

export default font;
