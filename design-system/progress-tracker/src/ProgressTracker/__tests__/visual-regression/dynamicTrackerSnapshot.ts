import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

// Css-selectors
const next = "[data-testid='button--next']";
const prev = "[data-testid='button--prev']";
const add = "[data-testid='button--add']";
const remove = "[data-testid='button--remove']";
const tracker = "[data-testid='tracker']";

// https://ecosystem.atlassian.net/browse/DS-7006
describe.skip('Snapshot Test for Progress Tracker', () => {
  it('should handle stages being added', async () => {
    //@ts-ignore
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'progress-tracker',
      'dynamic-stages',
      __BASEURL__,
    );

    await loadPage(page, url);
    await page.waitForSelector(next);
    await page.waitForSelector(prev);
    await page.waitForSelector(add);
    await page.waitForSelector(remove);

    page.click(next);
    page.click(add);
    page.click(add);
    page.click(next);

    await page.waitFor(500);
    const image = await takeElementScreenShot(page, tracker);
    //@ts-ignore
    expect(image).toMatchProdImageSnapshot();
  });

  it('should handle stages being removed', async () => {
    //@ts-ignore
    const { __BASEURL__, page } = global;

    const url = getExampleUrl(
      'design-system',
      'progress-tracker',
      'dynamic-stages',
      __BASEURL__,
    );

    await loadPage(page, url);
    await page.waitForSelector(next);
    await page.waitForSelector(prev);
    await page.waitForSelector(add);
    await page.waitForSelector(remove);

    // page loads with three
    page.click(add);
    page.click(add);
    // max five allowed (in the example implementation)
    page.click(remove);
    page.click(remove);
    page.click(remove);

    await page.waitFor(500);
    const image = await takeElementScreenShot(page, tracker);
    //@ts-ignore
    expect(image).toMatchProdImageSnapshot();
  });
});
