import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, editable } from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import * as cardLazyAdf from './_fixtures_/inline-card-lazy.adf.json';
import {
  waitForLazyRenderedCard,
  waitForResolvedInlineCard,
  inlineCardSelector,
  lazyCardSelector,
  SmartLinkTestWindow,
  getRequestedCards,
} from '@atlaskit/media-integration-test-helpers';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];
// Setup extended window to inspect spoofed network requests for this Smart Link test.
declare let window: SmartLinkTestWindow;

const TOTAL_CARDS = 7;

BrowserTestCase(
  'card: should lazy render cards after scrolling down, requesting data in the background (with prefetching)',
  { skip: ['safari', 'edge'] },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    const cardSelector = inlineCardSelector();
    const editorScrollParentSelector = '.fabric-editor-popup-scroll-parent';

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(cardLazyAdf),
      smartLinks: {
        allowBlockCards: true,
        allowEmbeds: true,
      },
      allowTables: {
        advanced: true,
      },
    });

    // First, we expect cards to be in their non-rendered state.
    // There is one card at the top, and six at the very bottom.
    // The card at the top should enter a resolved state, whilst
    // the rest should be in an unresolved, lazy 'placeholder' state.
    await waitForResolvedInlineCard(page);
    await waitForLazyRenderedCard(page);
    // All of the cards at the bottom should be off the viewport, rendering as lazy placeholders.
    await page.waitForElementCount(lazyCardSelector, TOTAL_CARDS - 1);

    // Before scrolling, we hold onto the network requests which
    // have been spoofed This should be one per URL.
    let requestsFired: string[] = await getRequestedCards(page);

    // Now, scroll to the bottom - this should trigger render of the 'lazy' cards.
    await page.execute((editorScrollParentSelector: string) => {
      const editor = document.querySelector(editorScrollParentSelector);
      editor && editor.scrollBy(0, window.innerHeight * 100);
    }, editorScrollParentSelector);

    // Wait for card to finish resolving.
    await waitForResolvedInlineCard(page);
    // All of them should in the viewport now, and render as resolved inline cards.
    await page.waitForElementCount(cardSelector, TOTAL_CARDS);

    // Finally, we check again how many requests were fired at the end of the test.
    // If the use of prefetching has succeeded, no extra requests should have been fired.
    let finalRequestsFired: string[] = await getRequestedCards(page);

    // We perform this check by checking A contains B & B contains A to protect
    // this test from urls being out of order (if more are requested) and all that jazz.
    // Additionally, in both instances, the number of URLs requested should be the same
    // (i.e. the number of links on the page).
    expect(requestsFired).toHaveLength(TOTAL_CARDS);
    expect(finalRequestsFired).toHaveLength(TOTAL_CARDS);
    expect(requestsFired).toEqual(expect.arrayContaining(finalRequestsFired));

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
