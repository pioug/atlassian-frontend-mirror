import { expect, editorPerformanceTestCase as test } from '@af/editor-libra';

import { bigTable } from '../fixtures';

test.use({
	editorProps: {
		appearance: 'full-page',
		allowTables: {
			advanced: true,
		},
		allowAnalyticsGASV3: true,
	},
	adf: bigTable,
});

test.describe('@composable-full-page__operational-events', () => {
	test.describe('full-page__with-big-table', () => {
		test.use({
			editorPerformanceTestOptions: {
				editorVersion: 'composable',
				performanceTestType: 'operational-events',
			},
		});
		test('load and process events within page example', async ({ editor }) => {
			expect(true).toBe(true);
		});
	});
});

test.describe('@confluence-full-page__operational-events', () => {
	test.describe('full-page__with-big-table', () => {
		test.use({
			editorPerformanceTestOptions: {
				editorVersion: 'complex-full-page-example',
				performanceTestType: 'operational-events',
			},
		});
		test('load and process events within page example', async ({ editor }) => {
			expect(true).toBe(true);
		});
	});
});
