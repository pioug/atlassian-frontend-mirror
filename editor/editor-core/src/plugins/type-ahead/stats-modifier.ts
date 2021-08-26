import type { TypeAheadStatsModifier } from './types';

export class StatsModifier implements TypeAheadStatsModifier {
  startedAt: number = 0;
  endedAt: number = 0;
  keyCount: {
    arrowUp: number;
    arrowDown: number;
  } = {
    arrowUp: 0,
    arrowDown: 0,
  };

  constructor() {
    this.startedAt = performance.now();
    this.keyCount = {
      arrowUp: 0,
      arrowDown: 0,
    };
  }

  increaseArrowUp = () => {
    this.keyCount.arrowUp += 1;
  };
  increaseArrowDown = () => {
    this.keyCount.arrowDown += 1;
  };

  serialize = () => {
    return {
      startedAt: this.startedAt,
      endedAt: performance.now(),
      keyCount: {
        arrowUp: this.keyCount?.arrowUp || 0,
        arrowDown: this.keyCount?.arrowDown || 0,
      },
    };
  };
}
