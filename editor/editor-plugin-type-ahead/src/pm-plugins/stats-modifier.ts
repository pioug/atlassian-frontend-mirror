import type { TypeAheadStatsModifier } from '../types';

export class StatsModifier implements TypeAheadStatsModifier {
	startedAt: number = 0;
	endedAt: number = 0;
	keyCount: {
		arrowDown: number;
		arrowUp: number;
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

	increaseArrowUp = (): void => {
		this.keyCount.arrowUp += 1;
	};
	increaseArrowDown = (): void => {
		this.keyCount.arrowDown += 1;
	};

	serialize = (): {
		startedAt: number;
		endedAt: number;
		keyCount: {
			arrowUp: number;
			arrowDown: number;
		};
	} => {
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
