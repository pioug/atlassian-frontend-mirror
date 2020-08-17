import { Device, initFullPageEditorWithAdf, snapshot } from '../_utils';

import {
  selectCellBackground,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';

import adf from './__fixtures__/default-table.adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Table context menu: cells background', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    await clickFirstCell(page);
  });

  it(`should set background color to cells`, async () => {
    await selectCellBackground({
      page,
      colorIndex: 3, // light blue color
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: 3,
      },
    });
    await snapshot(page);

    await selectCellBackground({
      page,
      colorIndex: 6, // light red color
      from: {
        row: 2,
        column: 1,
      },
      to: {
        row: 2,
        column: 3,
      },
    });
    await snapshot(page);

    await selectCellBackground({
      page,
      colorIndex: 8, // light gray color
      from: {
        row: 3,
        column: 1,
      },
      to: {
        row: 3,
        column: 3,
      },
    });
    await snapshot(page);
  });
});
