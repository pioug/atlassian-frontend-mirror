import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Default usage should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-edit',
      'basic-usage',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('#inlineEdit-uid1-label');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Default inline-edit in editing should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-edit',
      'basic-usage',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('[data-testid="read-view"]');
    await page.click('[data-testid="read-view"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Textarea usage should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-edit',
      'textarea-usage',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('#inlineEdit-uid1-label');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Select usage should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-edit',
      'select-usage',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('#inlineEdit-uid1-label');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('InlineEditableTextField - no action buttons should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-edit',
      'no-action-buttons',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('[data-testid="read-view-editable-text-field"]');
    await page.click('[data-testid="read-view-editable-text-field"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('InlineEditableTextField - start with edit should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-edit',
      'start-with-edit',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('[data-testid="editable-text-field"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('InlineEditableTextField - mandatory field should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-edit',
      'mandatory-field',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('[data-testid="read-view-editable-text-field"]');
    await page.click('[data-testid="read-view-editable-text-field"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('InlineEditableTextField - compact should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-edit',
      'compact',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('[data-testid="read-view-editable-text-field"]');
    await page.click('[data-testid="read-view-editable-text-field"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Validation - should show error message when input is invalid', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-edit',
      'validation',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('[data-testid="clear-button"]');
    await page.click('[data-testid="clear-button"]');

    await page.waitForSelector('[data-testid="read-view"]');
    await page.click('[data-testid="read-view"]');

    await page.focus('input[name="inlineEdit"]');
    await page.$eval('input[name="inlineEdit"]', e =>
      (e as HTMLElement).blur(),
    );

    await page.waitFor(1000);

    await page.waitForSelector('span[aria-label="error"]');
    await page.waitForSelector('#error-message');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
