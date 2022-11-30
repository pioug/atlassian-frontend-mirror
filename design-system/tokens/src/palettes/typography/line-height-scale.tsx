import { LineHeightScaleTokenSchema } from '../../types';

export type LineHeightScaleValues =
  | 'LineHeight100'
  | 'LineHeight200'
  | 'LineHeight300'
  | 'LineHeight400'
  | 'LineHeight500'
  | 'LineHeight600';

export type BaseToken =
  keyof LineHeightScaleTokenSchema<LineHeightScaleValues>['lineHeight'];

const scale: LineHeightScaleTokenSchema<LineHeightScaleValues> = {
  lineHeight: {
    LineHeight100: {
      value: '16px',
      attributes: {
        group: 'scale',
      },
    },
    LineHeight200: {
      value: '20px',
      attributes: {
        group: 'scale',
      },
    },
    LineHeight300: {
      value: '24px',
      attributes: {
        group: 'scale',
      },
    },
    LineHeight400: {
      value: '28px',
      attributes: {
        group: 'scale',
      },
    },
    LineHeight500: {
      value: '32px',
      attributes: {
        group: 'scale',
      },
    },
    LineHeight600: {
      value: '40px',
      attributes: {
        group: 'scale',
      },
    },
  },
};

export default scale;
