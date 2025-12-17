import type { Page } from '@af/integration-testing';
import { rendererTestCase as test, expect, type RendererPageInterface } from './not-libra';

import {
	basicTableAdf,
	nestedTablesInHeaderAndCellAdf,
} from './table-width-analytics.spec.ts-fixtures';

test.describe('table height information analytics', () => {
	const waitForTableHeightInformationEvent = async (
		renderer: RendererPageInterface,
		page: Page,
	) => {
		await renderer.waitForRendererStable();

		await page.waitForFunction(
			() => {
				const events = (window as any).__analytics?.events || [];
				return events.some((event: any) => event.action === 'tableRendererHeightInformation');
			},
			{ timeout: 10100 },
		);
	};

	test.use({
		rendererProps: {
			appearance: 'full-page',
		},
		platformFeatureFlags: {
			platform_editor_table_height_analytics_event: true,
		},
	});

	test.describe('for a normal table', () => {
		test.use({
			adf: basicTableAdf,
		});

		test('should send correct payload', async ({ renderer, page }) => {
			await waitForTableHeightInformationEvent(renderer, page);

			const events = await renderer.getAnalyticsEvents();
			expect(events).toContainEqual(
				expect.objectContaining({
					action: 'tableRendererHeightInformation',
					actionSubject: 'table',
					attributes: expect.objectContaining({
						rendererHeight: 114,
						maxTableHeight: 89,
						tableHeightInfo: [
							expect.objectContaining({
								isNestedTable: false,
								tableHeight: 89,
							}),
						],
						viewportHeight: 720,
						maxTableToViewportHeightRatio: expect.closeTo(0.12, 2),
					}),
				}),
			);
			await expect(page).toBeAccessible();
		});
	});

	test.describe('for a nested table', () => {
		test.use({
			adf: nestedTablesInHeaderAndCellAdf,
		});

		test('should send correct payload', async ({ renderer, page }) => {
			await waitForTableHeightInformationEvent(renderer, page);

			const events = await renderer.getAnalyticsEvents();
			expect(events).toContainEqual(
				expect.objectContaining({
					action: 'tableRendererHeightInformation',
					actionSubject: 'table',
					attributes: expect.objectContaining({
						rendererHeight: 329,
						maxTableHeight: 305,
						tableHeightInfo: [
							expect.objectContaining({
								isNestedTable: false,
								tableHeight: 305,
							}),
							expect.objectContaining({
								isNestedTable: true,
								tableHeight: 89,
							}),
							expect.objectContaining({
								isNestedTable: true,
								tableHeight: 45,
							}),
						],
						viewportHeight: 720,
						maxTableToViewportHeightRatio: expect.closeTo(0.42, 2),
					}),
				}),
			);
			await expect(page).toBeAccessible();
		});
	});
});
