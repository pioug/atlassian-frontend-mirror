import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import {
  fullpage,
  quickInsert,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';

// Height + Padding
const DEFAULT_LIST_HEIGHT = 388;

const DEFAULT_WINDOW_WIDTH = 1300;

const DEFAULT_WINDOW_HEIGHT = 850;

const LESS_THAN_DEFAULT_HEIGHT = 260;

// Edge case height with one line of text
const HEIGHT_BREAKPOINT_WITH_TEXT = 500;

const GREATER_THAN_DEFAULT_HEIGHT = 600;

const selectors = {
  EDITOR: '.ProseMirror',
  TYPEAHEAD_MENU: `.fabric-editor-typeahead`,
  TYPEAHEAD_MENU_OPTION: `[role="option"]`,
};

describe('typeahead: at different view sizes', () => {
  const getTypeAheadHeight = async (page: WebDriverPage) => {
    const typeaheadMenu = await page.$(selectors.TYPEAHEAD_MENU);
    return await typeaheadMenu.getSize('height');
  };

  const openTypeAhead = async (
    page: WebDriverPage,
    windowWidth: number = DEFAULT_WINDOW_WIDTH,
    windowHeight: number = DEFAULT_WINDOW_HEIGHT,
  ) => {
    await page.setWindowSize(windowWidth, windowHeight);
    await mountEditor(page, fullpage);
    await quickInsert(page, '', false);
    await page.waitForVisible(selectors.TYPEAHEAD_MENU);
  };

  const isTypeAheadMenuClipped = async (page: WebDriverPage) => {
    const firstMenuOption = await page.$(selectors.TYPEAHEAD_MENU_OPTION);
    const isExisting = await firstMenuOption.isExisting();
    const isInView = await firstMenuOption.isDisplayedInViewport();
    return isExisting && isInView;
  };

  BrowserTestCase(
    'typeahead height should be set to default size on normal desktop screen size',
    {},
    async (client: any) => {
      const page = await goToEditorTestingWDExample(client);
      await openTypeAhead(page);
      const height = await getTypeAheadHeight(page);
      expect(height).toEqual(DEFAULT_LIST_HEIGHT);
    },
  );

  BrowserTestCase(
    'typeahead height should be less than default when view is smaller than default typeahead height',
    {},
    async (client: any) => {
      const page = await goToEditorTestingWDExample(client);
      await openTypeAhead(page, DEFAULT_WINDOW_WIDTH, LESS_THAN_DEFAULT_HEIGHT);
      const height = await getTypeAheadHeight(page);
      expect(height).toBeLessThan(DEFAULT_LIST_HEIGHT);
    },
  );

  BrowserTestCase(
    'typeahead should resize when view size changes',
    {},
    async (client: any) => {
      const page = await goToEditorTestingWDExample(client);
      await openTypeAhead(page, DEFAULT_WINDOW_WIDTH, LESS_THAN_DEFAULT_HEIGHT);
      const menuHeightBefore = await getTypeAheadHeight(page);
      await page.setWindowSize(
        DEFAULT_WINDOW_WIDTH,
        GREATER_THAN_DEFAULT_HEIGHT,
      );
      const menuHeightAfter = await getTypeAheadHeight(page);
      expect(menuHeightBefore).toBeLessThan(menuHeightAfter);
    },
  );

  BrowserTestCase(
    'typeahead should not be clipped on smaller window size',
    {},
    async (client: any) => {
      const page = await goToEditorTestingWDExample(client);
      await openTypeAhead(page, DEFAULT_WINDOW_WIDTH, LESS_THAN_DEFAULT_HEIGHT);
      const isClipped = await isTypeAheadMenuClipped(page);
      expect(isClipped).toBeTruthy();
    },
  );

  BrowserTestCase(
    'typeahead should not be clipped on smaller window with text above it',
    {},
    async (client: any) => {
      const page = await goToEditorTestingWDExample(client);
      await page.type(selectors.EDITOR, 'abc\n');
      await openTypeAhead(
        page,
        DEFAULT_WINDOW_WIDTH,
        HEIGHT_BREAKPOINT_WITH_TEXT,
      );
      const isClipped = await isTypeAheadMenuClipped(page);
      expect(isClipped).toBeTruthy();
    },
  );
});
