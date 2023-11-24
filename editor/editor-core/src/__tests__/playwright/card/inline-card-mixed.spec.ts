import {
  EditorBlockCardModel,
  EditorEmbedCardModel,
  EditorFloatingToolbarModel,
  EditorInlineCardModel,
  EditorMainToolbarModel,
  EditorNodeContainerModel,
  editorTestCase as test,
  expect,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
import {
  cardLazyAdf,
  embedCardAdf,
  embedCardAndBlockAdf,
  twoEmbedsAdf,
  inlineCardAdf,
} from './inline-card-mixed.spec.ts-fixtures';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  inlineCard,
  embedCard,
  table,
  tr,
  th,
  td,
  ul,
  li,
  a,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { RichMediaAttributes } from '@atlaskit/adf-schema/schema';

const TOTAL_CARDS = 7;

// copied from packages/media/media-integration-test-helpers/src/integration/smart-links-mock-client-utils.ts
export interface SmartLinkTestWindow extends Window {
  SMART_LINKS_REQUESTED: string[];
}

declare let window: SmartLinkTestWindow;

test.describe('inline-card-mixed: libra tests', () => {
  test.describe('lazy cards', () => {
    test.use({
      adf: cardLazyAdf,
      editorProps: {
        appearance: 'full-page',
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
        allowTables: {
          advanced: true,
        },
      },
    });

    test('should lazy render cards after scrolling down, requesting data in the background (with prefetching)', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-21127, ED-21145, ED-21153',
        reason:
          'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21127',
        browsers: [BROWSERS.chromium, BROWSERS.firefox, BROWSERS.webkit],
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
      const inlineCardModel = inlineCardsModel.card(0);

      // First, we expect cards to be in their non-rendered state.
      // There is one card at the top, and six at the very bottom.
      // The card at the top should enter a resolved state, whilst
      // the rest should be in an unresolved, lazy 'placeholder' state.
      await inlineCardModel.waitForStable();

      // All of the cards at the bottom should be off the viewport, rendering as lazy placeholders.
      await expect(inlineCardsModel.loadingCards).toHaveCount(TOTAL_CARDS - 1);

      // Before scrolling, we hold onto the network requests which
      // have been spoofed This should be one per URL.
      let requestsFired: string[] = await editor.page.evaluate(
        () => window.SMART_LINKS_REQUESTED,
      );

      // Now, scroll to the bottom - this should trigger render of the 'lazy' cards.
      const lastCardModel = inlineCardsModel.card(TOTAL_CARDS - 2);
      await lastCardModel.placeholder.scrollIntoViewIfNeeded();

      // Wait for card to finish resolving.
      await lastCardModel.waitForReady();

      //    All of them should in the viewport now, and render as resolved inline cards.
      //     await page.waitForElementCount(cardSelector, TOTAL_CARDS);
      await expect(inlineCardsModel.resolvedCards).toHaveCount(TOTAL_CARDS);

      // Finally, we check again how many requests were fired at the end of the test.
      // If the use of prefetching has succeeded, no extra requests should have been fired.
      let finalRequestsFired: string[] = await editor.page.evaluate(
        () => window.SMART_LINKS_REQUESTED,
      );

      // We perform this check by checking A contains B & B contains A to protect
      // this test from urls being out of order (if more are requested) and all that jazz.
      // Additionally, in both instances, the number of URLs requested should be the same
      // (i.e. the number of links on the page).
      expect(requestsFired).toHaveLength(TOTAL_CARDS);
      expect(finalRequestsFired).toHaveLength(TOTAL_CARDS);
      expect(requestsFired).toEqual(expect.arrayContaining(finalRequestsFired));

      expect(editor).toMatchDocument(
        doc(
          p(inlineCard({ url: 'https://inlineCardTestUrl' })(), ' '),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          p(),
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'wide',
            localId: expect.any(String),
          })(
            tr(
              th({ colspan: 1, rowspan: 1 })(p('Column 1')),
              th({ colspan: 1, rowspan: 1 })(p('Column 2')),
              th({ colspan: 1, rowspan: 1 })(p('Column 3')),
              th({ colspan: 1, rowspan: 1 })(p('Column 4')),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(
                ul(
                  li(p(inlineCard({ url: 'https://inlineCardTestUrl/1' })())),
                  li(p(inlineCard({ url: 'https://inlineCardTestUrl/2' })())),
                ),
              ),
              td({ colspan: 1, rowspan: 1 })(
                p(inlineCard({ url: 'https://inlineCardTestUrl/3' })()),
              ),
              td({ colspan: 1, rowspan: 1 })(
                p(inlineCard({ url: 'https://inlineCardTestUrl/4' })()),
              ),
              td({ colspan: 1, rowspan: 1 })(
                p(inlineCard({ url: 'https://inlineCardTestUrl/5' })()),
              ),
            ),
          ),
          p(inlineCard({ url: 'https://inlineCardTestUrl/6' })(), ' '),
        ),
      );
    });
  });
  test.describe('cardProvider tests', () => {
    test.use({
      adf: embedCardAndBlockAdf,
      editorProps: {
        appearance: 'full-page',
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
      editorMountOptions: {
        providers: {
          cards: true,
        },
        withLinkPickerOptions: true,
      },
    });
    test('should set contentediable=true on blocks and embeds', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-21128, ED-21146, ED-21154',
        reason:
          'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21128',
        browsers: [BROWSERS.chromium, BROWSERS.firefox, BROWSERS.webkit],
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);
      const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);

      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        embedCardModel,
      );

      await embedCardModel.waitForStable();
      await embedCardModel.click();
      await floatingToolbarModel.toolbar.waitFor();
      await expect(nodes.embedCard.isEditable()).toBeTruthy();
      await blockCardModel.click();
      await expect(nodes.blockCard.isEditable()).toBeTruthy();
    });
  });

  test.describe('embedded cards', () => {
    test.use({
      adf: embedCardAdf,
      editorProps: {
        appearance: 'full-page',
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
      editorMountOptions: {
        providers: {
          cards: true,
        },
        withLinkPickerOptions: true,
      },
    });

    test.describe('with feature flag: lp-link-picker', () => {
      test.use({
        adf: embedCardAdf,
        editorProps: {
          appearance: 'full-page',
          allowTextAlignment: true,
          smartLinks: {
            allowBlockCards: true,
            allowEmbeds: true,
          },
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        editorMountOptions: {
          providers: {
            cards: true,
          },
          withLinkPickerOptions: true,
        },
      });

      test('changing the link URL of an embed link to an unsupported url should convert it to a "dumb" link', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-21129, ED-21155',
          reason:
            'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21129',
          browsers: [BROWSERS.chromium, BROWSERS.webkit],
        });

        const nodes = EditorNodeContainerModel.from(editor);
        const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);

        const floatingToolbarModel = EditorFloatingToolbarModel.from(
          editor,
          embedCardModel,
        );

        await embedCardModel.waitForStable();
        await embedCardModel.click();
        await floatingToolbarModel.toolbar.waitFor();
        await floatingToolbarModel.editLink();
        await floatingToolbarModel.clearLink();
        await editor.keyboard.type(
          'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
        );
        await editor.keyboard.press('Enter');

        expect(editor).toMatchDocument(
          doc(
            p(),
            p(
              inlineCard({
                data: {
                  '@context': 'https://www.w3.org/ns/activitystreams',
                  '@type': 'Document',
                  name: 'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
                  url: 'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
                },
              })(),
              ' ',
            ),
            p(),
          ),
        );
      });
    });

    test('copy paste of embed link should work as expected in editor', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: '',
        reason: 'solve for waitForIFrameToSendResizeMessageTimes() under libra',
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);

      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        embedCardModel,
      );

      await embedCardModel.waitForStable();
      await embedCardModel.click();
      await floatingToolbarModel.toolbar.waitFor();

      // Copy the current link.
      await editor.copy();

      // Type some text.
      await editor.keyboard.press('ArrowRight');
      await editor.keyboard.press('Enter');
      await editor.keyboard.type('have another one');
      await editor.keyboard.press('Enter');

      // Paste into same session - there should be two now.
      await editor.paste();

      // Type some more text.
      await editor.keyboard.press('ArrowRight');
      await editor.keyboard.press('Enter');
      await editor.keyboard.type('now you have two!');

      // TODO: unclear it this is needed (mainly underlying waitForIFrameToSendResizeMessageTimes() routine)
      // - await waitForSuccessfullyResolvedEmbedCard(page, 2);
      // - related: packages/media/media-integration-test-helpers/src/integration/smart-links-selector-utils.ts
      // - waitForIFrameToSendResizeMessageTimes()

      expect(editor).toMatchDocument(
        doc(
          p(),
          embedCard({
            layout: 'center',
            originalHeight: 282,
            url: 'https://embedCardTestUrl',
            width: 66.66666666666666,
          })(),
          p('have another one'),
          embedCard({
            layout: 'center',
            originalHeight: 282,
            url: 'https://embedCardTestUrl',
            width: 66.66666666666666,
          })(),
          p(),
          p('now you have two!'),
        ),
      );
    });

    const embedLayoutTestCases: Array<{
      type: string;
      value: string;
      expectedLayout: RichMediaAttributes['layout'];
    }> = [
      {
        type: 'align left',
        value: 'Align left',
        expectedLayout: 'align-start',
      },
      {
        type: 'align right',
        value: 'Align right',
        expectedLayout: 'align-end',
      },
      {
        type: 'wrap left',
        value: 'Wrap left',
        expectedLayout: 'wrap-left',
      },
      {
        type: 'wrap right',
        value: 'Wrap right',
        expectedLayout: 'wrap-right',
      },
    ];
    embedLayoutTestCases.forEach((testCase) => {
      test(`Layout ${testCase.type} selector for embed Card`, async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId:
            'ED-21130, ED-21131, ED-21132, ED-21133, ED-21147, ED-21148, ED-21149, ED-21156, ED-21157, ED-21158, ED-21159',
          reason:
            'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21130',
          browsers: [
            BROWSERS.chromium,
            BROWSERS.chromium,
            BROWSERS.chromium,
            BROWSERS.chromium,
            BROWSERS.firefox,
            BROWSERS.firefox,
            BROWSERS.firefox,
            BROWSERS.webkit,
            BROWSERS.webkit,
            BROWSERS.webkit,
            BROWSERS.webkit,
          ],
        });

        const nodes = EditorNodeContainerModel.from(editor);
        const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);
        const toolbar = EditorMainToolbarModel.from(editor);

        await embedCardModel.waitForStable();
        await embedCardModel.click();
        await toolbar.clickAt(testCase.value);

        expect(editor).toMatchDocument(
          doc(
            p(),
            embedCard({
              layout: testCase.expectedLayout,
              originalHeight: 282,
              url: 'https://embedCardTestUrl',
              width: 66.66666666666666,
            })(),
            p(),
          ),
        );
      });
    });
  });

  test.describe('two embedded cards', () => {
    test.use({
      adf: twoEmbedsAdf,
      editorProps: {
        appearance: 'full-page',
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
        featureFlags: {
          'lp-link-picker': true,
        },
      },
      editorMountOptions: {
        providers: {
          cards: true,
        },
        withLinkPickerOptions: true,
      },
    });

    test('React shall not apply the same state to two different cards', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-21134, ED-21150, ED-21160',
        reason:
          'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21134',
        browsers: [BROWSERS.chromium, BROWSERS.firefox, BROWSERS.webkit],
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);

      embedCardModel.waitForSpecificIframeToLoad(
        'https://product-fabric.atlassian.net/wiki/1',
      );
      embedCardModel.waitForSpecificIframeToLoad(
        'https://product-fabric.atlassian.net/wiki/2',
      );

      await editor.selection.set({
        anchor: 1,
        head: 1,
      });
      await editor.keyboard.press('Backspace');

      embedCardModel.waitForSpecificIframeToLoad(
        'https://product-fabric.atlassian.net/wiki/2',
      );
    });
  });

  test.describe('inline cards', () => {
    test.use({
      adf: inlineCardAdf,
      editorProps: {
        appearance: 'full-page',
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
      editorMountOptions: {
        providers: {
          cards: true,
        },
        withLinkPickerOptions: true,
      },
    });

    test('inline: should open a new window to authenticate with a provider', async ({
      editor,
      page,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
      const popupPromise = page.waitForEvent('popup');
      await inlineCardModel.openUnauthorised();
      const popup = await popupPromise;
      await popup.waitForLoadState();

      expect(popup.url()).toBe('about:blank');
    });

    test('inline: should open a new window to authenticate with a provider when connecting a different account', async ({
      editor,
      page,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
      const popupPromise = page.waitForEvent('popup');
      await inlineCardModel.openForbidden();
      const popup = await popupPromise;
      await popup.waitForLoadState();
      expect(popup.url()).toBe('about:blank');
    });

    test('embed: should open a new window to authenticate with a provider', async ({
      editor,
      page,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
      const popupPromise = page.waitForEvent('popup');
      await inlineCardModel.openUnauthorised();
      const popup = await popupPromise;
      await popup.waitForLoadState();
      expect(popup.url()).toBe('about:blank');
    });

    test('embed: should open a new window to authenticate with a provider when connecting a different account', async ({
      editor,
      page,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
      const popupPromise = page.waitForEvent('popup');
      await inlineCardModel.openForbidden();
      const popup = await popupPromise;
      await popup.waitForLoadState();
      expect(popup.url()).toBe('about:blank');
    });
  });

  test.describe('misc card tests', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
      editorMountOptions: {
        providers: {
          cards: true,
        },
        withLinkPickerOptions: true,
      },
    });
    test(`typing in a supported link and pressing enter should not create an inline card`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-21135, ED-21161',
        reason:
          'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21135',
        browsers: [BROWSERS.chromium, BROWSERS.webkit],
      });

      await editor.keyboard.type('www.atlassian.com');
      await editor.keyboard.press('Enter');
      expect(editor).toMatchDocument(
        doc(
          p(a({ href: 'http://www.atlassian.com' })('www.atlassian.com')),
          p(),
        ),
      );
    });

    test(`typing in a supported link and pressing space should not create an inline card`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-21136, ED-21162',
        reason:
          'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21136',
        browsers: [BROWSERS.chromium, BROWSERS.webkit],
      });

      await editor.keyboard.type('www.atlassian.com');
      await editor.keyboard.type(' ');
      expect(editor).toMatchDocument(
        doc(
          p(a({ href: 'http://www.atlassian.com' })('www.atlassian.com'), ' '),
        ),
      );
    });

    test(`pressing backspace with the cursor at the end of Inline link should delete it`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-21137, ED-21151, ED-21163',
        reason:
          'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21137',
        browsers: [BROWSERS.chromium, BROWSERS.firefox, BROWSERS.webkit],
      });

      await editor.simulatePasteEvent({
        pasteAs: 'text/plain',
        text: 'https://www.atlassian.com',
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
      const inlineCardModel = inlineCardsModel.card(0);
      await inlineCardModel.waitForStable();

      // First backspace removes space at the end of Inline link
      await editor.keyboard.press('Backspace');
      // Second backspace removes the Inline link
      await editor.keyboard.press('Backspace');

      expect(editor).toMatchDocument(doc(p()));
    });

    test(`unlinking an Inline Link should replace it with text corresponding to the title of the previously linked page`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-21138, ED-21164',
        reason:
          'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21138',
        browsers: [BROWSERS.chromium, BROWSERS.webkit],
      });

      await editor.simulatePasteEvent({
        pasteAs: 'text/plain',
        text: 'https://www.atlassian.com',
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
      const inlineCardModel = inlineCardsModel.card(0);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        inlineCardsModel,
      );

      await inlineCardModel.waitForStable();
      await inlineCardModel.click();
      await floatingToolbarModel.waitForStable();
      await floatingToolbarModel.unlink();

      expect(editor).toMatchDocument(doc(p('Welcome to Atlassian! ')));
    });

    test('changing the link label of an inline link should convert it to a "dumb" link', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-21139, ED-21140, ED-21165, ED-21166',
        reason:
          'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21139',
        browsers: [
          BROWSERS.chromium,
          BROWSERS.chromium,
          BROWSERS.webkit,
          BROWSERS.webkit,
        ],
      });

      await editor.simulatePasteEvent({
        pasteAs: 'text/plain',
        text: 'https://www.atlassian.com',
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
      const inlineCardModel = inlineCardsModel.card(0);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        inlineCardsModel,
      );

      await inlineCardModel.waitForStable();
      await inlineCardModel.click();
      await floatingToolbarModel.waitForStable();
      await floatingToolbarModel.editLink();
      await floatingToolbarModel.clearLabel();
      await editor.keyboard.type('New heading\n');
      await editor.keyboard.press('Enter');

      expect(editor).toMatchDocument(
        doc(p(a({ href: 'http://www.atlassian.com' })('New heading'), ' ')),
      );
    });

    test.describe('with feature flag: lp-link-picker', () => {
      test.use({
        editorProps: {
          appearance: 'full-page',
          allowTextAlignment: true,
          smartLinks: {
            allowEmbeds: true,
          },
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        editorMountOptions: {
          withLinkPickerOptions: true,
        },
      });
      test('changing the link label of an inline link should convert it to a "dumb" link', async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-21139, ED-21140, ED-21165, ED-21166',
          reason:
            'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21139',
          browsers: [
            BROWSERS.chromium,
            BROWSERS.chromium,
            BROWSERS.webkit,
            BROWSERS.webkit,
          ],
        });

        await editor.simulatePasteEvent({
          pasteAs: 'text/plain',
          text: 'https://www.atlassian.com',
        });
        const nodes = EditorNodeContainerModel.from(editor);
        const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
        const inlineCardModel = inlineCardsModel.card(0);
        const floatingToolbarModel = EditorFloatingToolbarModel.from(
          editor,
          inlineCardsModel,
        );

        await inlineCardModel.waitForStable();
        await inlineCardModel.click();
        await floatingToolbarModel.waitForStable();
        await floatingToolbarModel.editLink();
        await floatingToolbarModel.clearLabel();
        await editor.keyboard.type('New heading\n');
        await editor.keyboard.press('Enter');

        expect(editor).toMatchDocument(
          doc(p(a({ href: 'http://www.atlassian.com' })('New heading'), ' ')),
        );
      });
    });

    test(`selecting an inline card and choosing a new page from edit-link menu should update title and url for supported link`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-21141, ED-21142, ED-21152, ED-21167',
        reason:
          'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21141',
        browsers: [
          BROWSERS.chromium,
          BROWSERS.chromium,
          BROWSERS.firefox,
          BROWSERS.webkit,
        ],
      });

      await editor.simulatePasteEvent({
        pasteAs: 'text/plain',
        text: 'https://www.atlassian.com',
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
      const inlineCardModel = inlineCardsModel.card(0);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        inlineCardsModel,
      );

      await inlineCardModel.waitForStable();
      await inlineCardModel.click();
      await floatingToolbarModel.waitForStable();
      await floatingToolbarModel.editLink();
      await floatingToolbarModel.clearLink();
      await editor.keyboard.type('home opt-in');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('Enter');

      await inlineCardModel.waitForStable();

      expect(editor).toMatchDocument(
        doc(
          p(
            inlineCard({
              data: {
                '@context': 'https://www.w3.org/ns/activitystreams',
                '@type': 'Document',
                name: 'https://product-fabric.atlassian.net/wiki/display/H/Home+opt-in+requests',
                url: 'https://product-fabric.atlassian.net/wiki/display/H/Home+opt-in+requests',
              },
            })(),
            '  ',
          ),
        ),
      );
    });

    test.describe('with feature flag: lp-link-picker', () => {
      test.use({
        editorProps: {
          appearance: 'full-page',
          allowTextAlignment: true,
          smartLinks: {
            allowEmbeds: true,
          },
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        editorMountOptions: {
          withLinkPickerOptions: true,
        },
      });

      test(`card: selecting an inline card and choosing a new page from edit-link menu should update title and url for supported link`, async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-21142',
          reason:
            'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21142',
          browsers: [BROWSERS.chromium],
        });

        await editor.simulatePasteEvent({
          pasteAs: 'text/plain',
          text: 'https://www.atlassian.com',
        });
        const nodes = EditorNodeContainerModel.from(editor);
        const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
        const inlineCardModel = inlineCardsModel.card(0);
        const floatingToolbarModel = EditorFloatingToolbarModel.from(
          editor,
          inlineCardsModel,
        );

        await inlineCardModel.waitForStable();
        await inlineCardModel.click();
        await floatingToolbarModel.waitForStable();
        await floatingToolbarModel.editLink();
        await floatingToolbarModel.clearLink();
        await editor.keyboard.type('home opt-in');
        await editor.keyboard.press('ArrowDown');
        await editor.keyboard.press('Enter');

        await inlineCardModel.waitForStable();

        expect(editor).toMatchDocument(
          doc(
            p(
              inlineCard({
                data: {
                  '@context': 'https://www.w3.org/ns/activitystreams',
                  '@type': 'Document',
                  name: 'https://product-fabric.atlassian.net/wiki/display/H/Home+opt-in+requests',
                  url: 'https://product-fabric.atlassian.net/wiki/display/H/Home+opt-in+requests',
                },
              })(),
              '  ',
            ),
          ),
        );
      });
    });

    test(`selecting an inline card and choosing a new page from edit-link menu should update title and url for unsupported link`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-21143, ED-21144, ED-21168, ED-21169',
        reason:
          'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21143',
        browsers: [
          BROWSERS.chromium,
          BROWSERS.chromium,
          BROWSERS.webkit,
          BROWSERS.webkit,
        ],
      });

      await editor.simulatePasteEvent({
        pasteAs: 'text/plain',
        text: 'https://www.atlassian.com',
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
      const inlineCardModel = inlineCardsModel.card(0);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        inlineCardsModel,
      );

      await inlineCardModel.waitForStable();
      await inlineCardModel.click();
      await floatingToolbarModel.waitForStable();
      await floatingToolbarModel.editLink();
      await floatingToolbarModel.clearLink();
      await editor.keyboard.type('FAB-1166');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('Enter');

      expect(editor).toMatchDocument(
        doc(
          p(
            a({ href: 'https://product-fabric.atlassian.net/browse/FAB-1166' })(
              'https://product-fabric.atlassian.net/browse/FAB-1166',
            ),
            ' ',
          ),
        ),
      );
    });

    test.describe('with feature flag: lp-link-picker', () => {
      test.use({
        editorProps: {
          appearance: 'full-page',
          allowTextAlignment: true,
          smartLinks: {
            allowEmbeds: true,
          },
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        editorMountOptions: {
          withLinkPickerOptions: true,
        },
      });
      test(`selecting an inline card and choosing a new page from edit-link menu should update title and url for unsupported link`, async ({
        editor,
      }) => {
        fixTest({
          jiraIssueId: 'ED-21143, ED-21144, ED-21168, ED-21169',
          reason:
            'FIXME: This test was automatically skipped due to failure on 22/11/2023: https://product-fabric.atlassian.net/browse/ED-21143',
          browsers: [
            BROWSERS.chromium,
            BROWSERS.chromium,
            BROWSERS.webkit,
            BROWSERS.webkit,
          ],
        });

        await editor.simulatePasteEvent({
          pasteAs: 'text/plain',
          text: 'https://www.atlassian.com',
        });
        const nodes = EditorNodeContainerModel.from(editor);
        const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
        const inlineCardModel = inlineCardsModel.card(0);
        const floatingToolbarModel = EditorFloatingToolbarModel.from(
          editor,
          inlineCardsModel,
        );

        await inlineCardModel.waitForStable();
        await inlineCardModel.click();
        await floatingToolbarModel.waitForStable();
        await floatingToolbarModel.editLink();
        await floatingToolbarModel.clearLink();
        await editor.keyboard.type('FAB-1166');
        await editor.keyboard.press('ArrowDown');
        await editor.keyboard.press('Enter');

        expect(editor).toMatchDocument(
          doc(
            p(
              a({
                href: 'https://product-fabric.atlassian.net/browse/FAB-1166',
              })('https://product-fabric.atlassian.net/browse/FAB-1166'),
              ' ',
            ),
          ),
        );
      });
    });
  });
});
