import { snapshot } from '@af/visual-regression';

// TODO: rename from "experimental" (do this in a follow up PR)
import ExperimentalTreeItem, { RTLTree } from '../../examples/11-tree-item.vr.ap';

// Testing both variants for this PR
// TODO: change to just be "light"
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(ExperimentalTreeItem, {
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

snapshot(RTLTree, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
