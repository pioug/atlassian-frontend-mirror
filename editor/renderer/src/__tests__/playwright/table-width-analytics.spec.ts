import type { Page } from '@af/integration-testing';
import { rendererTestCase as test, expect, type RendererPageInterface } from './not-libra';

import {
	basicTableAdf,
	nestedTablesInHeaderAndCellAdf,
	noTablesAdf,
	tableWithScrollbarAdf,
} from './table-width-analytics.spec.ts-fixtures';

test.describe('table width information analytics', () => {
	const waitForTableWidthInformationEvent = async (renderer: RendererPageInterface, page: Page) => {
		await renderer.waitForRendererStable();

		await page.waitForFunction(
			() => {
				const events = (window as any).__analytics?.events || [];
				return events.some((event: any) => event.action === 'tableWidthInformation');
			},
			{ timeout: 10100 },
		);
	};

	test.use({
		rendererProps: {
			appearance: 'full-page',
		},
		platformFeatureFlags: {
			platform_editor_editor_width_analytics: true,
		},
	});

	test.describe('for a normal table', () => {
		test.use({
			adf: basicTableAdf,
		});

		test('should send correct payload', async ({ renderer, page }) => {
			await waitForTableWidthInformationEvent(renderer, page);

			const events = await renderer.getAnalyticsEvents();
			expect(events).toContainEqual(
				expect.objectContaining({
					action: 'tableWidthInformation',
					actionSubject: 'table',
					attributes: expect.objectContaining({
						editorWidth: 760,
						mode: 'renderer',
						tableWidthInfo: [
							expect.objectContaining({
								hasScrollbar: false,
								isNestedTable: false,
								tableWidth: 760,
							}),
						],
					}),
				}),
			);
		});
	});

	test.describe('for a nested table', () => {
		test.use({
			adf: nestedTablesInHeaderAndCellAdf,
		});

		test('should send correct payload', async ({ renderer, page }) => {
			await waitForTableWidthInformationEvent(renderer, page);

			const events = await renderer.getAnalyticsEvents();
			expect(events).toContainEqual(
				expect.objectContaining({
					action: 'tableWidthInformation',
					actionSubject: 'table',
					attributes: expect.objectContaining({
						editorWidth: 760,
						mode: 'renderer',
						tableWidthInfo: [
							expect.objectContaining({
								hasScrollbar: false,
								isNestedTable: false,
								tableWidth: 760,
							}),
							expect.objectContaining({
								hasScrollbar: false,
								isNestedTable: true,
								tableWidth: 362,
							}),
							expect.objectContaining({
								hasScrollbar: false,
								isNestedTable: true,
								tableWidth: 362,
							}),
						],
					}),
				}),
			);
		});
	});

	test.describe('for a table with scrollbar', () => {
		test.use({
			adf: tableWithScrollbarAdf,
		});

		test('should send correct payload', async ({ renderer, page }) => {
			await waitForTableWidthInformationEvent(renderer, page);

			const events = await renderer.getAnalyticsEvents();
			expect(events).toContainEqual(
				expect.objectContaining({
					action: 'tableWidthInformation',
					actionSubject: 'table',
					attributes: expect.objectContaining({
						editorWidth: 760,
						mode: 'renderer',
						tableWidthInfo: [
							expect.objectContaining({
								hasScrollbar: true,
								isNestedTable: false,
								tableWidth: 920,
							}),
						],
					}),
				}),
			);
		});
	});

	test.describe('for a document with no tables', () => {
		test.use({
			adf: noTablesAdf,
		});

		test('should send correct payload', async ({ renderer, page }) => {
			await waitForTableWidthInformationEvent(renderer, page);

			const events = await renderer.getAnalyticsEvents();
			expect(events).toContainEqual(
				expect.objectContaining({
					action: 'tableWidthInformation',
					actionSubject: 'table',
					attributes: expect.objectContaining({
						editorWidth: 760,
						mode: 'renderer',
						tableWidthInfo: [],
					}),
				}),
			);
		});
	});
});
