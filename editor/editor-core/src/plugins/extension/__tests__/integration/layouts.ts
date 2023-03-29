import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
  insertBlockMenuItem,
  changeSelectedNodeLayout,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';

import commonMessages from '../../../../messages';

[
  commonMessages.layoutFixedWidth,
  commonMessages.layoutWide,
  commonMessages.layoutFullWidth,
].forEach((layoutMessages) => {
  const layoutName = layoutMessages.id.split('.').pop();
  // FIXME: This test was automatically skipped due to failure on 28/03/2023: https://product-fabric.atlassian.net/browse/ED-17325
  BrowserTestCase(
    `layouts.ts: Extension: ${layoutName} layout`,
    {
      skip: ['*'],
    },
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(page, {
        appearance: 'full-page',
        allowExtension: {
          allowBreakout: true,
        },
      });

      await insertBlockMenuItem(page, 'Block macro (EH)');
      await changeSelectedNodeLayout(page, layoutMessages.defaultMessage);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
