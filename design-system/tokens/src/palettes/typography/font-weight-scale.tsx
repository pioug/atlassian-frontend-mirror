import { FontWeightScaleTokenSchema } from '../../types';

export type FontWeightScaleValues =
  | 'FontWeightRegular'
  | 'FontWeightMedium'
  | 'FontWeightSemiBold'
  | 'FontWeightBold';

export type BaseToken =
  keyof FontWeightScaleTokenSchema<FontWeightScaleValues>['fontWeight'];

const scale: FontWeightScaleTokenSchema<FontWeightScaleValues> = {
  fontWeight: {
    FontWeightRegular: {
      value: '400',
      attributes: {
        group: 'scale',
      },
    },
    FontWeightMedium: {
      value: '500',
      attributes: {
        group: 'scale',
      },
    },
    FontWeightSemiBold: {
      value: '600',
      attributes: {
        group: 'scale',
      },
    },
    FontWeightBold: {
      value: '700',
      attributes: {
        group: 'scale',
      },
    },
  },
};

export default scale;
