import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditor,
  isTableAdded as isTableHeaderTextAdded,
} from '../../_page-objects/hybrid-editor-page';
import { callNativeBridge } from '../../../integration/_utils';
import { INSERT_BLOCK_TYPE } from '../../_utils/bridge-methods';
import { TABLE_NODE } from '../../_utils/test-data';
import { mobileSnapshot } from '../../_utils/snapshot';

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

  MobileTestCase(
    'Table: inserting text in table header will not affect the width of column',
    {},
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await callNativeBridge(page, INSERT_BLOCK_TYPE, TABLE_NODE);
      const longTextTest =
        "Extremely long title to place in header of cell, which shouldn't adjust width";
      await page.tapKeys(longTextTest);

      await mobileSnapshot(page);
    },
  );
};
