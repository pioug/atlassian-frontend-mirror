import {
  disableAllAnimations,
  disableAllTransitions,
  disableScrollBehavior,
  getExampleUrl,
  pageSelector,
  waitForTooltip,
  takeElementScreenShot,
  loadPage,
  LoadPageOptions,
} from '@atlaskit/visual-regression/helper';

import { ffTest } from '@atlassian/feature-flags-test-utils';

export function getURL(testName: string): string {
  return getExampleUrl(
    'linking-platform',
    'link-picker',
    testName,
    global.__BASEURL__,
  );
}

export async function setup(url: string, options: LoadPageOptions = {}) {
  const { page } = global;
  await loadPage(page, url, {
    reloadSameUrl: true,
    ...options,
    allowedSideEffects: {
      tooltips: true,
      ...(options.allowedSideEffects ?? {}),
    },
  });
  await page.waitForSelector(pageSelector);

  // disable animations in TextField
  await disableAllAnimations(page);
  await disableAllTransitions(page);
  await disableScrollBehavior(page);
  return page;
}

describe('link-picker', () => {
  let testSelector: string;

  beforeEach(() => {
    testSelector = '[data-testid="link-picker"]';
  });

  it('should render component with results', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);
    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render component without display text field', async () => {
    const url = getURL('vr-hide-display-text');
    const page = await setup(url);
    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render component without display text field with results', async () => {
    const url = getURL('vr-hide-display-text-with-plugin');
    const page = await setup(url);
    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render component without display text field with plugins', async () => {
    const url = getURL('vr-hide-display-text-with-multiple-plugins');
    const page = await setup(url);
    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render component to edit a link', async () => {
    const url = getURL('vr-edit-link');
    const page = await setup(url);

    await page.waitForSelector(testSelector);

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should change list-item background on hover and selection', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.hover('[data-testid="link-search-list-item"]');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  // FIXME: This test was automatically skipped due to failure on 15/06/2023: https://product-fabric.atlassian.net/browse/EDM-7000
  it('should select the search list via keyboard tab', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should select the search list via keyboard tab and use arrows up/down to navigate', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);

    // Tab twice to reach the search results list
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Press arrow down twice to select first and second items respectively
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    // Press arrow up to get back to the first item
    await page.keyboard.press('ArrowUp');

    // Finally, expects selected item to be the first one on the list
    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should select the search list via keyboard tab and use Home key to select first item', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);

    // Tab twice to reach the search results list
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Press arrow down twice to select first and second items respectively
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    // Press arrow up to get back to the first item
    await page.keyboard.press('Home');

    // Finally, expects selected item to be the first one on the list
    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should select the search list via keyboard tab and use End key to select last item', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);

    // Tab twice to reach the search results list
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Press arrow down once to select first item
    await page.keyboard.press('ArrowDown');

    // Press arrow up to get back to the last item
    await page.keyboard.press('End');

    // Finally, expects selected item to be the last one on the list
    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should not change the background of selected list-item on hover', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);
    await page.keyboard.press('ArrowDown');
    await page.hover('[data-testid="link-search-list-item"]');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should change input background on hover', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);
    await page.hover('[data-testid="link-text-container"]');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should change input border-color on focus', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);
    await page.focus('[data-testid="link-text"]');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should display ClearText button when input has value', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);

    await page.keyboard.type('FAB');
    await page.waitForSelector('[data-testid="clear-text"]');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should display ClearText tooltip on hover', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);

    await page.keyboard.type('FAB');
    await page.hover('[data-testid="clear-text"]');
    await waitForTooltip(page);

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should not display text under ClearText button', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);

    const longText =
      'A text field is an input that allows a user to write or edit text';
    await page.type('[data-testid="link-text"]', longText);

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render Linkpicker within Popup with input focused', async () => {
    const url = getURL('vr-with-popup-integration');
    const page = await setup(url);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render Linkpicker without Plugins', async () => {
    const url = getURL('vr-with-no-plugins');
    const page = await setup(url);

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should display error message and highlight input border for invalid URLs', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);

    await page.type('[data-testid="link-url"]', 'FAB');
    await page.focus('[data-testid="link-text"]');
    await page.keyboard.press('Enter');
    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should display error message and highlight input border for empty URLs', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);

    await page.focus('[data-testid="link-text"]');
    await page.keyboard.press('Enter');
    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should display subtitle with `Results` after search', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);

    await page.type('[data-testid="link-url"]', 'FAB');
    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should error message after search returns no results', async () => {
    const url = getURL('vr-basic');
    const page = await setup(url);

    await page.type('[data-testid="link-url"]', 'FOO', { delay: 50 });
    await page.waitForSelector('[data-testid="link-search-no-results"]');
    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render tabs with multiple plugins', async () => {
    const url = getURL('vr-with-multiple-plugins');
    const page = await setup(url);

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render tabs with multiple plugins and select second tab', async () => {
    const url = getURL('vr-with-multiple-plugins');
    const page = await setup(url);

    await page.click('#link-picker-tabs-1');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render tabs with multiple plugins and click forward arrow to see more tabs', async () => {
    const url = getURL('vr-with-multiple-plugins');
    const page = await setup(url);

    await page.click('[data-test-id="forward"]');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render tabs with multiple plugins and click forward arrow to see more tabs', async () => {
    const url = getURL('vr-with-multiple-plugins');
    const page = await setup(url);

    await page.click('[data-test-id="forward"]');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render tabs with multiple plugins and go forwards and backwards through arrow controls', async () => {
    const url = getURL('vr-with-multiple-plugins');
    const page = await setup(url);

    await page.click('[data-test-id="forward"]');
    await page.waitForSelector('[data-test-id="back"]');
    await page.click('[data-test-id="back"]');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render tabs with multiple plugins and go forwards clicking the forward arrow until the end', async () => {
    const url = getURL('vr-with-multiple-plugins');
    const page = await setup(url);

    await page.click('[data-test-id="forward"]');
    await page.click('[data-test-id="forward"]');
    await page.click('[data-test-id="forward"]');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  // FIXME: This test was automatically skipped due to failure on 21/12/2022: https://product-fabric.atlassian.net/browse/EDM-5337
  it.skip('Should render tabs with multiple plugins and click on overflowing tab', async () => {
    const url = getURL('vr-with-multiple-plugins');
    const page = await setup(url);

    await page.click('#link-picker-tabs-4');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should render tabs with multiple plugins and add more tabs', async () => {
    const url = getURL('vr-with-multiple-plugins');
    const page = await setup(url);

    await page.click('[data-test-id="add-tab"]');

    await page.click('[data-test-id="forward"]');
    await page.click('[data-test-id="forward"]');
    await page.click('[data-test-id="forward"]');
    await page.click('[data-test-id="forward"]');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should provide an error message when an error is caught in the error boundary', async () => {
    const url = getURL('root-error-boundary');
    const page = await setup(url);

    testSelector = '[data-testid="link-picker-root-error-boundary-ui"]';
    await page.waitForSelector(testSelector);
    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should provide an error message when an error is thrown by a plugin', async () => {
    const url = getURL('vr-handle-plugin-error');
    const page = await setup(url);

    await page.click('#link-picker-tabs-1');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should hide footer buttons when user is unauthenticated to active Plugin', async () => {
    const url = getURL('vr-handle-plugin-error');
    const page = await setup(url);

    await page.click('#link-picker-tabs-2');

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should have the same height as the skeleton whether or not the displayText field is shown', async () => {
    const url = getURL('vr-lazy-load-height');
    const page = await setup(url);

    const image = await takeElementScreenShot(
      page,
      '[data-testid="link-picker-lazy-load-height"]',
    );
    expect(image).toMatchProdImageSnapshot();
  });

  it('should display action button when plugin', async () => {
    const url = getURL('vr-with-plugin-action');
    const page = await setup(url);

    const image = await takeElementScreenShot(page, testSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  ffTest(
    'platform.linking-platform.link-picker.enable-empty-state',
    async () => {
      const url = getURL('vr-with-no-results');
      const page = await setup(url);

      const image = await takeElementScreenShot(page, testSelector);
      expect(image).toMatchProdImageSnapshot();
    },
  );

  ffTest(
    'platform.linking-platform.link-picker.enable-empty-state',
    async () => {
      const url = getURL('vr-with-no-results-multi-product');
      const page = await setup(url);

      const image = await takeElementScreenShot(page, testSelector);
      expect(image).toMatchProdImageSnapshot();
    },
  );
});
