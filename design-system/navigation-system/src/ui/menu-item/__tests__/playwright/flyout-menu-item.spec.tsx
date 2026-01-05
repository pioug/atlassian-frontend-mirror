import { expect, test } from '@af/integration-testing';

test.describe('flyout menu item', () => {
	test('popper should not repeatedly update', async ({ page, skipAxeCheck }) => {
		skipAxeCheck();

		await page.visitExample('design-system', 'navigation-system', 'flyout-menu-item-async-content');

		const callCountRef = await page.evaluateHandle(() => {
			const callCountRef = { current: 0 };

			class ResizeObserverSpy extends ResizeObserver {
				constructor(callback: ResizeObserverCallback) {
					const spyCallback: ResizeObserverCallback = (...args) => {
						callCountRef.current += 1;
						callback(...args);
					};

					super(spyCallback);
				}
			}

			window.ResizeObserver = ResizeObserverSpy;

			return callCountRef;
		});

		async function getCallCount() {
			return callCountRef.evaluate((ref) => ref.current);
		}

		await page.getByRole('button', { name: 'Recent' }).hover();
		await page.getByRole('button', { name: 'Recent' }).click();
		await expect(page.getByRole('button', { name: 'Load items' })).toBeVisible();

		// Using clock API doesn't trigger the render loop, so using a small real wait instead
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(200);
		// Sometimes there is a double render, but that's okay as long as there's no loop
		expect(await getCallCount()).toBeLessThanOrEqual(2);

		// Loading the items changes the size of the flyout menu item content, so the resize observer should be called again.
		await page.getByRole('button', { name: 'Load items' }).click();
		await expect(page.getByRole('button', { name: 'Load items' })).toBeHidden();

		// Using clock API doesn't trigger the render loop, so using a small real wait instead
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(200);
		// Sometimes there is a double render, but that's okay as long as there's no loop
		expect(await getCallCount()).toBeLessThanOrEqual(4);
	});
});
