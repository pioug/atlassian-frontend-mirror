import type { CardType } from '@atlaskit/linking-common/types';

import { getMeasureName } from './get-measure-name';
import { hasPerformanceAPIAvailable } from './has-performance-api-available';

export const getMeasure = (id: string, status: CardType): PerformanceEntry | undefined => {
	if (hasPerformanceAPIAvailable) {
		const name = getMeasureName(id, status);
		const measures = performance.getEntriesByName(name);
		if (measures.length > 0) {
			return measures[0];
		}
		return undefined;
	}
};
