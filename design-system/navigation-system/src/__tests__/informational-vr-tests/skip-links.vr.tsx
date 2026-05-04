import { snapshotInformational } from '@af/visual-regression';

import { CompositionVR } from '../../../examples/composition';

snapshotInformational(CompositionVR, {
	description: 'skip link popup trigger',
	variants: [
		{
			name: 'Light mode',
			environment: { colorScheme: 'light' },
		},
	],
	featureFlags: {
		platform_dst_nav4_skip_link_a11y_1: true,
	},
	async prepare(page) {
		await page.getByRole('button', { name: 'Skip to' }).focus();
	},
});

snapshotInformational(CompositionVR, {
	description: 'skip link popup',
	variants: [
		{
			name: 'Light mode',
			environment: { colorScheme: 'light' },
		},
	],
	featureFlags: {
		platform_dst_nav4_skip_link_a11y_1: true,
	},
	async prepare(page) {
		await page.getByRole('button', { name: 'Skip to' }).focus();
		await page.getByRole('button', { name: 'Skip to' }).click();
		await page.getByRole('link', { name: 'Sidebar' }).waitFor({ state: 'visible' });
	},
});
