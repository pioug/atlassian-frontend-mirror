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
    await loadPage(page, url);
    await page.waitForSelector(examples);
    await page.waitForSelector(tooltipBtn);
    await page.setViewport({ width: 150, height: 100 });
    await page.click(tooltipBtn);
    await waitForTooltip(page);
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
