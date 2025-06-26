/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import type { ComponentsLogEntry } from '../../src/common/vc/types';

import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: class attribute mutation', () => {
	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				examplePage: 'class-attribute-mutation',
				viewport,
			});

			test(`VC90 should match when the [content-div] class changed`, async ({
				page,
				waitForReactUFOPayload,
				getSectionAttributeNthChange,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const contentDiv = page.locator('[data-testid="content-div"]');

				await expect(mainDiv).toBeVisible();
				await expect(contentDiv).toBeVisible();

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				// get window.__vcNext from the page
				const vcNext = await page.evaluate(() => {
					return window.__vcNext;
				});

				const contentDivClassChangeAt = await getSectionAttributeNthChange('content-div', 0);

				const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoRevisions).toBeDefined();

				const fy25_02_rev = ufoRevisions?.find((r) => r.revision === 'fy25.02');
				expect(fy25_02_rev).toBeDefined();
				expect(fy25_02_rev!.clean).toEqual(true);

				for (const checkpoint of ['25', '50', '75', '80', '85', '90', '95', '98', '99']) {
					await test.step(`checking fy25_02_rev vc ${checkpoint} details`, () => {
						expect(fy25_02_rev!.vcDetails![checkpoint].t).toMatchTimestamp(contentDivClassChangeAt);
						expect(fy25_02_rev!.vcDetails![checkpoint].e).toContain('div[testid=content-div]');
					});
				}

				const vc90Result = fy25_02_rev!['metric:vc90'];
				expect(vc90Result).toBeDefined();

				expect(vc90Result).toMatchTimestamp(contentDivClassChangeAt);

				await test.step('checking window.__vcNext for DevTool integration', () => {
					expect(vcNext).toBeDefined();
					const roundedContentDivClassChangeAt = Math.round(contentDivClassChangeAt!);

					let contentDivClassChangeLog: ComponentsLogEntry;
					contentDivClassChangeLog = undefined as unknown as ComponentsLogEntry;
					for (const [key, value] of Object.entries(vcNext!.log)) {
						const logTime = parseInt(key, 10);
						// eslint-disable-next-line playwright/no-conditional-in-test
						if (Math.abs(logTime - roundedContentDivClassChangeAt) <= 1) {
							for (const log of value) {
								// eslint-disable-next-line playwright/no-conditional-in-test
								if (log.targetName === 'div[testid=content-div]' && log.type === 'attr') {
									contentDivClassChangeLog = log;
									break;
								}
							}
							// eslint-disable-next-line playwright/no-conditional-in-test
							if (contentDivClassChangeLog) {
								break;
							}
						}
					}

					expect(contentDivClassChangeLog).toBeDefined();
					expect(contentDivClassChangeLog!.type).toEqual('attr');
					expect(contentDivClassChangeLog!.targetName).toEqual('div[testid=content-div]');
					expect(contentDivClassChangeLog!.attributeName).toEqual('class');

					expect(contentDivClassChangeLog!.oldValue).toContain('main_a');
					expect(contentDivClassChangeLog!.oldValue).not.toContain('main_b');

					expect(contentDivClassChangeLog!.newValue).toContain('main_b');
					expect(contentDivClassChangeLog!.newValue).not.toContain('main_a');
				});

				//check future bigger revisions
				const applicableRevisions = ufoRevisions?.filter((rev) => rev['revision'] >= 'fy25.03');

				for (const rev of applicableRevisions!) {
					const vc90Result = rev['metric:vc90'];
					const revisionName = rev['revision'];
					expect(vc90Result).toBeDefined();
					expect(rev!.clean).toEqual(true);

					await test.step(`checking revision ${revisionName}`, async () => {
						expect(vc90Result).toMatchTimestamp(contentDivClassChangeAt);

						for (const checkpoint of ['25', '50', '75', '80', '85', '90', '95', '98', '99']) {
							await test.step(`checking revision ${revisionName} vc ${checkpoint} details`, () => {
								expect(rev!.vcDetails![checkpoint].t).toMatchTimestamp(contentDivClassChangeAt);
								expect(rev!.vcDetails![checkpoint].e).toContain('div[data-testid="content-div"]');
							});
						}
					});
				}
			});

			test('should capture and report a11y violations', async ({
				page,
				waitForReactUFOPayload,
				getSectionAttributeNthChange,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				await expect(mainDiv).toBeVisible();

				await expect(page).toBeAccessible();
			});
		});
	}
});
