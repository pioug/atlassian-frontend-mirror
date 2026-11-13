import { snapshotInformational } from '@af/visual-regression';

import { InlineFallbacks } from '../../examples/all-placements.vr.ap';

snapshotInformational(InlineFallbacks, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	variants: [{ name: 'Light', environment: { colorScheme: 'light' } }],
	prepare: async (page) => {
		// Regular snapshots cannot set a custom viewport height.
		await page.setViewportSize({ width: 1280, height: 200 });
	},
});
