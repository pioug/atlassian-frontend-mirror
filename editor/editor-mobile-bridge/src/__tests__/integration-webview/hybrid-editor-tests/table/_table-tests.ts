import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditor,
  isTableAdded as isTableHeaderTextAdded,
} from '../../_page-objects/hybrid-editor-page';
import { callNativeBridge } from '../../../integration/_utils';
import { INSERT_BLOCK_TYPE } from '../../_utils/bridge-methods';
import { TABLE_NODE } from '../../_utils/test-data';

export default async () => {
  MobileTestCase(
    'Table: Users can add text to table header',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await callNativeBridge(page, INSERT_BLOCK_TYPE, TABLE_NODE);
      const tableHeaderText = 'Title';
      await page.tapKeys(tableHeaderText);

      expect(await isTableHeaderTextAdded(page, tableHeaderText)).toBe(true);
    },
  );
};
