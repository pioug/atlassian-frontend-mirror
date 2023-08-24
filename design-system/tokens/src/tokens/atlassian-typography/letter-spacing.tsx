import { LetterSpacingBaseToken as BaseToken } from '../../palettes/typography-palette';
import { LetterSpacingTokenSchema, ValueSchema } from '../../types';

const font: ValueSchema<LetterSpacingTokenSchema<BaseToken>> = {
  font: {
    letterSpacing: {
      '0': { value: 'LetterSpacing0' },
      '100': { value: 'LetterSpacing0' },
      '200': { value: 'LetterSpacing0' },
      '300': { value: 'LetterSpacing0' },
      '400': { value: 'LetterSpacing0' },
    },
  },
};

export default font;
