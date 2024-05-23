import type {
  AttributeSchema,
  LetterSpacingTokenSchema,
} from '../../../src/types';
import { type LetterSpacingBaseToken as BaseToken } from '../../palettes/typography-palette';

const font: AttributeSchema<LetterSpacingTokenSchema<BaseToken>> = {
  font: {
    letterSpacing: {
      '0': {
        attributes: {
          group: 'letterSpacing',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      '100': {
        attributes: {
          group: 'letterSpacing',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      '200': {
        attributes: {
          group: 'letterSpacing',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      '300': {
        attributes: {
          group: 'letterSpacing',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      '400': {
        attributes: {
          group: 'letterSpacing',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
    },
  },
};

export default font;
