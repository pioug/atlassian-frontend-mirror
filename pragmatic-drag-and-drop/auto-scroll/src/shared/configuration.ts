import type { ScrollContainerConfig } from '../internal-types';

// TODO: expose deep merge with provided config
export const defaultConfig: ScrollContainerConfig = {
  // allowedAxis: 'both',
  // TODO: these names are not great, I'll work on them
  startHitboxAtPercentageRemainingOfElement: {
    top: 0.25,
    right: 0.25,
    bottom: 0.25,
    left: 0.25,
  },
  maxScrollAtPercentageRemainingOfHitbox: {
    top: 0.25,
    right: 0.25,
    bottom: 0.25,
    left: 0.25,
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
