import type {
  Browser,
  DynamicBrowserTestSuite,
  DynamicBrowserTestSuiteOptions,
} from '@atlaskit/webdriver-runner/runner';
import {
  getDynamicBrowserTestCase,
  BrowserTestCase,
} from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  getDocFromElement,
  fullpage,
  animationFrame,
} from '@atlaskit/editor-test-helpers/integration/helpers';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';

const copyButtonSelector = 'button[aria-label="Copy"]';

type TestName = 'Copy block with floating toolbar copy button';

interface CopyButtonTestSuiteOptions
  extends DynamicBrowserTestSuiteOptions<TestName> {
  nodeName: string;
  editorOptions: any;
  nodeSelector: string;
  customBeforeEach?: (page: WebDriverPage) => Promise<void>;
  skipTests?: { [key in TestName]?: Browser[] };
}

/**
 * Tests using this function may fail locally when run yarn test:webdriver , when chrome is on version 111
 * Please see why here: https://hello.atlassian.net/wiki/spaces/~584690366/pages/2508624906/ED-16975
 *
 * Tests using this function may also fail locally when run yarn test:webdriver:watch:chrome , when chrome is on version 111
 * Because Copied URL failed to be resolved into smart link again.
 * It was because we use ClipboardApi to write the copied smart link (html node), (code reference: packages/editor/editor-core/src/utils/clipboard.ts)
 * and ClipboardApi in Chrome (version 111)converted the host name of the ‘href’ attribute of the html node into all lower case
 * For example: from <a href="https://inlineCardTestUrl/longName">some text</a> to <a href="https://inlinecardtesturl/longName">some text</a>
 */
export const _getCopyButtonTestSuite: DynamicBrowserTestSuite<
  TestName,
  CopyButtonTestSuiteOptions
> = async ({
  nodeName,
  editorOptions,
  nodeSelector,
  customBeforeEach,
  skipTests = {},
}) => {
  const DynamicBrowserTestCase = getDynamicBrowserTestCase<TestName>({
    TestCase: BrowserTestCase,
    skipTests,
  });

  describe(`Floating toolbar copy button: [${nodeName}]: `, () => {
    DynamicBrowserTestCase(
      'Copy block with floating toolbar copy button',
      {},
      async (client: any, testName: string) => {
        const page = await goToEditorTestingWDExample(client);
        await mountEditor(page, {
          appearance: fullpage.appearance,
          ...editorOptions,
        });

        if (customBeforeEach) {
          await customBeforeEach(page);
        }

        // Put cursor into the panel
        await page.click(nodeSelector);

        // Wait for floating toolbar to render
        await page.waitForSelector(copyButtonSelector);
        await animationFrame(page);

        // Click the Copy button
        await page.isClickable(copyButtonSelector);
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
        await page.waitUntil(
          async () => !!(await page.$(`${nodeSelector}:nth-of-type(2)`)),
        );

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

        if (nodeName === 'Media') {
          //remove random mediaTraceIds
          doc.content[1].content[0].attrs.__mediaTraceId = 'test-trace-id';
        }

        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );
  });
};
