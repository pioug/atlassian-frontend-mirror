import type { CardType } from '@atlaskit/linking-common/types';

import { getMarkName } from './get-mark-name';
import { hasPerformanceAPIAvailable } from './has-performance-api-available';

export const mark = (id: string, status: CardType): void => {
	if (hasPerformanceAPIAvailable) {
		const name = getMarkName(id, status);
		performance.mark(name);
	}
};
