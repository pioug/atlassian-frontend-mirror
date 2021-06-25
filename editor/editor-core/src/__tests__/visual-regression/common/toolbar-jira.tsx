import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { VIEWPORT_SIZES } from '@atlaskit/editor-shared-styles';
import {
  mainToolbarSelector,
  toolbarMenuItemsSelectors,
  ToolbarMenuItem,
} from '../../__helpers/page-objects/_toolbar';
import { timeouts } from '../../__helpers/page-objects/_editor';

describe('Toolbar: Jira configurarion', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.comment,
      editorProps: {
        smartLinks: {
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

        // for the toolbar sizes when emoji button is shown it can take some time for emoji button to become enabled
        // need to await for it to become enabled before taking screenshot
        if (
          [VIEWPORT_SIZES.tabletL.width, VIEWPORT_SIZES.tabletS.width].includes(
            viewport.width,
          )
        ) {
          const emojiButtonSelector = `${mainToolbarSelector} button:not([disabled]) ${
            toolbarMenuItemsSelectors[ToolbarMenuItem.emoji]
          }`;
          await page.waitForSelector(emojiButtonSelector, {
            timeout: timeouts.DEFAULT,
            visible: true,
          });
        }
        await snapshot(page, undefined, mainToolbarSelector);
      });
    }
  });
});
