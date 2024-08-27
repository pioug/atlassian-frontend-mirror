// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	MediaResizeSide,
	resizeMediaInPosition,
	waitForMediaToBeLoaded,
} from '@atlaskit/editor-test-helpers/page-objects/media';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { clickFirstCell, resizeColumn } from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	Appearance,
	initEditorWithAdf,
	snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import mediaSingleInTableAdf from './__fixtures__/mediaSingle-in-table.adf.json';

describe('Snapshot Test: Media', () => {
	let page: PuppeteerPage;

	beforeAll(async () => {
		page = global.page;
		await initEditorWithAdf(page, {
			appearance: Appearance.fullPage,
			adf: mediaSingleInTableAdf,
			editorProps: {
				media: {
					allowMediaSingle: true,
					allowResizing: true,
				},
				allowTables: {
					advanced: true,
				},
			},
			initialPluginConfiguration: {
				tablesPlugin: {
					tableResizingEnabled: true,
				},
			},
		});
		await clickFirstCell(page);
		await waitForMediaToBeLoaded(page);
	});

	it('will give priority to table resize', async () => {
		// Shrink media to slightly less than cell (to force media not to maximise)
		await resizeMediaInPosition(page, 0, -10, MediaResizeSide.left);
		await resizeColumn(page, { colIdx: 1, amount: 300, row: 2 });

		// Reset cursor selection
		await animationFrame(page);
		await clickFirstCell(page, false);
		await snapshot(page);
	});
});
