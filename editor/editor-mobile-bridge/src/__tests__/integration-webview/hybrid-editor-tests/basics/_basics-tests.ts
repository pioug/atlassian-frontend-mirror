import {
  getDynamicMobileTestCase,
  DynamicMobileTestSuite,
  MobileTestCase,
} from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  focusOnWebView,
  loadEditor,
  configureEditor,
} from '../../_page-objects/hybrid-editor-page';
import fontSizeAdf from '../../__fixtures__/font-size.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';
import {
  validateFontSizeOverride,
  setADFContent,
} from '../../_utils/afe-app-helpers';
import { ENABLE_QUICK_INSERT } from '../../_utils/configurations';
import basicAdf from '../../__fixtures__/basic-content.adf.json';
import { callNativeBridge } from '../../../integration/_utils';

type TestName =
  | 'Editor Text: Load ADF with different text nodes displayed'
  | 'Editor Text: Validate font size change at runtime'
  | 'Editor Text: Validate font size larger than 34px is set to max font size of 34px.'
  | 'Clickable Area: Mobile does not scroll when clicking in clickable area'
  | 'Validate cursor is at the same position after config loads';

const basicEditorTestSuite: DynamicMobileTestSuite<TestName> = async ({
  skipTests,
}) => {
  const DynamicMobileTestCase = getDynamicMobileTestCase({
    TestCase: MobileTestCase,
    skipTests,
  });

  // TODO: ED-13890 - Fix inconsistent test snapshot diff
  DynamicMobileTestCase(
    'Editor Text: Load ADF with different text nodes displayed',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await setADFContent(page, basicAdf);
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
    'Editor Text: Validate font size change at runtime',
    {},
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await validateFontSizeOverride(page, fontSizeAdf, '.ProseMirror', '24');
    },
  );
  DynamicMobileTestCase(
    'Editor Text: Validate font size larger than 34px is set to max font size of 34px.',
    {},
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await validateFontSizeOverride(page, fontSizeAdf, '.ProseMirror', '35');
    },
  );
  DynamicMobileTestCase(
    'Clickable Area: Mobile does not scroll when clicking in clickable area',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await setADFContent(page, fontSizeAdf);
      await focusOnWebView(page);
      await page.execute(() => {
        window.bridge?.setKeyboardControlsHeight('300');
      });
      await page.click('.editor-click-wrapper');
      await mobileSnapshot(page);
    },
  );
  DynamicMobileTestCase(
    'Validate cursor is at the same position after config loads',
    {},
    async (client: any) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.switchToWeb();
      await setADFContent(page, basicAdf);

      // get initial cursor position
      const initialCursorPosition = await page.execute<void>(() => {
        return (window as any).bridge.editorView.state.selection.$anchor.pos;
      });
      expect(initialCursorPosition).toBe(1);

      // move cursor
      const MOVE_TO_POS = 8;
      const selection = {
        selection: { type: 'text', anchor: MOVE_TO_POS, head: MOVE_TO_POS },
        rect: { top: 0, left: 0 },
      };
      await callNativeBridge(page, 'setSelection', JSON.stringify(selection));

      await configureEditor(page, ENABLE_QUICK_INSERT);

      // get current cursor position
      const cursorPosition = await page.execute<void>(() => {
        return (window as any).bridge.editorView.state.selection.$anchor.pos;
      });

      // Android expects the position to be +2 from Ios
      expect([MOVE_TO_POS, MOVE_TO_POS + 2]).toContain(cursorPosition);
    },
  );
};

export default basicEditorTestSuite;
