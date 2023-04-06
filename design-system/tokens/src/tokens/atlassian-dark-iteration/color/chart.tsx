import type { BaseToken } from '../../../palettes/palette';
import type {
  ChartColorTokenSchema,
  ExtendedValueSchema,
} from '../../../types';

const color: ExtendedValueSchema<ChartColorTokenSchema<BaseToken>> = {
  color: {
    chart: {
      neutral: {
        hovered: {
          // @ts-ignore new value for DarkNeautral700
          value: '#8C9BAB',
        },
      },
      gray: {
        bold: {
          hovered: {
            // @ts-ignore new value for DarkNeautral700
            value: '#8C9BAB',
          },
        },
        bolder: {
          '[default]': {
            // @ts-ignore new value for DarkNeautral700
            value: '#8C9BAB',
          },
        },
      },
    },
  },
};

export default color;
