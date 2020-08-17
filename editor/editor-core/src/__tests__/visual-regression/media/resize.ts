import {
  insertMedia,
  waitForMediaToBeLoaded,
  resizeMediaInPosition,
  MediaResizeSide,
} from '../../__helpers/page-objects/_media';
import {
  resizeColumn,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import defaultTableADF from '../table/__fixtures__/default-table.adf.json';

describe('Snapshot Test: Media', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: defaultTableADF,
      editorProps: {
        media: {
          allowMediaSingle: true,
          allowResizing: true,
        },
        allowTables: {
          advanced: true,
        },
      },
    });

    await clickFirstCell(page);
    await insertMedia(page);
    await waitForMediaToBeLoaded(page);
  });

  it('will give priority to table resize', async () => {
    // Shrink media to slightly less than cell (to force media not to maximise)
    await resizeMediaInPosition(page, 0, -10, MediaResizeSide.left);
    await resizeColumn(page, { colIdx: 1, amount: 300, row: 2 });

    // Reset cursor selection
    await animationFrame(page);
    await clickFirstCell(page, false);
    await snapshot(page);
  });
});
