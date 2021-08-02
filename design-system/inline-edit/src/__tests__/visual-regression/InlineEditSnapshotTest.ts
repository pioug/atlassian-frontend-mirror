import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const clearBtn = '[data-testid="clear-button"]';

const inlineEdit = 'input[name="inlineEdit"]';
const inlineEditLabel = 'label';

const inlineEditSelect = '[data-read-view-fit-container-width="false"]';
const inlineEditSelectApple = '[tabIndex="-1"]';

const readView = '[data-testid="read-view"]';
const readViewEditableTextField =
  '[data-testid="read-view-editable-text-field"]';

const error = 'span[aria-label="error"]';
const errorMessage = '#error-message';

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
    await page.waitForSelector(inlineEditLabel);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '0.03',
      failureThresholdType: 'percent',
    });
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
    await page.waitForSelector(readView);
    await page.click(readView);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '0.03',
      failureThresholdType: 'percent',
    });
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
    await page.waitForSelector(inlineEditLabel);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '0.03',
      failureThresholdType: 'percent',
    });
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
    await page.waitForSelector(inlineEditLabel);
    await page.waitForSelector(inlineEditSelect);
    await page.click(inlineEditSelect);

    await page.waitForSelector(inlineEditSelectApple);
    await page.click(inlineEditSelectApple);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '0.03',
      failureThresholdType: 'percent',
    });
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

    await page.waitForSelector(readViewEditableTextField);
    await page.click(readViewEditableTextField);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '0.03',
      failureThresholdType: 'percent',
    });
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
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '0.03',
      failureThresholdType: 'percent',
    });
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

    await page.waitForSelector(readViewEditableTextField);
    await page.click(readViewEditableTextField);

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

    await page.waitForSelector(readViewEditableTextField);
    await page.click(readViewEditableTextField);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '0.03',
      failureThresholdType: 'percent',
    });
  });

  // TODO: DSP-1663 fix flakey VR
  it.skip('Validation - should show error message when input is invalid', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-edit',
      'validation',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(clearBtn);
    await page.click(clearBtn);

    await page.waitForSelector(readView);
    await page.click(readView);

    await page.focus(inlineEdit);
    await page.type(inlineEdit, 'short');
    await page.waitForTimeout(500);

    await page.$eval(inlineEdit, (e) => (e as HTMLElement).blur());

    await page.waitForTimeout(1000);

    await page.waitForSelector(error);
    await page.waitForSelector(errorMessage);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('The edit button should have focus after edit is confirmed by pressing Enter', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-edit',
      'basic-usage',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(readView);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForSelector(inlineEdit);
    await page.keyboard.press('Enter');
    await page.waitForSelector(readView);
    await page.waitForTimeout(500);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
