import type { AttributeSchema, TypographyTokenSchema } from '../../../types';

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
      xxl: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
        },
      },
      xl: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
        },
      },
      lg: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
        },
      },
      md: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
        },
      },
      sm: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
        },
      },
      xs: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
        },
      },
      xxs: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description: 'TBD',
        },
      },
    },
    ui: {
      sm: {
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
      lg: {
        attributes: {
          group: 'typography',
          state: 'experimental',
          introduced: '1.14.0',
          description:
            'Larger body font or default body font for text rich experiences.',
        },
      },
      sm: {
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
