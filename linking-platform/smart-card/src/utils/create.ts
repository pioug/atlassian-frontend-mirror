import type { CardType } from '@atlaskit/linking-common/types';

import { getMarkName } from './get-mark-name';
import { getMeasure } from './get-measure';
import { getMeasureName } from './get-measure-name';
import { hasPerformanceAPIAvailable } from './has-performance-api-available';

const getMark = (id: string, status: CardType): PerformanceEntry | undefined => {
	if (hasPerformanceAPIAvailable) {
		const name = getMarkName(id, status);
		const marks = performance.getEntriesByName(name);
		if (marks.length > 0) {
			return marks[0];
		}
		return undefined;
	}
};

export const create = (id: string, status: CardType): void => {
	if (hasPerformanceAPIAvailable) {
		const name = getMeasureName(id, status);
		const measure = getMeasure(id, status);
		if (!measure) {
			const startMark = getMark(id, 'pending');
			const endMark = getMark(id, status);
			if (startMark && endMark) {
				performance.measure(name, startMark.name, endMark.name);
			}
		}
	}
};
