import { getBoundingRect } from '../../__helpers/page-objects/_editor';
import {
  clickFirstCell,
  tableSelectors,
} from '../../__helpers/page-objects/_table';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  initFullPageEditorWithAdf,
  initCommentEditorWithAdf,
  snapshot,
  Device,
} from '../_utils';
import adf from './__fixtures__/table-with-merged-cells-on-first-column.adf.json';
import defaultTableAdf from './__fixtures__/default-table.adf.json';

// TODO: https://product-fabric.atlassian.net/browse/ED-7721
describe.skip('Snapshot Test: hover rows controlls', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  describe('when there are merged cells at first column', () => {
    it.each([2, 3, 4])(
      'should display insert button on top for row %i ',
      async a => {
        await initFullPageEditorWithAdf(page, adf);

        await clickFirstCell(page);
        const bounds = await getBoundingRect(
          page,
          tableSelectors.nthRowControl(a),
        );

        const x = bounds.left;
        const y = bounds.top + 5;

        await page.mouse.move(x, y);
        await snapshot(page);
      },
    );

    it.each([2, 3, 4])(
      'should display insert button on bottom for row %i ',
      async a => {
        await initFullPageEditorWithAdf(page, adf);

        await clickFirstCell(page);
        const bounds = await getBoundingRect(
          page,
          tableSelectors.nthRowControl(a),
        );

        const x = bounds.left;
        const y = bounds.top + bounds.height - 5;

        await page.mouse.move(x, y);
        await snapshot(page);
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

      await page.mouse.move(x, y);
      await snapshot(page);
    });
  });
});
