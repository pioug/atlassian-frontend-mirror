import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from '../common/__fixtures__/noData-adf.json';
import {
  resizeColumn,
  insertTable,
  hoverColumnControls,
  insertColumn,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: table resizing', () => {
  describe('Re-sizing', () => {
    let page: PuppeteerPage;
    beforeEach(async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf,
        // ED-9859: Increase viewport height to 600 to prevent visual
        // scroll gutter and column insertion operations from affecting
        // the viewport and the captured snapshot.
        viewport: { width: 1040, height: 600 },
      });
      await insertTable(page);
    });

    it('should hover the right column after resize', async () => {
      await insertColumn(page, 1, 'right', true);
      await insertColumn(page, 1, 'right', true);
      await insertColumn(page, 1, 'right', true);
      await insertColumn(page, 1, 'right', true);
      await clickFirstCell(page);
      await resizeColumn(page, { colIdx: 1, amount: -130, row: 2 });
      await animationFrame(page);
      await animationFrame(page);
      await resizeColumn(page, { colIdx: 3, amount: -130, row: 2 });
      await animationFrame(page);
      await animationFrame(page);
      await hoverColumnControls(page, 6, 'right', true);
      await snapshot(page);
    });
  });
});
