import type { ComponentsLogType } from '../../../common/vc/types';

import { FY25_01Classifier } from './fy25_01';
import type { FilterComponentsLogArgs } from './types';
import type { FilterArgs } from './ViewportUpdateClassifier';

export class FY25_02Classifier extends FY25_01Classifier {
	revision = 'fy25.02';

	types = ['attr'];

	filters = [
		{
			name: 'not-visible',
			filter: ({ type, ignoreReason }: FilterArgs) => {
				return !ignoreReason?.includes('not-visible');
			},
		},
	];

	removedFilters = [];

	// @todo remove it once fixed as described: https://product-fabric.atlassian.net/browse/AFO-3443
	filterComponentsLog({ componentsLog, ttai }: FilterComponentsLogArgs) {
		const _componentsLog: ComponentsLogType = {};
		Object.entries(componentsLog).forEach(([_timestamp, value]) => {
			const timestamp = Number(_timestamp);
			if (Math.ceil(ttai) >= timestamp) {
				_componentsLog[timestamp] = value;
			}
		});

		return _componentsLog;
	}

	constructor() {
		super();
		this.mergeConfig();
	}
}

export const revFY25_02Classifier = new FY25_02Classifier();
