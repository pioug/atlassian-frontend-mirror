import { getExampleUrl } from '@atlaskit/visual-regression/helper';

declare var global: any;

const examples = '#examples';
const tooltipBtn = 'button';

describe('Snapshot Test', () => {
  it('Tooltip should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tooltip',
      'defaultTooltip',
      global.__BASEURL__,
    );
    const { page } = global;
    // Reduce viewport to estimated size of element to increase `failureThreshold` accuracry.
    await page.setViewport({ width: 130, height: 65 });
    await page.goto(url);
    await page.waitForSelector(examples);
    await page.waitForSelector(tooltipBtn);
    await page.click(tooltipBtn);
    await page.waitForSelector('.atlaskit-portal > .Tooltip');
    // The tooltip is visible after 300 ms
    await page.waitFor(500);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
