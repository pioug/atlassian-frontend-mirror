import { snapshotInformational } from '@af/visual-regression';

import { CompositionVR } from '../../../examples/composition.vr.ap';

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
		platform_dst_nav4_skip_link_menu_placeholder: true,
	},
	async prepare(page) {
		await page.getByRole('button', { name: 'Skip to' }).focus();
	},
});

// TODO(top-layer): with `platform-dst-motion-uplift-popup` on (production), legacy Popup puts its
// focus trap on the motion container, which cannot take focus, so focus ends up on a different
// element when the popup opens and this snapshot shows a different focus state. The top layer
// should fix this.
snapshotInformational.skip(CompositionVR, {
	description: 'skip link popup',
	variants: [
		{
			name: 'Light mode',
			environment: { colorScheme: 'light' },
		},
	],
	featureFlags: {
		platform_dst_nav4_skip_link_a11y_1: true,
		platform_dst_nav4_skip_link_menu_placeholder: true,
	},
	async prepare(page) {
		await page.getByRole('button', { name: 'Skip to' }).focus();
		await page.getByRole('button', { name: 'Skip to' }).click();
		await page.getByRole('link', { name: 'Sidebar' }).waitFor({ state: 'visible' });
	},
});
