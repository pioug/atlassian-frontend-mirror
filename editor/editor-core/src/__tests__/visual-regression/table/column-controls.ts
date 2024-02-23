// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickFirstCell,
  grabResizeHandle,
  hoverColumnControls,
  selectColumn,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/default-table.adf.json';
import adfTableWithoutTableHeader from './__fixtures__/table-without-table-header.adf.json';

describe('Table context menu: merge-split cells', () => {
  let page: PuppeteerPage;

  const initEditor = async (adf: Object) => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1040, height: 400 },
      editorProps: {
        allowTables: {
          advanced: true,
        },
      },
    });
    await clickFirstCell(page);
  };

  beforeAll(async () => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditor(adf);
  });

  it('should display the borders when the column controls are selected', async () => {
    await selectColumn(1);

    await snapshot(page, { tolerance: 0 }, tableSelectors.nthColumnControl(1), {
      captureBeyondViewport: false,
    });
  });

  it('should display column resizer handler on top of the column controls', async () => {
    await grabResizeHandle(page, { colIdx: 1, row: 2 });
    await animationFrame(page);
    await snapshot(page, { tolerance: 0 }, tableSelectors.nthColumnControl(1), {
      captureBeyondViewport: false,
    });
  });

  describe('when there is no table header', () => {
    beforeEach(async () => {
      await initEditor(adfTableWithoutTableHeader);
    });

    it('should display hover effect', async () => {
      await hoverColumnControls(page, 1, 'right');
      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
    });

    it('should display selected effect', async () => {
      await selectColumn(1);
      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
    });
  });
});
