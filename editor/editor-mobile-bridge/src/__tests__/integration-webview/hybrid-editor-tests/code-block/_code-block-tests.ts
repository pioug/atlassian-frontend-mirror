import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditor,
  isCodeBlockAdded,
} from '../../_page-objects/hybrid-editor-page';
import { callNativeBridge } from '../../../integration/_utils';
import { INSERT_BLOCK_TYPE } from '../../_utils/bridge-methods';
import { CODE_BLOCK_NODE } from '../../_utils/test-data';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/lib/appium/keyboard/common-osk';

export default async () => {
  MobileTestCase(
    'Code Block: Users can insert a code block via the bridge',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await callNativeBridge(page, INSERT_BLOCK_TYPE, CODE_BLOCK_NODE);
      const codeBlockText = 'Code';
      await page.tapKeys(codeBlockText);

      await page.switchToWeb();
      expect(await isCodeBlockAdded(page, codeBlockText)).toBe(true);
    },
  );

  MobileTestCase(
    'Code Block: Users can create a new line in the middle of an existing line',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await callNativeBridge(page, INSERT_BLOCK_TYPE, CODE_BLOCK_NODE);

      const selection = {
        selection: { type: 'text', anchor: 8, head: 8 },
        rect: { top: 0, left: 0 },
      };
      const codeBlockText = 'Code A';

      await page.tapKeys(codeBlockText);
      await callNativeBridge(page, 'setSelection', JSON.stringify(selection));
      await page.tapKeys(SPECIAL_KEYS.ENTER);

      await page.switchToWeb();
      expect(await isCodeBlockAdded(page, 'Code \nA'));
    },
  );
};
