import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { tableSelectors } from '@atlaskit/editor-test-helpers/page-objects/table';
import type { EditorProps } from '../../../types';
import adf from './__fixtures__/table-with-overflown-content.adf.json';
import { THEME_MODES } from '@atlaskit/theme/constants';

describe('Overflown content', () => {
  let page: PuppeteerPage;
  const editorProps: EditorProps = {
    allowTables: {
      allowColumnResizing: true,
    },
  };

  beforeAll(async () => {
    page = global.page;
  });

  describe.each(THEME_MODES)('Theme: %s', (theme) => {
    describe('when content is wider than a cell', () => {
      beforeEach(async () => {
        await initFullPageEditorWithAdf(
          page,
          adf,
          Device.LaptopHiDPI,
          undefined,
          editorProps,
          theme === 'dark' ? 'dark' : 'light',
        );
      });

      it('should not overflow beyond the cell', async () => {
        await snapshot(page, {}, tableSelectors.tableWrapper);
        const middleCell = 'table > tbody > tr:nth-child(2) > td:nth-child(2)';
        await page.waitForSelector(middleCell);
        await page.click(middleCell);
        await snapshot(page, {}, tableSelectors.tableWrapper);
      });
    });
  });
});
