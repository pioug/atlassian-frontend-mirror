import {
  getExampleUrl,
  loadPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';

const examples = '#examples';
const tooltipBtn = 'button';
const addBtn = '[data-testid="add"]';

describe('Snapshot Test', () => {
  it('Tooltip should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tooltip',
      'defaultTooltip',
      global.__BASEURL__,
    );
    const { page } = global;
    // Reduce viewport to estimated size of element to increase `failureThreshold` accuracy.
    await page.setViewport({ width: 130, height: 65 });
    await loadPage(page, url);
    await page.waitForSelector(examples);
    await page.waitForSelector(tooltipBtn);
    await page.click(tooltipBtn);
    await page.waitForSelector('.atlaskit-portal > .Tooltip');
    // The tooltip is visible after 300 ms
    await page.waitForTimeout(400);
    await page.setViewport({ width: 150, height: 100 });
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Custom tooltip should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tooltip',
      'component-prop',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.goto(url);
    await page.waitForSelector(examples);
    await page.waitForSelector(tooltipBtn);
    await page.setViewport({ width: 150, height: 100 });

    await page.hover(tooltipBtn);

    await waitForTooltip(page);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Accessible tooltip should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tooltip',
      'render-props',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.goto(url);
    await page.waitForSelector(examples);
    await page.waitForSelector(addBtn);
    await page.setViewport({ width: 200, height: 100 });

    await page.hover(addBtn);

    await waitForTooltip(page);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
