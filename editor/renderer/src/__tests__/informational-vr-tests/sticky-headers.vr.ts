import type { Locator, Page } from '@playwright/test';
import { snapshotInformational } from '@af/visual-regression';
import {
	StickyHeaderRowWithOnlyNonHeader,
	StickyHeaderRowWithOnlyHeader,
	StickyHeaderUnResizedTableNumberedColumnRenderer,
	StickyHeaderUnResizedTableRenderer,
	StickyHeaderUnResizedTableWithoutHeaderRowRenderer,
	StickyHeaderRowWithResizedColumns,
	StickyHeadersBrokenOutTableNoResize,
	StickyHeadersBrokenOutTableResized,
	StickyHeadersBrokenOutTableOverflowing,
	StickyHeadersTableOverflowing,
	StickyHeadersTableOverflowingNumberedColumn,
	StickyHeadersTableInsideLayout,
	StickyHeadersTableInsideLayoutBrokenOut,
	StickyHeadersTableMultipleHeaderRows,
	StickyHeadersTableMergedRows,
} from './sticky-headers.fixture';

async function scrollToPos(page: Page, pos: number) {
	return page.evaluate((pos: number) => {
		if (!window) {
			return;
		}
		document.querySelector('#testscrollcontainer')?.scrollTo(0, pos);
		// wait for the scroll animation
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(null);
			}, 50);
		});
	}, pos);
}

snapshotInformational(StickyHeaderUnResizedTableRenderer, {
	description: 'should have the header stick for an unresized-table',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 80);
	},
});

// skipping as I can't replicate bug
snapshotInformational.skip(StickyHeaderUnResizedTableNumberedColumnRenderer, {
	description: 'should have the header stick for an unresized-table with numbered column',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 80);
	},
});

snapshotInformational(StickyHeaderUnResizedTableWithoutHeaderRowRenderer, {
	description: 'should have the header not stick for an unresized-table with no header row',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 120);
	},
});

snapshotInformational(StickyHeaderRowWithOnlyHeader, {
	description: 'should have the header not stick for an table with only header row',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 120);
	},
});

snapshotInformational(StickyHeaderRowWithOnlyNonHeader, {
	description: 'should have the header not stick for a table with only regular row',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 120);
	},
});

snapshotInformational(StickyHeaderRowWithResizedColumns, {
	description: 'should have the header not stick for an table with resized columns',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 120);
	},
});

snapshotInformational(StickyHeadersBrokenOutTableNoResize, {
	description: 'should have the header stick for a broken out table with no resized columns',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 80);
	},
});

snapshotInformational(StickyHeadersBrokenOutTableResized, {
	description: 'should have the header stick for a broken out table no resized columns',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 60);
	},
});

snapshotInformational(StickyHeadersBrokenOutTableOverflowing, {
	description: 'should have the header stick for a broken out table overflow',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 120);
	},
});

snapshotInformational(StickyHeadersTableOverflowing, {
	description: 'should have the header stick for an table with overflow',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 120);
	},
});

snapshotInformational(StickyHeadersTableOverflowingNumberedColumn, {
	description: 'should have the header stick for an table with overflow and numbered column',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 120);
	},
});

snapshotInformational(StickyHeadersTableInsideLayout, {
	description: 'should have the header stick for an table within a layout',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 120);
	},
});

snapshotInformational(StickyHeadersTableInsideLayoutBrokenOut, {
	description: 'should have the header stick for an table within layout and brokenout',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 120);
	},
});

snapshotInformational(StickyHeadersTableMultipleHeaderRows, {
	description: 'should have both headers stick for an table with multiple headers 1',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 90);
	},
});

snapshotInformational(StickyHeadersTableMultipleHeaderRows, {
	description: 'should have both headers stick for an table with multiple headers 2',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 234);
	},
});

snapshotInformational(StickyHeadersTableMergedRows, {
	description: 'should have the headers not stick for an table with merged cells',
	prepare: async (page: Page, component: Locator) => {
		await scrollToPos(page, 90);
	},
});
