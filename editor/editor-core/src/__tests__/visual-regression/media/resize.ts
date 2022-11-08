import {
  waitForMediaToBeLoaded,
  resizeMediaInPosition,
  MediaResizeSide,
} from '@atlaskit/editor-test-helpers/page-objects/media';
import {
  resizeColumn,
  clickFirstCell,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import mediaSingleInTableAdf from './__fixtures__/mediaSingle-in-table.adf.json';

describe('Snapshot Test: Media', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: mediaSingleInTableAdf,
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
