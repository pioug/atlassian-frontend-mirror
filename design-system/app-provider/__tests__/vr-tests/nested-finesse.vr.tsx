import { snapshot } from '@af/visual-regression';

import NestedFinesseExample from '../../examples/nested-finesse.vr.ap';

snapshot(NestedFinesseExample, {
	featureFlags: {
		'platform-dst-tokens-finesse': true,
		'platform-static-theme-loading': false,
	},
	// The client loader imports CSS asynchronously. Wait for its requests to settle.
	waitForNetworkIdle: true,
	variants: [
		{ name: 'Light app with dark subtree', environment: { colorScheme: 'light' } },
		// eslint-disable-next-line @atlaskit/design-system/no-dark-theme-vr-tests -- Exercises the missing light override under a dark parent, rather than duplicating a palette snapshot.
		{ name: 'Dark app with light subtree', environment: { colorScheme: 'dark' } },
	],
});
