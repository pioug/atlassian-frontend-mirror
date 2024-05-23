import { type LetterSpacingTokenSchema, type ValueSchema } from '../../../src/types';
import { type LetterSpacingBaseToken as BaseToken } from '../../palettes/typography-palette';

const font: ValueSchema<LetterSpacingTokenSchema<BaseToken>> = {
  font: {
    letterSpacing: {
      '0': { value: 'LetterSpacing0' },
      '100': { value: 'LetterSpacing100' },
      '200': { value: 'LetterSpacing200' },
      '300': { value: 'LetterSpacing300' },
      '400': { value: 'LetterSpacing400' },
    },
  },
};

export default font;
