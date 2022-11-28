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

export type BaseToken =
  keyof SpacingScaleTokenSchema<ScaleValues>['spacing']['scale'];

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
        value: '0.125rem',
        attributes: {
          group: 'scale',
        },
      },
      Space050: {
        value: '0.25rem',
        attributes: {
          group: 'scale',
        },
      },
      Space075: {
        value: '0.375rem',
        attributes: {
          group: 'scale',
        },
      },
      Space100: {
        value: '0.5rem',
        attributes: {
          group: 'scale',
        },
      },
      Space150: {
        value: '0.75rem',
        attributes: {
          group: 'scale',
        },
      },
      Space200: {
        value: '1rem',
        attributes: {
          group: 'scale',
        },
      },
      Space250: {
        value: '1.25rem',
        attributes: {
          group: 'scale',
        },
      },
      Space300: {
        value: '1.5rem',
        attributes: {
          group: 'scale',
        },
      },
      Space400: {
        value: '2rem',
        attributes: {
          group: 'scale',
        },
      },
      Space500: {
        value: '2.5rem',
        attributes: {
          group: 'scale',
        },
      },
      Space600: {
        value: '3rem',
        attributes: {
          group: 'scale',
        },
      },
    },
  },
};

export default scale;
