import { LetterSpacingBaseToken as BaseToken } from '../../../palettes/typography-palette';
import type { AttributeSchema, LetterSpacingTokenSchema } from '../../../types';

const font: AttributeSchema<LetterSpacingTokenSchema<BaseToken>> = {
  font: {
    letterSpacing: {
      '0': {
        attributes: {
          group: 'letterSpacing',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      '100': {
        attributes: {
          group: 'letterSpacing',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      '200': {
        attributes: {
          group: 'letterSpacing',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      '300': {
        attributes: {
          group: 'letterSpacing',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      '400': {
        attributes: {
          group: 'letterSpacing',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
    },
  },
};

export default font;
