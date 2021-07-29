import {
  PuppeteerPage,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  pmSelector,
} from '../../../../__tests__/visual-regression/_utils';
import { selectAtPosWithProseMirror } from '../../../../__tests__/__helpers/page-objects/_editor';

import selectionKitchenSink1Adf from './__fixtures__/kitchen-sink-1.adf.json';
import selectionKitchenSink2Adf from './__fixtures__/kitchen-sink-2.adf.json';
import selectionKitchenSink3Adf from './__fixtures__/kitchen-sink-3.adf.json';
import { emojiSelectors } from '../../../../__tests__/__helpers/page-objects/_emoji';

describe('Selection:', () => {
  let page: PuppeteerPage;

  describe.each([
    [
      'should display top-level selectable nodes as selected, and hide native browser text selection on content inside those nodes',
      {
        adf: selectionKitchenSink1Adf,
        selection: { start: 0, end: 325 },
      },
    ],
    [
      'should not apply selection styles to partially selected top-level nodes (expand)',
      {
        adf: selectionKitchenSink1Adf,
        selection: { start: 0, end: 72 },
      },
    ],
    [
      'should not apply selection styles to partially selected top-level nodes (panel)',
      {
        adf: selectionKitchenSink1Adf,
        selection: { start: 83, end: 156 },
        beforeSelect: async (page: PuppeteerPage) => {
          // Wait for the expand to render
          await page.waitForSelector('.ak-editor-expand__content');
        },
      },
    ],
    [
      'should not apply selection styles to partially selected top-level nodes (table)',
      {
        adf: selectionKitchenSink1Adf,
        selection: { start: 106, end: 283 },
        beforeSelect: async (page: PuppeteerPage) => {
          // Wait for the expand to render
          await page.waitForSelector('.ak-editor-expand__content');
        },
      },
    ],
    [
      'should display top-level selectable nodes as selected, and hide native browser text selection on content inside those nodes',
      {
        adf: selectionKitchenSink2Adf,
        selection: { start: 0, end: 473 },
      },
    ],
    [
      'should not apply selection styles to partially selected top-level nodes (layout)',
      {
        adf: selectionKitchenSink2Adf,
        selection: { start: 1, end: 46 },
      },
    ],
    [
      'should not apply selection styles to partially selected top-level nodes (codeblock)',
      {
        adf: selectionKitchenSink2Adf,
        selection: { start: 1, end: 212 },
      },
    ],
    [
      'should not apply selection styles to partially selected top-level nodes (decisions)',
      {
        adf: selectionKitchenSink2Adf,
        selection: { start: 1, end: 229 },
      },
    ],
    [
      'should display top-level selectable nodes as selected, and hide native browser text selection on content inside those nodes',
      {
        adf: selectionKitchenSink3Adf,
        selection: { start: 0, end: 30 },
        beforeSnapshot: async (page: PuppeteerPage) => {
          // Need to wait for min-width to be calculated
          // and applied on inline-extension
          await page.waitForTimeout(1000);
        },
      },
    ],
  ])(
    'TextSelection (mouse click/drag)',
    (
      name,
      {
        adf,
        selection,
        beforeSnapshot,
        beforeSelect,
      }: {
        adf: object;
        selection: { start: number; end: number };
        beforeSnapshot?: (page: PuppeteerPage) => Promise<void>;
        beforeSelect?: (page: PuppeteerPage) => Promise<void>;
      },
    ) => {
      beforeAll(() => {
        page = global.page;
      });

      it(name, async () => {
        await initEditorWithAdf(page, {
          appearance: Appearance.fullPage,
          adf,
          viewport: { width: 1040, height: 1200 },
        });
        await page.focus(pmSelector);

        const hasEmojiInDoc = await page.evaluate(
          (emojiNodeSelector: string) => {
            return document.querySelector(emojiNodeSelector);
          },
          emojiSelectors.node,
        );

        if (hasEmojiInDoc) {
          await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
        }

        if (beforeSelect) {
          await beforeSelect(page);
        }
        await selectAtPosWithProseMirror(page, selection.start, selection.end);
        // Unfortunately need to wait not just for decoration classes to apply,

        // but also for the selection styles to paint
        await page.waitForTimeout(1000);

        if (beforeSnapshot) {
          await beforeSnapshot(page);
        }
        await snapshot(page);
      });
    },
  );
});
