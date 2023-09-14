// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { getBoundingRect } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickFirstCell,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  initCommentEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/table-with-merged-cells-on-first-column.adf.json';
import defaultTableAdf from './__fixtures__/default-table.adf.json';

const moveMouse = (page: PuppeteerPage, x: number, y: number) =>
  retryUntilStablePosition(
    page,
    async () => {
      await page.mouse.move(0, 50);
      await page.mouse.move(x, y);
    },
    '[aria-label*="Table floating controls"]',
    1000,
  );

describe('Snapshot Test: hover rows controlls', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  describe('when there are merged cells at first column', () => {
    it.each([2, 3, 4])(
      'should display insert button on top for row %i ',
      async (a) => {
        await initFullPageEditorWithAdf(page, adf);

        await clickFirstCell(page);
        const bounds = await getBoundingRect(
          page,
          tableSelectors.nthRowControl(a),
        );

        const x = bounds.left;
        const y = bounds.top + 5;

        await moveMouse(page, x, y);
        await snapshot(page, undefined, undefined, {
          captureBeyondViewport: false,
        });
      },
    );

    it.each([2, 3, 4])(
      'should display insert button on bottom for row %i ',
      async (a) => {
        await initFullPageEditorWithAdf(page, adf);

        await clickFirstCell(page);
        const bounds = await getBoundingRect(
          page,
          tableSelectors.nthRowControl(a),
        );

        const x = bounds.left;
        const y = bounds.top + bounds.height - 5;

        await moveMouse(page, x, y);
        await snapshot(page, undefined, undefined, {
          captureBeyondViewport: false,
        });
      },
    );
  });

  describe('comment editor', () => {
    it('should render insert button without cutting it off', async () => {
      await initCommentEditorWithAdf(page, defaultTableAdf, Device.LaptopMDPI);
      await clickFirstCell(page);
      const bounds = await getBoundingRect(
        page,
        tableSelectors.nthRowControl(2),
      );
      const x = bounds.left;
      const y = bounds.top + bounds.height - 5;

      await moveMouse(page, x, y);
      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
    });
  });
});
