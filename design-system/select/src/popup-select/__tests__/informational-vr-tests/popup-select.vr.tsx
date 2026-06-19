import { Device, snapshotInformational } from '@af/visual-regression';

import PopupSelectExample from '../../../../examples/18-popup-select';

snapshotInformational(PopupSelectExample, {
	description: 'basic',
	variants: [
		{
			name: 'desktop',
			environment: { colorScheme: 'light' },
			device: Device.DESKTOP_CHROME,
		},
	],
	async prepare(page) {
		await page.getByRole('button', { name: 'switcher' }).click();
		// Wait for the popper-positioned menu to mount and become visible
		// before snapshotting. Without this wait the screenshot can race
		// against popper's first layout pass and yield sub-pixel diffs.
		await page.getByRole('listbox').waitFor({ state: 'visible' });
	},
});

snapshotInformational(PopupSelectExample, {
	description: 'in scroll container',
	variants: [
		{
			name: 'desktop',
			environment: { colorScheme: 'light' },
			device: Device.DESKTOP_CHROME,
		},
	],
	async prepare(page) {
		await page.getByRole('button', { name: 'Target3' }).click();
		// Wait for the popper-positioned menu to mount and become visible
		// before snapshotting. The scroll-container variant has been seen
		// to flake on a 128-pixel diff (ratio 0.01) when the snapshot is
		// captured before popper's first layout pass settles.
		await page.getByRole('listbox').waitFor({ state: 'visible' });
	},
});
