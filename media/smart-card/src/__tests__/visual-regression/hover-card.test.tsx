import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Hover Card', () => {
  it('renders HoverCard', async () => {
    const url = getURL('vr-hover-cards');
    const page = await setup(url);
    await page.waitForSelector('[data-testid="text-to-hover"]');
    await page.hover('[data-testid="text-to-hover"]');
    await page.waitForSelector('[data-testid="hover-card"]');
    await page.waitForSelector('[data-testid="smart-element-icon-icon"]');

    const image = await takeSnapshot(page, 300);
    expect(image).toMatchProdImageSnapshot();
  });
});
