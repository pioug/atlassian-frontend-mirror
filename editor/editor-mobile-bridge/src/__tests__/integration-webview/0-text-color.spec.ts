import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { getTextColor } from './_utils/afe-app-helpers';
import { callNativeBridge } from '../integration/_utils';
import { loadEditor } from './_page-objects/hybrid-editor-page';
import { SET_TEXT_COLOR } from './_utils/bridge-methods';
import { GREEN_RGB_CODE, GREEN_HEX_CODE } from './_utils/test-data';

/**
 *  This test runs on a Samsung device which isn't a default device.
 *
 *  A limitation with the single index test file pattern is that non-default
 *  devices aren't available after the initial setup.
 *
 *  As a workaround, this standalone tests bypasses this limitation.
 *
 *  https://product-fabric.atlassian.net/browse/ED-12725 will work to remove
 *  the need for a standalone test.
 */
MobileTestCase(
  'Color: User can choose text color',
  { keyboards: ['apple', 'samsung'] },
  async (client) => {
    const page = await Page.create(client);
    await loadEditor(page);
    await callNativeBridge(page, SET_TEXT_COLOR, GREEN_HEX_CODE);
    await page.tapKeys('Green');
    expect(await getTextColor(page)).toBe(GREEN_RGB_CODE);
  },
);
