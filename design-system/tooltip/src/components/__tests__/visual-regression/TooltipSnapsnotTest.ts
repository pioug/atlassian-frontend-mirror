import { getExampleUrl } from '@atlaskit/visual-regression/helper';

declare var global: any;

const examples = '#examples';
const tooltipBtn = 'button';

describe('Snapshot Test', () => {
  it('Tooltip should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'tooltip',
      'defaultTooltip',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.goto(url);
    await page.waitForSelector(examples);
    await page.waitForSelector(tooltipBtn);
    await page.click(tooltipBtn);
    // The tooltip is visible after 300 ms
    await page.waitFor(1000);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
