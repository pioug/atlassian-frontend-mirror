// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, editorConfluencePerformanceTestCase as test } from '@af/editor-libra';

import { bigTable } from '../fixtures';

test.describe('@confluence-live-page__input-latency', () => {
	test.describe('Editor Live Page - Performance', () => {
		test.describe('full-page__with-big-table', () => {
			test.use({
				adf: bigTable,
				isLivePage: true,
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
				await editor.page.pause();
				expect(true).toBe(true);
			});
		});
	});
});
