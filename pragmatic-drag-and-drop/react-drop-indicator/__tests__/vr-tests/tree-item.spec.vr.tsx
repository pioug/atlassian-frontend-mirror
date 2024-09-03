import { snapshot } from '@af/visual-regression';

import ExperimentalTreeItem from '../../examples/11-tree-item';

snapshot(ExperimentalTreeItem, {
	variants: [
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
	],
});
