import { expect, test } from '@af/integration-testing';

test.describe('flyout menu item', () => {
	test('popper should not repeatedly update', async ({ page }) => {
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

		await page.getByRole('button', { name: 'Recent' }).click();

		expect(await getCallCount()).toBe(1);

		await page.getByRole('button', { name: 'Load items' }).click();

		expect(await getCallCount()).toBe(2);
	});
});
