import { Browser, BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';

import {
  editable,
  getDocFromElement,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';

const copyButtonSelector = 'button[aria-label="Copy"]';

export async function _getCopyButtonTestSuite({
  nodeName,
  editorOptions,
  nodeSelector,
  customBeforeEach,
  skip,
}: {
  nodeName: string;
  editorOptions: any;
  nodeSelector: string;
  customBeforeEach?: (page: WebDriverPage) => Promise<void>;
  skip?: Browser[] | undefined;
}) {
  describe(`Floating toolbar copy button: [${nodeName}]: `, () => {
    BrowserTestCase(
      'Copy block with floating toolbar copy button',
      { skip },
      async (client: any, testName: string) => {
        const page = await goToEditorTestingWDExample(client);
        await mountEditor(page, {
          appearance: fullpage.appearance,
          featureFlags: {
            floatingToolbarCopyButton: true,
          },
          ...editorOptions,
        });

        if (customBeforeEach) {
          await customBeforeEach(page);
        }

        // Put cursor into the panel
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

        if (nodeName === 'Block card') {
          // workaround for url = null in fixture
          doc.content[2].attrs.url = null;
        }

        if (nodeName === 'Extension') {
          // remove random localIds
          doc.content[2].content[0].attrs.localId = 'testId';
          doc.content[3].attrs.localId = 'testId';
          doc.content[3].content[0].attrs.localId = 'testId';
        }

        if (nodeName === 'Embed card') {
          // workaround for flakey height detection
          doc.content[2].attrs.originalHeight = null;
        }

        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );
  });
}
