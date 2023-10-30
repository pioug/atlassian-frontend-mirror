import type { ScrollContainerConfig } from '../internal-types';

export const defaultConfig: ScrollContainerConfig = {
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
  // What the value would be if we were scrolling at 15px per frame at 60fps
  maxPixelScrollPerSecond: 60 * 15,
  timeDampeningDurationMs: 300,
  // Too big and it's too easy to trigger auto scrolling
  // Too small and it's too hard 😅
  maxMainAxisHitboxSize: 180,
};
