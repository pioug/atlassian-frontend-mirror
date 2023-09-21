import { expect, test } from '@af/integration-testing';

test.describe('scrollJustEnoughIntoView', () => {
  const containerSelector = '[data-testid="container"]';
  const secondCardSelector = `[data-testid="card-1"]`;

  test('should scroll the element into full view', async ({ page }) => {
    await page.visitExample(
      'pragmatic-drag-and-drop',
      'core',
      'scroll-just-enough-into-view',
    );

    const scrollContainer = page.locator(containerSelector);
    const initialScrollTop = await scrollContainer.evaluate(
      element => element.scrollTop,
    );
    expect(initialScrollTop).toBe(0);

    /**
     * The second card begins partially obscured.
     *
     * The drag is not meant to move anything,
     * it is just to trigger the scroll into view behavior.
     */
    const secondCard = page.locator(secondCardSelector);
    await secondCard.dispatchEvent('dragstart');
    await secondCard.dispatchEvent('drop');

    /**
     * After the drag the container should have scrolled.
     */
    const finalScrollTop = await scrollContainer.evaluate(
      element => element.scrollTop,
    );
    expect(finalScrollTop).toBe(24);
  });

  test('should not scroll if the element is already in full view', async ({
    page,
  }) => {
    await page.visitExample(
      'pragmatic-drag-and-drop',
      'core',
      'scroll-just-enough-into-view',
    );

    /**
     * Begin by scrolling the second card fully into view.
     */
    const secondCard = page.locator(secondCardSelector);
    await secondCard.evaluate(element => {
      element.scrollIntoView({ block: 'nearest' });
    });

    const scrollContainer = page.locator(containerSelector);
    const initialScrollTop = await scrollContainer.evaluate(
      element => element.scrollTop,
    );
    expect(initialScrollTop).toBe(24);

    /**
     * This drag is not meant to move anything,
     * it is just to trigger the scroll into view behavior.
     */
    await secondCard.dispatchEvent('dragstart');
    await secondCard.dispatchEvent('drop');

    const finalScrollTop = await scrollContainer.evaluate(
      element => element.scrollTop,
    );
    expect(finalScrollTop).toBe(24);
  });
});
