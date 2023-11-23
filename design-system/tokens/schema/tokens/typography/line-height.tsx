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
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Used single-line text.',
          deprecated: '1.29.0',
        },
      },
      '100': {
        attributes: {
          group: 'lineHeight',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      '200': {
        attributes: {
          group: 'lineHeight',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      '300': {
        attributes: {
          group: 'lineHeight',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      '400': {
        attributes: {
          group: 'lineHeight',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      '500': {
        attributes: {
          group: 'lineHeight',
          state: 'deprecated',
          introduced: '0.10.33',
          description: 'Helpful guidance goes here',
          deprecated: '1.29.0',
        },
      },
      '600': {
        attributes: {
          group: 'lineHeight',
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
