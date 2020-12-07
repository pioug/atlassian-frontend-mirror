import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Basic usage example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'radio',
      'radioDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[name="color"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it(`Hover example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'radio',
      'radioDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[name="color"]');
    await page.hover('input[name="color"][value="red"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it(`Checked example while hovering and focusing should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'radio',
      'radioDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[name="color"]');
    await page.click('input[name="color"][value="red"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it(`Checked example while not hovering and focussing should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'radio',
      'radioDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[name="color"]');
    await page.click('input[name="color"][value="red"]');
    // Hover on another checkbox to see the styles of the red button
    // while being focused and not hovered
    await page.hover('input[name="color"][value="blue"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it(`Checked example while hovering and not focusing should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'radio',
      'radioDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[name="color"]');
    await page.click('input[name="color"][value="red"]');
    // Click top corner to lose focus
    await page.mouse.click(0, 0);
    await page.hover('input[name="color"][value="red"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it(`Checked example while not hovering and not focusing should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'radio',
      'radioDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[name="color"]');
    await page.click('input[name="color"][value="red"]');
    // Click top corner to lose focus
    await page.mouse.click(0, 0);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it(`Checked example while mousedown should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'radio',
      'radioDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[name="color"]');

    await page.click('input[name="color"][value="red"]');
    await page.mouse.down();
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it(`Unchecked example while mousedown should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'radio',
      'radioDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[name="color"]');

    // Position of red radio button
    await page.mouse.move(12, 32);
    await page.mouse.down();
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it(`Disabled example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'radio',
      'radioDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[name="color"]');

    // page.click has a bug that can't find checkbox
    // because of it now has appearance: none
    await page.evaluate(() => {
      document
        .querySelector('input[type="checkbox"]')
        ?.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true }),
        );
    });
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it(`Disabled example with a checked value should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'radio',
      'radioDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[name="color"]');

    await page.click('input[name="color"][value="red"]');
    // page.click has a bug that can't find checkbox
    // because of it now has appearance: none
    await page.evaluate(() => {
      document
        .querySelector('input[type="checkbox"]')
        ?.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true }),
        );
    });
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
