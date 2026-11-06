import { snapshotInformational } from '@af/visual-regression';

import Loading from '../../../examples/93-testing-is-loading-reposition.vr.ap';

const flags = {
	'platform-dst-new-menu': [true, false],
} as const;

snapshotInformational(Loading, {
	description: 'reposition after isLoading change',
	async prepare(page) {
		await page.getByRole('button', { name: 'Toggle isLoading' }).click();
	},
	drawsOutsideBounds: true,
	featureFlags: flags,
});
