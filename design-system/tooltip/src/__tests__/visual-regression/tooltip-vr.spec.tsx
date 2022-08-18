import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';

const examples = '#examples';
const tooltipBtn = 'button';
const addBtn = '[data-testid="add"]';

describe('@atlaskit/tooltip', () => {
  it('should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tooltip',
      'default-tooltip',
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

  it('should allow a custom tooltip', async () => {
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

  it('should work with render props', async () => {
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

  it('should dynamically position with mouse positioning', async () => {
    const url = getExampleUrl(
      'design-system',
      'tooltip',
      'position',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.goto(url);
    await page.waitForSelector(examples);
    await page.hover('[data-testid="position--container"]');

    await waitForTooltip(page);

    const image = await takeElementScreenShot(page, '[data-testid="position"]');
    expect(image).toMatchProdImageSnapshot();
  });
});
