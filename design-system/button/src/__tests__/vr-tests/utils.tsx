import { type SnapshotTestOptions } from '@af/visual-regression';

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
	{
		name: 'Dark',
		environment: {
			colorScheme: 'dark',
		},
	},
];
