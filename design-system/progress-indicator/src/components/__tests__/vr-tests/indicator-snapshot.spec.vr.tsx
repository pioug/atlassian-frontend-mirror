import { snapshot, type SnapshotTestOptions } from '@af/visual-regression';

export const themeVariants: SnapshotTestOptions<any>['variants'] = [
	{
		name: 'Default',
		environment: {},
	},
	{
		name: 'Light',
		environment: {
			colorScheme: 'light',
		},
	},
];

import ProgressIndicatorAppearances from '../../../../examples/progress-indicator-appearances';
import ProgressIndicatorSizeSpacing from '../../../../examples/progress-indicator-size-spacing';

snapshot(ProgressIndicatorSizeSpacing, {
	variants: themeVariants,
});

snapshot(ProgressIndicatorAppearances, {
	variants: themeVariants,
});
