// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';
import {
	HeadingInsidePanel,
	HeadingInsideLayout,
	HeadingInsideTable,
	HeadingInsideExpand,
	SimpleHeadingInsideExpand,
	SimpleHeadingInsideTable,
	SimpleHeadingInsideLayout,
} from './heading-links.fixture';

const RENDERER_HEADING_WRAPPER = 'renderer-heading-wrapper';

snapshotInformational(HeadingInsidePanel, {
	selector: {
		byTestId: RENDERER_HEADING_WRAPPER,
	},
	prepare: async (page: Page) => {
		const headingWrapper = page.getByTestId(RENDERER_HEADING_WRAPPER);
		const copyLink = headingWrapper.getByTestId('anchor-button');

		await headingWrapper.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(SimpleHeadingInsideTable, {
	description: 'heading inside table - first column',
	selector: {
		byTestId: RENDERER_HEADING_WRAPPER,
	},
	prepare: async (page: Page) => {
		const headingWrapper = page.getByTestId(RENDERER_HEADING_WRAPPER);
		const copyLink = headingWrapper.getByTestId('anchor-button');
		await headingWrapper.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(SimpleHeadingInsideLayout, {
	description: 'heading inside layout  first column ',
	selector: {
		byTestId: RENDERER_HEADING_WRAPPER,
	},
	prepare: async (page: Page) => {
		const headingWrapper = page.getByTestId(RENDERER_HEADING_WRAPPER);
		const copyLink = headingWrapper.getByTestId('anchor-button');
		await headingWrapper.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(SimpleHeadingInsideExpand, {
	selector: {
		byTestId: RENDERER_HEADING_WRAPPER,
	},
	description: 'heading inside expand first expand',
	prepare: async (page: Page) => {
		const expand = page.getByLabel('Expand content').first();
		const headingWrapper = page.getByTestId(RENDERER_HEADING_WRAPPER);
		const copyLink = headingWrapper.getByTestId('anchor-button');

		await expand.click();
		await headingWrapper.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsidePanel, {
	featureFlags: {
		platform_editor_copy_link_a11y_inconsistency_fix: false,
	},
	description: 'heading inside panel - platform_editor_copy_link_a11y_inconsistency_fix: false',
	selector: {
		byRole: 'heading',
	},
	prepare: async (page: Page) => {
		const heading = page.getByRole('heading');
		const copyLink = heading.getByTestId('anchor-button');

		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideExpand, {
	featureFlags: {
		platform_editor_copy_link_a11y_inconsistency_fix: false,
	},
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
	selector: {
		byRole: 'heading',
		options: {
			name: 'Heading 1',
		},
	},
	description:
		'heading inside expand first expand - platform_editor_copy_link_a11y_inconsistency_fix: false',
	prepare: async (page: Page) => {
		const expand = page.getByLabel('Expand content').first();
		const heading = page.getByRole('heading', { name: 'Heading 1' });
		const copyLink = heading.getByTestId('anchor-button');

		await expand.click();
		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideExpand, {
	featureFlags: {
		platform_editor_copy_link_a11y_inconsistency_fix: false,
	},
	description:
		'heading inside expand second expand - platform_editor_copy_link_a11y_inconsistency_fix: false',
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
	selector: {
		byRole: 'heading',
		options: {
			name: 'Heading 2',
		},
	},
	prepare: async (page: Page) => {
		const expand = page.getByLabel('Expand content').nth(1);
		const heading = page.getByRole('heading', { name: 'Heading 2' });
		const copyLink = heading.getByTestId('anchor-button');

		await expand.click();
		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideTable, {
	featureFlags: {
		platform_editor_copy_link_a11y_inconsistency_fix: false,
	},
	description:
		'heading inside table - first column - platform_editor_copy_link_a11y_inconsistency_fix: false',
	selector: {
		byRole: 'heading',
		options: {
			name: 'Table Heading 4',
		},
	},
	prepare: async (page: Page) => {
		const heading = page.getByRole('heading', {
			name: 'Table Heading 4',
		});
		const copyLink = heading.getByTestId('anchor-button');

		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideTable, {
	featureFlags: {
		platform_editor_copy_link_a11y_inconsistency_fix: false,
	},
	description:
		'heading inside table - second column - platform_editor_copy_link_a11y_inconsistency_fix: false',
	selector: {
		byRole: 'heading',
		options: {
			name: 'Multiline heading that wraps',
		},
	},
	prepare: async (page: Page) => {
		const heading = page.getByRole('heading', {
			name: 'Multiline heading that wraps',
		});
		const copyLink = heading.getByTestId('anchor-button');

		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideTable, {
	featureFlags: {
		platform_editor_copy_link_a11y_inconsistency_fix: false,
	},
	description:
		'heading inside table  second column but wrapped - platform_editor_copy_link_a11y_inconsistency_fix: false',
	selector: {
		byRole: 'heading',
		options: {
			name: 'Multiline heading that wraps',
		},
	},
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 400,
			height: 400,
		});
		const heading = page.getByRole('heading', {
			name: 'Multiline heading that wraps',
		});
		const copyLink = heading.getByTestId('anchor-button');

		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideLayout, {
	featureFlags: {
		platform_editor_copy_link_a11y_inconsistency_fix: false,
	},
	description:
		'heading inside layout  first column  - platform_editor_copy_link_a11y_inconsistency_fix: false',
	selector: {
		byRole: 'heading',
		options: {
			level: 4,
			name: 'LC Heading L',
		},
	},
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1200,
			height: 400,
		});
		const heading = page.getByRole('heading', {
			level: 4,
			name: 'LC Heading L',
		});
		const copyLink = heading.getByTestId('anchor-button');

		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});

snapshotInformational(HeadingInsideLayout, {
	featureFlags: {
		platform_editor_copy_link_a11y_inconsistency_fix: false,
	},
	description:
		'heading inside layout second column - platform_editor_copy_link_a11y_inconsistency_fix: false',
	selector: {
		byRole: 'heading',
		options: {
			level: 4,
			name: 'RC Heading L',
		},
	},
	prepare: async (page: Page) => {
		await page.setViewportSize({
			width: 1200,
			height: 400,
		});
		const heading = page.getByRole('heading', {
			level: 4,
			name: 'RC Heading L',
		});
		const copyLink = heading.getByTestId('anchor-button');

		await heading.hover({
			position: {
				x: 0,
				y: 0,
			},
		});

		await copyLink.waitFor({ state: 'visible' });
	},
});
