// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, editorConfluencePerformanceTestCase as test } from '@af/editor-libra';

import { bigTable } from '../fixtures';

test.describe('@direct-productfabric__input-latency', () => {
	test.describe('Editor - Performance', () => {
		test.describe('full-page__with-big-table', () => {
			test.use({
				adf: bigTable,
			});

			test('typing', async ({ editor }) => {
				await Promise.allSettled([
					editor.keyboard.type('vvcccckddfnektkhdevnkkdvdhhgtnnlteutdhtknick', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfnevlucnkfjcufdreciuetvjchbrkgrdgeu', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfneljrnuugtdkcjtgneufngdfreibucniik', {
						delay: 0,
					}),
				]);

				expect(true).toBe(true);
			});
		});
	});
});
