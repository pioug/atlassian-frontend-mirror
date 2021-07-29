import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  pmSelector,
  emulateSelectAll,
} from '../../../../__tests__/visual-regression/_utils';
import { selectAtPosWithProseMirror } from '../../../../__tests__/__helpers/page-objects/_editor';

import selectionKitchenSink1Adf from './__fixtures__/kitchen-sink-1.adf.json';
import selectionKitchenSink2Adf from './__fixtures__/kitchen-sink-2.adf.json';
import selectionKitchenSink3Adf from './__fixtures__/kitchen-sink-3.adf.json';

describe('Selection:', () => {
  let page: PuppeteerPage;

  describe.each([
    [
      'scenario-1: should display top-level selectable nodes as selected, and hide native browser text selection on content inside those nodes',
      {
        adf: selectionKitchenSink1Adf,
      },
    ],
    [
      'scenario-2: should display top-level selectable nodes as selected, and hide native browser text selection on content inside those nodes',
      {
        adf: selectionKitchenSink2Adf,
      },
    ],
    [
      'scenario-3: should display top-level selectable nodes as selected, and hide native browser text selection on content inside those nodes',
      {
        adf: selectionKitchenSink3Adf,
        beforeSelect: async (page: PuppeteerPage) => {
          // For some reason, focus is still trapped on one of the inline
          // nodes, so we manually select to move focus in preparation for Ctrl + A
          await selectAtPosWithProseMirror(page, 1, 1);
        },
        beforeSnapshot: async (page: PuppeteerPage) => {
          // Need to wait for min-width to be calculated
          // and applied on inline-extension
          await page.waitForTimeout(1000);
        },
      },
    ],
  ])(
    'AllSelection (Cmd + A)',
    (
      name,
      {
        adf,
        beforeSnapshot,
        beforeSelect,
      }: {
        adf: object;
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

        beforeSelect && (await beforeSelect(page));
        await emulateSelectAll(page);
        // Unfortunately need to wait not just for decoration classes to apply,
        // but also for the selection styles to paint
        await page.waitForTimeout(1000);
        beforeSnapshot && (await beforeSnapshot(page));
        await snapshot(page);
      });
    },
  );
});
