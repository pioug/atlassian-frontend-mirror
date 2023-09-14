import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initEditorWithAdf,
  Appearance,
  snapshot,
  applyRemoteStep,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickFirstCell,
  grabAndMoveColumnResing,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import type { EditorProps } from '../../../types';
import adf from './__fixtures__/default-table.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';

describe('Table lock problems', () => {
  let page: PuppeteerPage;
  const editorProps: EditorProps = {
    allowTables: {
      allowControls: true,
      allowColumnResizing: true,
    },
  };

  beforeAll(async () => {
    page = global.page;
  });

  describe('when there is a step comming from collab', () => {
    const insertParagraph = [
      '{"stepType":"replace","from":0,"to":0,"slice":{"content":[{"type":"paragraph"}]}}',
      '{"stepType":"replace","from":1,"to":1,"slice":{"content":[{"type":"text","text":"r"}]}}',
      '{"stepType":"replace","from":2,"to":2,"slice":{"content":[{"type":"text","text":"s"}]}}',
    ];

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf,
        viewport: { width: 800, height: 600 },
        editorProps,
      });
    });

    it('should be able to delete the table after resizing', async () => {
      await clickFirstCell(page, true);
      await animationFrame(page);
      await grabAndMoveColumnResing(page, { colIdx: 1, row: 2, amount: 123 });
      await applyRemoteStep(page, insertParagraph);
      await page.mouse.up();
      await page.click(tableSelectors.removeTable);
      await animationFrame(page);
      await snapshot(page);
    });
  });
});
