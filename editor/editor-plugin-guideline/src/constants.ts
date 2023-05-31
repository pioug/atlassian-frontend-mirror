import { GuidelineConfig } from './types';

export const DEFAULT_GRIDS: GuidelineConfig[] = [...Array(13).keys()].map(
  index => ({
    key: `grid_${index}`,
    position: {
      left: `${(index * 100) / 12}%`,
    },
  }),
);
