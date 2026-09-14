import { snapshotInformational } from '@af/visual-regression';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import {
	RendererLeftAndRightWrappedMediaLinkInsideTable,
	RendererLeftWrappedMediaLinkInsideTable,
	RendererMediaLink,
	RendererMediaLinkInsideExpand,
	RendererMediaLinkInsideNestedExpand,
	RendererMediaLinkInsideTable,
	RendererMediaLinkWrapped,
	RendererRightWrappedMediaLinkInsideTable,
} from './media-link.fixtures.vr.ap';

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(RendererMediaLink, {});

snapshotInformational.skip(RendererMediaLink, {
	description: 'should render a linked media image correctly when clicked',
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');

		await media.hover();
		await media.click();
	},
});

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(RendererMediaLink, {
	description: 'should render a linked media image correctly when focused',
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');

		await link.focus();
		await media.hover();
	},
});

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(RendererMediaLinkWrapped, {
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');

		await media.nth(0).waitFor({ state: 'visible' });
		await media.nth(1).waitFor({ state: 'visible' });
	},
});

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(RendererMediaLinkWrapped, {
	description: 'should render a linked media image below a wrapped image correctly when focused',
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');

		await media.nth(0).waitFor({ state: 'visible' });
		await media.nth(1).waitFor({ state: 'visible' });

		await link.focus();
		await media.nth(1).hover();
	},
});

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(RendererMediaLinkInsideExpand, {
	ignoredErrors: [
		{
			// Gemini is complain because this component packages/editor/renderer/src/ui/Expand.tsx
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			pattern: /for a non-boolean attribute/,
			ignoredBecause: 'Because it is not part of the migration effort to fix warnings',
			jiraIssueId: 'TD-0000',
		},
	],
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');
		const expandButton = page.getByRole('button');

		await expandButton.click();
		await link.focus();
		await media.hover();
	},
});

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(RendererMediaLinkInsideNestedExpand, {
	ignoredErrors: [
		{
			// Gemini is complain because this component packages/editor/renderer/src/ui/Expand.tsx
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			pattern: /for a non-boolean attribute/,
			ignoredBecause: 'Because it is not part of the migration effort to fix warnings',
			jiraIssueId: 'TD-0000',
		},
	],
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');
		const expandButton = page.getByRole('button', {
			name: 'Click here to expand',
		});

		await expandButton.click();
		await link.focus();
		await media.hover();
	},
});

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(RendererMediaLinkInsideTable, {
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');

		await link.first().focus();
		await media.nth(1).hover();
	},
});

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(RendererRightWrappedMediaLinkInsideTable, {
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');

		await link.first().focus();
		await media.nth(1).hover();
	},
});

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(RendererLeftWrappedMediaLinkInsideTable, {
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');

		await link.first().focus();
		await media.nth(1).hover();
	},
});

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(RendererLeftAndRightWrappedMediaLinkInsideTable, {
	prepare: async (page: Page, component: Locator) => {
		const media = page.locator('.rich-media-item');
		const link = page.getByRole('link');

		await link.first().focus();
		await media.nth(1).hover();
	},
});
