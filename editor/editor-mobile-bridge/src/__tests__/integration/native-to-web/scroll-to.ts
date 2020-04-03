import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { renderer, skipBrowsers as skip, callRendererBridge } from '../_utils';
import adf from './__fixtures__/scroll-to-mention-adf.json';

type ScrollTestResult = {
  selectorMatched: boolean;
  initialScrollY: number;
  finalScrollY: number;
};

async function loadExampleDocument(client: any): Promise<Page> {
  const browser = new Page(client);
  // Set the viewport to the size of a small handheld phone (iPhone SE)
  // This aids the tests to ensure the element's we'll scroll to (within the example document)
  // are rendered off screen to begin with.
  await browser.setWindowSize(320, 568);
  // Load example document.
  await browser.goto(renderer.path);
  await callRendererBridge(browser, 'setContent', JSON.stringify(adf));
  // Wait for rendered document.
  await browser.waitForSelector('.ak-renderer-document');

  return browser;
}

async function getScrollY(browser: Page): Promise<number> {
  return browser.execute(() => window.scrollY);
}

async function checkScrollTo(
  browser: Page,
  fn: Function,
): Promise<ScrollTestResult> {
  /**
    We check the initial scroll position, invoke our scroll to method, and then
    recheck the final scroll position.

    The scroll to function (`fn`) invokes `HTMLElement.scrollIntoView`, so this approach means we don't
    need to mock that API for use with `toHaveBeenCalled()`.

    Instead, for the purpose of this test, we don't care what the scrollY values are, just that they've changed.
    It's assumed that they start at 0 and increase based on the scroll offset of the matched element.
   */
  const initialScrollY = await getScrollY(browser);
  const didScroll = await fn();
  const finalScrollY = await getScrollY(browser);

  return {
    initialScrollY,
    finalScrollY,
    selectorMatched: didScroll === 'true',
  };
}

// Tests for `scrollToContentNode`:

BrowserTestCase(
  `scroll-to.ts: call scrollToContentNode() for a Mention on renderer bridge.`,
  { skip },
  async function(client: any, testName: string) {
    const browser = await loadExampleDocument(client);
    const mentionId = '0'; // matches @Carolyn
    const {
      initialScrollY,
      finalScrollY,
      selectorMatched,
    } = await checkScrollTo(browser, async () => {
      // Without specifying an index we default to the first match
      return await callRendererBridge(
        browser,
        'scrollToContentNode',
        'mention',
        mentionId,
      );
    });
    expect(selectorMatched).toEqual(true);
    expect(finalScrollY).toBeGreaterThan(initialScrollY);
  },
);

BrowserTestCase(
  `scroll-to.ts: call scrollToContentNode() for an Action on renderer bridge.`,
  { skip },
  async function(client: any, testName: string) {
    const browser = await loadExampleDocument(client);
    const {
      initialScrollY,
      finalScrollY,
      selectorMatched,
    } = await checkScrollTo(browser, async () => {
      const localId = 'b9ce6302-8e8c-45c2-a2e1-3b1d6c68e059';
      return await callRendererBridge(
        browser,
        'scrollToContentNode',
        'action',
        localId,
      );
    });
    expect(selectorMatched).toEqual(true);
    expect(finalScrollY).toBeGreaterThan(initialScrollY);
  },
);

BrowserTestCase(
  `scroll-to.ts: call scrollToContentNode() for a Decision on renderer bridge.`,
  { skip },
  async function(client: any, testName: string) {
    const browser = await loadExampleDocument(client);
    const {
      initialScrollY,
      finalScrollY,
      selectorMatched,
    } = await checkScrollTo(browser, async () => {
      const localId = '695d2be8-528a-4ec0-9eb7-351763af6f94';
      return await callRendererBridge(
        browser,
        'scrollToContentNode',
        'decision',
        localId,
      );
    });
    expect(selectorMatched).toEqual(true);
    expect(finalScrollY).toBeGreaterThan(initialScrollY);
  },
);

// Tests for `getContentNodeScrollOffsetY`:

BrowserTestCase(
  `scroll-to.ts: call getContentNodeScrollOffsetY() for a Mention on renderer bridge.`,
  { skip },
  async function(client: any, testName: string) {
    const browser = await loadExampleDocument(client);
    const mentionId = '0'; // matches @Carolyn
    const scrollY = await callRendererBridge(
      browser,
      'getContentNodeScrollOffsetY',
      'mention',
      mentionId,
    );
    expect(parseInt(scrollY)).toBeGreaterThan(-1);
  },
);

BrowserTestCase(
  `scroll-to.ts: call getContentNodeScrollOffsetY() for an Action on renderer bridge.`,
  { skip },
  async function(client: any, testName: string) {
    const browser = await loadExampleDocument(client);
    const localId = 'b9ce6302-8e8c-45c2-a2e1-3b1d6c68e059';
    const scrollY = await callRendererBridge(
      browser,
      'getContentNodeScrollOffsetY',
      'action',
      localId,
    );
    expect(parseInt(scrollY)).toBeGreaterThan(-1);
  },
);

BrowserTestCase(
  `scroll-to.ts: call getContentNodeScrollOffsetY() for a Decision on renderer bridge.`,
  { skip },
  async function(client: any, testName: string) {
    const browser = await loadExampleDocument(client);
    const localId = '695d2be8-528a-4ec0-9eb7-351763af6f94';
    const scrollY = await callRendererBridge(
      browser,
      'getContentNodeScrollOffsetY',
      'decision',
      localId,
    );
    expect(parseInt(scrollY)).toBeGreaterThan(-1);
  },
);
