// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import {
	HeadingInsidePanel,
	SimpleHeadingInsideExpand,
	SimpleHeadingInsideTable,
	SimpleHeadingInsideLayout,
} from './heading-links.fixture.vr.ap';

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
