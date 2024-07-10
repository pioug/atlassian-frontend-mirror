import { snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import Basic from '../../../../examples/0-basic-tag';
import Removable from '../../../../examples/0-removable-tag';
import Truncation from '../../../../examples/99-testing-truncation';

const themeVariants: SnapshotTestOptions<any>['variants'] = [
	{
		name: 'light',
		environment: {
			colorScheme: 'light',
		},
	},
	{
		name: 'dark',
		environment: {
			colorScheme: 'dark',
		},
	},
	{
		name: 'none',
		environment: {
			colorScheme: 'no-preference',
		},
	},
];

snapshot(Basic, {
	variants: themeVariants,
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(Truncation, {
	variants: themeVariants,
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(Removable, {
	states: [
		{
			selector: {
				byTestId: 'close-button-removableTag',
			},
			state: 'focused',
		},
	],
	variants: themeVariants,
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
