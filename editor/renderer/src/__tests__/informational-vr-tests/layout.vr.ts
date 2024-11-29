// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';

import {
	Layout4ColInFullWidthRenderer,
	Layout5ColRenderer,
	OverflowLayoutRenderer,
} from './layout.fixture';

import { snapshotInformational } from '@af/visual-regression';

snapshotInformational(OverflowLayoutRenderer, {
	description: 'layout with overflow on left',
	prepare: async (page: Page) => {
		const overflowSection = page.getByText('dummy extensionscroll me').first();
		await overflowSection.click();
		const box = await overflowSection.boundingBox();
		await page.mouse.wheel(box!.width, 0);
	},
});

snapshotInformational(OverflowLayoutRenderer, {
	description: 'layout with partial overflow on both sides',
	prepare: async (page: Page) => {
		await page.getByText('dummy extensionscroll me').first().click();
		// Arbitrary amount to scroll a little so that we have overflow on both sides
		await page.mouse.wheel(50, 0);
	},
});

// Advanced layouts
snapshotInformational(Layout4ColInFullWidthRenderer, {
	description: '4 column layout when layout size < 630px',
	featureFlags: { advanced_layouts: true },
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 629,
			height: 400,
		});
	},
});

snapshotInformational(Layout4ColInFullWidthRenderer, {
	description: '4 column layout when layout size is 630px',
	featureFlags: { advanced_layouts: true },
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 630,
			height: 400,
		});
	},
});

snapshotInformational(Layout5ColRenderer, {
	description: '5 column layout when layout size < 630px',
	featureFlags: { advanced_layouts: true },
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 693,
			height: 400,
		});
	},
});

snapshotInformational(Layout5ColRenderer, {
	description: '5 column layout when layout size is 630px',
	featureFlags: { advanced_layouts: true },
	prepare: async (page: Page) => {
		await page.setViewportSize({
			// There are 64px padding in full page editor
			// hence to have 630px layout width, we need 630 + 64
			width: 694,
			height: 400,
		});
	},
});
