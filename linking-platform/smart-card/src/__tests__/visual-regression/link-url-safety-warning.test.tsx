import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Link Url Safety Warning', () => {
  it('shows warning message if href and link description are different', async () => {
    const url = getURL('vr-link-safety-warning-message');
    const page = await setup(url);
    await page.waitForSelector('[data-testid="link-with-safety"]');
    await page.click('[data-testid="link-with-safety"]');
    await page.waitForSelector(
      '[data-testid="link-with-safety-warning--header"]',
    );

    const image = await takeSnapshot(page, 300, 0);
    expect(image).toMatchProdImageSnapshot();
  });
});
