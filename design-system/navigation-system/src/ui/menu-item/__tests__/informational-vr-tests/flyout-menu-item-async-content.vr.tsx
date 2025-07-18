import { snapshotInformational } from '@atlassian/gemini';

import FlyoutMenuItemAsyncContentExample from '../../../../../examples/flyout-menu-item-async-content';

snapshotInformational(FlyoutMenuItemAsyncContentExample, {
	description: 'short skeleton',
	featureFlags: {
		platform_dst_nav4_flyout_update_on_resize: [true, false],
	},
	async prepare(page) {
		await page.getByRole('button', { name: 'Recent' }).click();
	},
});

snapshotInformational(FlyoutMenuItemAsyncContentExample, {
	description: 'long content after short skeleton',
	featureFlags: {
		platform_dst_nav4_flyout_update_on_resize: [true, false],
	},
	async prepare(page) {
		await page.getByRole('button', { name: 'Recent' }).click();
		await page.getByRole('button', { name: 'Load items' }).click();
	},
});

snapshotInformational(FlyoutMenuItemAsyncContentExample, {
	description: 'long skeleton',
	featureFlags: {
		platform_dst_nav4_flyout_update_on_resize: [true, false],
	},
	async prepare(page) {
		await page.getByRole('button', { name: 'Starred' }).click();
	},
});

snapshotInformational(FlyoutMenuItemAsyncContentExample, {
	description: 'short content after long skeleton',
	featureFlags: {
		platform_dst_nav4_flyout_update_on_resize: [true, false],
	},
	async prepare(page) {
		await page.getByRole('button', { name: 'Starred' }).click();
		await page.getByRole('button', { name: 'Load items' }).click();
	},
});
