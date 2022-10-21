import { BaseToken } from '../../palettes/spacing-scale';
import type { SpacingTokenSchema, ValueSchema } from '../../types';

const spacing: ValueSchema<SpacingTokenSchema<BaseToken>> = {
  spacing: {
    container: {
      gutter: { value: 'Space100' },
    },
    scale: {
      '0': { value: 'Space0' },
      '025': { value: 'Space025' },
      '050': { value: 'Space050' },
      '075': { value: 'Space075' },
      '100': { value: 'Space100' },
      '150': { value: 'Space150' },
      '200': { value: 'Space200' },
      '250': { value: 'Space250' },
      '300': { value: 'Space300' },
      '400': { value: 'Space400' },
      '500': { value: 'Space500' },
      '600': { value: 'Space600' },
    },
  },
};

export default spacing;
