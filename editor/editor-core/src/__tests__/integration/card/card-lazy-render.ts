import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, editable } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import * as cardLazyAdf from './_fixtures_/inline-card-lazy.adf.json';
import {
  waitForLazyRenderedCard,
  waitForResolvedInlineCard,
  inlineCardSelector,
  lazyCardSelector,
} from '../../__helpers/page-objects/_cards';

type ClientType = Parameters<typeof goToEditorTestingExample>[0];

BrowserTestCase(
  'card: should lazy render cards after scrolling down',
  { skip: ['safari', 'edge'] },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingExample(client);
    const lazySelector = lazyCardSelector;
    const cardSelector = inlineCardSelector();
    const editorScrollParentSelector = '.fabric-editor-popup-scroll-parent';

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(cardLazyAdf),
      UNSAFE_cards: {
        allowBlockCards: true,
        allowEmbeds: true,
      },
      allowTables: {
        advanced: true,
      },
    });

    // First, we expect cards to be in their non-rendered state.
    await waitForLazyRenderedCard(page);
    // All of them should be off the viewport.
    await page.waitUntil(async () => {
      const cards = await page.$$(lazySelector);
      return cards.length === 6;
    });

    // Now, scroll to the bottom.
    await page.execute((editorScrollParentSelector: any) => {
      const editor = document.querySelector(editorScrollParentSelector);
      editor && editor.scrollBy(0, window.innerHeight * 100);
    }, editorScrollParentSelector);

    // Wait for card to finish resolving.
    await waitForResolvedInlineCard(page);
    // All of them should in the viewport now.
    await page.waitUntil(async () => {
      const cards = await page.$$(cardSelector);
      return cards.length === 7;
    });
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
