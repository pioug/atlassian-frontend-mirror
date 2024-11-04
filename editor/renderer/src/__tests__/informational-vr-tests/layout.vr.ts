// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';

import { Layout4ColRenderer, Layout5ColRenderer, OverflowLayoutRenderer } from './layout.fixture';

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

snapshotInformational(Layout4ColRenderer, {
	description: '4 column layout when layout size < 550px',
	featureFlags: { advanced_layouts: true },
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 500,
			height: 400,
		});
	},
});

snapshotInformational(Layout4ColRenderer, {
	description: '4 column layout when layout size between 550px and 759px',
	featureFlags: { advanced_layouts: true },
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 700,
			height: 400,
		});
	},
});

snapshotInformational(Layout4ColRenderer, {
	description: '4 column layout when layout size >= 760px',
	featureFlags: { advanced_layouts: true },
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1000,
			height: 400,
		});
	},
});

snapshotInformational(Layout5ColRenderer, {
	description: '5 column layout when layout size < 550px',
	featureFlags: { advanced_layouts: true },
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 500,
			height: 400,
		});
	},
});

snapshotInformational(Layout5ColRenderer, {
	description: '5 column layout when layout size between 550px and 759px',
	featureFlags: { advanced_layouts: true },
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 700,
			height: 400,
		});
	},
});

snapshotInformational(Layout5ColRenderer, {
	description: '5 column layout when layout size >= 760px',
	featureFlags: { advanced_layouts: true },
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1000,
			height: 400,
		});
	},
});
