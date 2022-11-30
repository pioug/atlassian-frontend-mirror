import { FontSizeScaleTokenSchema } from '../../types';

export type FontSizeScaleValues =
  | 'FontSize050'
  | 'FontSize075'
  | 'FontSize100'
  | 'FontSize200'
  | 'FontSize300'
  | 'FontSize400'
  | 'FontSize500'
  | 'FontSize600';

export type BaseToken =
  keyof FontSizeScaleTokenSchema<FontSizeScaleValues>['fontSize'];

const scale: FontSizeScaleTokenSchema<FontSizeScaleValues> = {
  fontSize: {
    FontSize050: {
      value: '11px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize075: {
      value: '12px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize100: {
      value: '14px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize200: {
      value: '16px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize300: {
      value: '20px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize400: {
      value: '24px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize500: {
      value: '29px',
      attributes: {
        group: 'scale',
      },
    },
    FontSize600: {
      value: '35px',
      attributes: {
        group: 'scale',
      },
    },
  },
};

export default scale;
