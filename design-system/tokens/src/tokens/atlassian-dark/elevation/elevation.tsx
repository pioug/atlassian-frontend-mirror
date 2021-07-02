import type { ElevationTokenSchema } from '../../../types';

const elevation: ElevationTokenSchema = {
  elevation: {
    borderFlatPrimary: {
      value: 'DN300A',
      attributes: { group: 'paint' },
    },
    flatSecondary: {
      value: 'DN-100A',
      attributes: { group: 'paint' },
    },
    base: {
      value: 'DN0',
      attributes: { group: 'paint' },
    },
    backgroundCard: {
      value: 'DN100',
      attributes: { group: 'paint' },
    },
    shadowCard: {
      value: [
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'DN0',
          opacity: 0.5,
        },
        {
          radius: 1,
          offset: { x: 0, y: 1 },
          color: 'DN0',
          opacity: 0.5,
        },
      ],
      attributes: { group: 'shadow' },
    },
    backgroundOverlay: {
      value: 'DN200',
      attributes: { group: 'paint' },
    },
    shadowOverlay: {
      value: [
        {
          radius: 1,
          offset: { x: 0, y: 0 },
          color: 'DN0',
          opacity: 0.5,
        },
        {
          radius: 12,
          offset: { x: 0, y: 8 },
          color: 'DN0',
          opacity: 0.5,
        },
      ],
      attributes: { group: 'shadow' },
    },
    borderOverlay: {
      value: 'DN100A',
      attributes: { group: 'paint' },
    },
  },
};

export default elevation;
