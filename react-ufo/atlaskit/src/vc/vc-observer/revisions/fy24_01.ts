import { type FilterArgs, ViewportUpdateClassifier } from './ViewportUpdateClassifier';

const legacyIgnoreReasons = [
	'image',
	'ssr-hydration',
	'editor-lazy-node-view',
	'editor-container-mutation',
];

export class FY24_01Classifier extends ViewportUpdateClassifier {
	revision = 'fy24.01';

	types = ['html', 'text'];

	filters = [
		{
			name: 'default-ignore-reasons',
			filter: ({ type, ignoreReason }: FilterArgs) => {
				return !ignoreReason || !legacyIgnoreReasons.includes(ignoreReason);
			},
		},
	];

	constructor() {
		super();
		this.mergeConfig();
	}
}

export const revFY24_01Classifier = new FY24_01Classifier();
