import type { ElevationTokenSchema } from '../../../types';

const elevation: ElevationTokenSchema = {
  elevation: {
    borderFlatPrimary: {
      value: 'N300A',
      attributes: { group: 'paint' },
    },
    flatSecondary: {
      value: 'N100A',
      attributes: { group: 'paint' },
    },
    base: {
      value: 'N0',
      attributes: { group: 'paint' },
    },
    backgroundCard: {
      value: 'N0',
      attributes: { group: 'paint' },
    },
    shadowCard: {
      value: [
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'N1100',
          opacity: 0.3,
        },
        {
          radius: 1,
          offset: { x: 0, y: 1 },
          color: 'N1100',
          opacity: 0.25,
        },
      ],
      attributes: { group: 'shadow' },
    },
    backgroundOverlay: {
      value: 'N0',
      attributes: { group: 'paint' },
    },
    shadowOverlay: {
      value: [
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'N1100',
          opacity: 0.3,
        },
        {
          radius: 12,
          offset: { x: 0, y: 8 },
          color: 'N1100',
          opacity: 0.15,
        },
      ],
      attributes: { group: 'shadow' },
    },
    borderOverlay: {
      value: 'N0',
      attributes: { group: 'paint' },
    },
  },
};

export default elevation;
