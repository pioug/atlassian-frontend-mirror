import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditor,
  isCodeBlockAdded,
} from '../../_page-objects/hybrid-editor-page';
import { callNativeBridge } from '../../../integration/_utils';
import { INSERT_BLOCK_TYPE } from '../../_utils/bridge-methods';
import { CODE_BLOCK_NODE } from '../../_utils/test-data';

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

      expect(await isCodeBlockAdded(page, codeBlockText)).toBe(true);
    },
  );
};
