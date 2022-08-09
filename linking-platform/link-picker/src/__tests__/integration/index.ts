import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  isElementCompletelyVisible,
  testIdsToSelectors,
} from '../__helpers/webdriver-helpers';
import { testIds as _testIds } from '../../ui/link-picker';

/* Url to test the example */
function getURL(testName: string): string {
  return getExampleUrl(
    'linking-platform',
    'link-picker',
    testName,
    global.__BASEURL__,
  );
}

const testIds = testIdsToSelectors(_testIds);

BrowserTestCase(
  'Link picker should be able to be edit link and title without plugins',
  {},
  async (client: any) => {
    const page = new Page(client);
    const exampleUrl = getURL('without-plugins');

    await page.goto(exampleUrl);
    await page.waitFor(testIds.linkPicker);

    await page.type(testIds.urlInputField, 'https://google.com');
    await page.type(testIds.textInputField, 'Inserted');
    await page.click(testIds.insertButton);

    await page.click('a');
    await page.click(testIds.clearUrlButton);
    await page.type(testIds.urlInputField, 'https://atlassian.com');
    await page.type(testIds.textInputField, 'Edited');
    await page.click(testIds.insertButton);

    expect(await page.isExisting(testIds.linkPicker)).toBe(false);
    expect(await page.getHTML('a')).toMatch('Edited');
    expect(await page.getProperty('a', 'href')).toMatch(
      'https://atlassian.com',
    );
  },
);

BrowserTestCase(
  'Link picker should be able to edit link and title from search results',
  {},
  async (client: any) => {
    const page = new Page(client);
    const exampleUrl = getURL('with-plugins');
    await page.goto(exampleUrl);
    await page.waitFor(testIds.linkPicker);

    await page.type(testIds.urlInputField, 'https://google.com');
    await page.type(testIds.textInputField, 'Inserted');
    await page.click(testIds.insertButton);

    await page.click('a');
    await page.waitFor(testIds.linkPicker);
    await page.click(testIds.clearUrlButton);
    await page.click(testIds.urlInputField);
    await page.keys('ArrowDown');

    const selected = await page.getValue(testIds.urlInputField);
    await page.type(testIds.textInputField, 'Edited');
    await page.click(testIds.insertButton);

    expect(await page.isExisting(testIds.linkPicker)).toBe(false);
    expect(await page.getHTML('a')).toMatch('Edited');
    expect(await page.getProperty('a', 'href')).toMatch(selected);
    expect(await page.getProperty('a', 'href')).not.toMatch(
      'https://google.com/',
    );
  },
);

BrowserTestCase(
  'Link picker should fire `onContentResize` callback to allow dialogue components to handle content resize and positioning',
  {},
  async (client: any) => {
    const page = new Page(client);
    const exampleUrl = getURL('test-content-resize');
    const trigger = '[data-testid="trigger"]';
    const updateFnToggle = '[data-testid="provide-updateFn-toggle"]';

    await page.goto(exampleUrl);
    await page.waitFor(trigger);

    /**
     * Without providing update method
     */

    // Open popup
    await page.click(trigger);
    await page.waitFor(testIds.linkPicker);

    // Entirely visible when mounted
    expect(await isElementCompletelyVisible(page, testIds.linkPicker)).toBe(
      true,
    );

    // Entirely visible while loading results
    await page.type(testIds.urlInputField, '12345');
    await page.waitForVisible(testIds.searchResultLoadingIndicator);
    expect(await isElementCompletelyVisible(page, testIds.linkPicker)).toBe(
      true,
    );

    // NOT Entirely visible once all results loaded
    await page.waitForInvisible(testIds.searchResultLoadingIndicator);
    expect(await isElementCompletelyVisible(page, testIds.linkPicker)).toBe(
      false,
    );

    /**
     * Provide update method
     */

    // Enable provision of `update` fn from popup
    await page.click(updateFnToggle);

    // Open popup
    await page.click(trigger);
    await page.waitFor(testIds.linkPicker);

    // Entirely visible when mounted
    expect(await isElementCompletelyVisible(page, testIds.linkPicker)).toBe(
      true,
    );

    // Entirely visible while loading results
    await page.type(testIds.urlInputField, '12345');
    await page.waitForVisible(testIds.searchResultLoadingIndicator);
    expect(await isElementCompletelyVisible(page, testIds.linkPicker)).toBe(
      true,
    );

    // Entirely visible once all results loaded
    await page.waitForInvisible(testIds.searchResultLoadingIndicator);
    expect(await isElementCompletelyVisible(page, testIds.linkPicker)).toBe(
      true,
    );
  },
);
