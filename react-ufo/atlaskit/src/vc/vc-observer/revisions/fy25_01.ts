import { FY24_01Classifier } from './fy24_01';
import { type FilterArgs } from './ViewportUpdateClassifier';

export class FY25_01Classifier extends FY24_01Classifier {
	revision = 'fy25.01';

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

	constructor() {
		super();
		this.mergeConfig();
	}
}

export const revFY25_01Classifier = new FY25_01Classifier();
