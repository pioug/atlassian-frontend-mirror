import type { SpacingScaleTokenSchema } from '../types';

export type ScaleValues =
  | 'Space0'
  | 'Space025'
  | 'Space050'
  | 'Space075'
  | 'Space100'
  | 'Space150'
  | 'Space200'
  | 'Space250'
  | 'Space300'
  | 'Space400'
  | 'Space500'
  | 'Space600';

export type BaseToken = keyof SpacingScaleTokenSchema<
  ScaleValues
>['spacing']['scale'];

const scale: SpacingScaleTokenSchema<ScaleValues> = {
  spacing: {
    scale: {
      Space0: {
        value: '0',
        attributes: {
          group: 'scale',
        },
      },
      Space025: {
        value: '2px',
        attributes: {
          group: 'scale',
        },
      },
      Space050: {
        value: '4px',
        attributes: {
          group: 'scale',
        },
      },
      Space075: {
        value: '6px',
        attributes: {
          group: 'scale',
        },
      },
      Space100: {
        value: '8px',
        attributes: {
          group: 'scale',
        },
      },
      Space150: {
        value: '12px',
        attributes: {
          group: 'scale',
        },
      },
      Space200: {
        value: '16px',
        attributes: {
          group: 'scale',
        },
      },
      Space250: {
        value: '20px',
        attributes: {
          group: 'scale',
        },
      },
      Space300: {
        value: '24px',
        attributes: {
          group: 'scale',
        },
      },
      Space400: {
        value: '32px',
        attributes: {
          group: 'scale',
        },
      },
      Space500: {
        value: '40px',
        attributes: {
          group: 'scale',
        },
      },
      Space600: {
        value: '48px',
        attributes: {
          group: 'scale',
        },
      },
    },
  },
};

export default scale;
