import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  editable,
  getDocFromElement,
  fullpage,
} from '../../../../__tests__/integration/_helpers';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';

const copyButtonSelector = 'button[aria-label="Copy"]';

export async function _getCopyButtonTestSuite({
  nodeName,
  editorOptions,
  nodeSelector,
}: {
  nodeName: string;
  editorOptions: any;
  nodeSelector: string;
}) {
  describe(`Floating toolbar copy button: [${nodeName}]: `, () => {
    BrowserTestCase(
      'Copy block with floating toolbar copy button',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await goToEditorTestingWDExample(client);
        await mountEditor(page, {
          appearance: fullpage.appearance,
          featureFlags: {
            floatingToolbarCopyButton: true,
          },
          ...editorOptions,
        });

        // Put curosr into the panel
        await page.click(nodeSelector);

        // Wait for floating toolbar to render
        await page.waitForSelector(copyButtonSelector);

        // Click the Copy button
        await page.click(copyButtonSelector);

        // Move to end of document
        await page.keys([
          'ArrowDown',
          'ArrowDown',
          'ArrowDown',
          'ArrowDown',
          'ArrowDown',
          'ArrowDown',
          'ArrowDown',
          'ArrowDown',
        ]);

        // Paste
        await page.paste();

        const doc = await page.$eval(editable, getDocFromElement);
        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );
  });
}
