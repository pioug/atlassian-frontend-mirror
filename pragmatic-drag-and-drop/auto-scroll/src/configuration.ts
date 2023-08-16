import type { ScrollContainerConfig } from './internal-types';

// TODO: expose deep merge with provided config
export const defaultConfig: ScrollContainerConfig = {
  // allowedAxis: 'both',
  startScrollFromPercentage: {
    top: 0.25,
    right: 0.25,
    bottom: 0.25,
    left: 0.25,
  },
  maxScrollAtPercentage: {
    top: 0.05,
    right: 0.05,
    bottom: 0.05,
    left: 0.05,
  },
  // maxPixelScrollPerSecond: {
  //   top: 1680,
  //   right: 1680,
  //   bottom: 1680,
  //   left: 1680,
  // },
  // ease({ percentage }) {
  //   if (percentage < 30) {
  //     return 0;
  //   }
  // },
};
