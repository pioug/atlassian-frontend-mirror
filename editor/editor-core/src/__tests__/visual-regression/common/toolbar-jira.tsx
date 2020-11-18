import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { VIEWPORT_SIZES } from '@atlaskit/editor-shared-styles';
import { mainToolbarSelector } from '../../__helpers/page-objects/_toolbar';

describe('Toolbar: Jira configurarion', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.comment,
      editorProps: {
        UNSAFE_cards: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
        allowBreakout: false,
        allowExpand: false,
        allowExtension: false,
        allowIndentation: false,
        allowJiraIssue: false,
        allowLayouts: false,
        allowTables: {
          allowColumnResizing: true,
          allowControls: true,
          allowHeaderRow: true,
          allowHeaderColumn: true,
          allowNumberColumn: true,
        },
        allowTemplatePlaceholders: false,
        allowTextAlignment: false,
        codeBlock: undefined,
        media: {
          allowMediaSingle: true,
          allowResizing: true,
          allowResizingInTables: true,
        },
        shouldFocus: true,
      },
    });
  });

  const EXCLUDED_SIZES = [
    VIEWPORT_SIZES.laptopHiDPI.width,
    VIEWPORT_SIZES.laptopMDPI.width,
  ];
  Object.entries(VIEWPORT_SIZES).forEach(([key, viewport]) => {
    if (!EXCLUDED_SIZES.includes(viewport.width)) {
      it(`buttons should be disaplayed correctly at viewport ${key}`, async () => {
        await page.setViewport(viewport);
        await snapshot(page, undefined, mainToolbarSelector);
      });
    }
  });
});
