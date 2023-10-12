import type {
  AttributeSchema,
  LineHeightTokenSchema,
} from '../../../src/types';
import { LineHeightBaseToken as BaseToken } from '../../palettes/typography-palette';

const font: AttributeSchema<LineHeightTokenSchema<BaseToken>> = {
  font: {
    lineHeight: {
      '1': {
        attributes: {
          group: 'lineHeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Used single-line text.',
        },
      },
      '100': {
        attributes: {
          group: 'lineHeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      '200': {
        attributes: {
          group: 'lineHeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      '300': {
        attributes: {
          group: 'lineHeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      '400': {
        attributes: {
          group: 'lineHeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      '500': {
        attributes: {
          group: 'lineHeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
      '600': {
        attributes: {
          group: 'lineHeight',
          state: 'active',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
        },
      },
    },
  },
};

export default font;
