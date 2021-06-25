import WebdriverPage from '@atlaskit/webdriver-runner/wd-wrapper';
import { documentWithDecision } from './__fixtures__/document-with-decision';
import { documentWithInlineCard } from './__fixtures__/document-with-inline-card';
import { documentWithText } from './__fixtures__/document-with-text';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/visual-regression/helper';
import {
  getDocFromElement,
  fullpage,
  copyAsPlainText,
  copyAsHTML,
  setProseMirrorTextSelection,
} from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import { selectors } from '../../__helpers/page-objects/_editor';

const editorSelector = selectors.editor;

/*
 NOTE: this only works on this url:
 https://atlaskit.atlassian.com/examples.html?groupId=editor&packageId=renderer&exampleId=testing
 for testing copy/paste logic
*/
async function mountRenderer(
  page: WebdriverPage,
  props?: {
    withRendererActions?: boolean;
    smartLinks?: any;
  },
  adf?: Object,
): Promise<boolean> {
  const rendererAvailable = await page.executeAsync(
    (props, adf, done: (found: boolean) => boolean) => {
      function waitAndCall() {
        let win = window as any;
        if (win.__mountRenderer) {
          win.__mountRenderer(props, adf);
          done(true);
        } else {
          // There is no need to implement own timeout, if done() is not called on time,
          // webdriver will throw with own timeout.
          setTimeout(waitAndCall, 20);
        }
      }

      waitAndCall();

      // TODO: https://product-fabric.atlassian.net/browse/ED-9925
      //
      // As a temporary workaround to the above ticket's probelm, here we
      // prematurely abort after 3 seconds (less than the 5s default timeout)
      // if it hasn't found a match.
      // We do this for graceful continuation in the situation where a default
      // pipeline build hasn't pre-built the renderer package examples.
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.warn(
          `Renderer example isn't available. Gracefully continuing test without any test assertions so that it's non-blocking in CI.`,
        );
        done(false);
      }, 3000);
    },
    props,
    adf,
  );
  if (rendererAvailable) {
    await page.waitForSelector('.ak-renderer-wrapper', { timeout: 500 });
  }
  return rendererAvailable;
}

BrowserTestCase(
  'paste.ts: paste tests on fullpage editor: plain text',
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await copyAsPlainText(page, 'This text is plain.');

    await mountEditor(page, {
      appearance: fullpage.appearance,
    });
    await page.click(fullpage.placeholder);
    await page.paste();

    await page.waitForSelector('p');
    const doc = await page.$eval(editorSelector, getDocFromElement);

    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'paste.ts: paste tests on fullpage editor: text formatting',
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const testData =
      '<strong>bold </strong><em><strong>italics and bold </strong>some italics only </em><span class="code" style="font-family: monospace; white-space: pre-wrap;">add some code to this </span><u>underline this text</u><s> strikethrough </s><span style="color: rgb(0, 184, 217);">blue is my fav color</span> <a href="http://www.google.com">www.google.com</a>';

    await copyAsHTML(page, testData);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTextColor: true,
    });

    await page.click(fullpage.placeholder);
    await page.paste();
    await page.waitForSelector('strong');
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'paste.ts: paste tests on fullpage editor: bullet list',
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data =
      '<ul><li><p>list ele 1</p></li><li><p>list ele 2</p><ul><li><p>more ele 1</p></li><li><p>more ele 2</p></li></ul></li><li><p>this is the last ele</p></li></ul>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.click(fullpage.placeholder);
    await page.paste();

    await page.waitForSelector('ul');
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'paste.ts: paste tests on fullpage editor: ordered list',
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data =
      '<ol><li><p>this is ele1</p></li><li><p>this is a link <a href="http://www.google.com">www.google.com</a></p><ol><li><p>more elements with some <strong>format</strong></p></li><li><p>some addition<em> formatting</em></p></li></ol></li><li><p>last element</p></li></ol>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.click(fullpage.placeholder);
    await page.paste();

    await page.waitForSelector('p');
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'paste.ts: decision item copied from renderer and pasted',
  /* NOTE: https://product-fabric.atlassian.net/browse/ED-9822:
     we've got this bug in Firefox where it doubles up the items when pasting
  */
  { skip: ['edge', 'safari', 'firefox'] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    let page = new WebdriverPage(client);
    let url = getExampleUrl(
      'editor',
      'renderer',
      'testing',
      // @ts-ignore
      global.__BASEURL__,
    );

    await page.goto(url);
    await page.maximizeWindow();

    const rendererMounted = await mountRenderer(
      page,
      { withRendererActions: true },
      documentWithDecision,
    );

    // Only run the test assertions when the example is available.
    // When unavailable, gracefully pass the test to avoid blocking CI.
    if (rendererMounted) {
      const selectorStart = 'p';
      const selectorEnd = 'h3';
      const decisionListSelector = 'ol[data-node-type="decisionList"]';

      await page.waitForSelector(selectorStart);
      await page.waitForSelector(selectorEnd);
      await page.waitForSelector(decisionListSelector);
      await page.simulateUserSelection(selectorStart, selectorEnd);
      await page.copy();

      page = await goToEditorTestingWDExample(client);
      await mountEditor(page, {
        appearance: fullpage.appearance,
      });

      await page.paste();
      await page.waitForSelector(decisionListSelector);

      const doc = await page.$eval(editorSelector, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    }
  },
);

BrowserTestCase(
  'paste.ts: code block copied from renderer and pasted',
  { skip: ['safari'] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data =
      '<div class="ak-renderer-document"><p data-renderer-start-pos="1">hello</p><div class="code-block"><span data-ds--code--code-block=""><code><span class="linenumber react-syntax-highlighter-line-number">1</span><span>world</span></code></span></div></div>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.click(editorSelector);
    await page.paste();
    await page.waitForSelector('.code-block');

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'paste.ts: inline card copied from renderer and pasted',
  /* NOTE: https://product-fabric.atlassian.net/browse/EDM-1249
     we've got this bug in Firefox where it doubles up the items when pasting
  */
  /**
   * Notes that Chrome on MacOS will fail this test because we are using ['Shift', 'Insert'] in page.paste()
   * which would actually paste the text.
   */
  { skip: ['edge', 'safari', 'firefox'] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    let page = new WebdriverPage(client);
    let url = getExampleUrl(
      'editor',
      'renderer',
      'testing',
      // @ts-ignore
      global.__BASEURL__,
    );

    await page.goto(url);
    await page.maximizeWindow();

    const cardProviderPromise = Promise.resolve(
      new ConfluenceCardProvider('prod'),
    );

    const rendererMounted = await mountRenderer(
      page,
      {
        withRendererActions: true,
        smartLinks: {
          provider: cardProviderPromise,
          allowBlockCards: true,
        },
      },
      documentWithInlineCard,
    );

    // Only run the test assertions when the example is available.
    // When unavailable, gracefully pass the test to avoid blocking CI.
    if (rendererMounted) {
      const selectorStart = 'p[data-renderer-start-pos]';
      const selectorEnd = 'p[data-renderer-start-pos]';
      const inlineCardSelector = 'a[data-testid="inline-card-resolved-view"]';

      await page.waitForSelector(selectorStart);
      await page.waitForSelector(selectorEnd);
      await page.waitForSelector(inlineCardSelector);
      await page.simulateUserSelection(selectorStart, selectorEnd);
      await page.copy();

      page = await goToEditorTestingWDExample(client);
      await mountEditor(page, {
        appearance: fullpage.appearance,
        smartLinks: {
          provider: cardProviderPromise,
          allowBlockCards: true,
        },
      });

      await page.paste();
      await page.waitForSelector(inlineCardSelector);

      const doc = await page.$eval(editorSelector, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    }
  },
);

BrowserTestCase(
  'paste.ts: paste tests on fullpage editor: hyperlink',
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data = 'https://www.atlassian.com';
    await copyAsPlainText(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(documentWithText),
    });

    await page.click(fullpage.placeholder);
    await setProseMirrorTextSelection(page, { anchor: 13, head: 26 });
    await page.paste();

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
