import { snapshotInformational } from '@af/visual-regression';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';
import { EditorPageModel } from '@af/editor-libra/page-models';
// eslint-disable-next-line
import { deviceViewPorts } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import { CONTENT_AREA_TEST_ID } from '../../../ui/Appearance/FullPage/FullPageContentArea';
import {
  EditorFullWidth,
  EditorFullPage,
} from './toggle-width-fixtures/toggle-width.fixtures';

snapshotInformational(EditorFullWidth, {
  description: 'Toggle editor from full-width to full-page for media snapshot',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page) => {
    page.setViewportSize(deviceViewPorts['LaptopHiDPI']);
    const editor = await EditorPageModel.from({ page });
    await editor.waitForEditorStable();
    await page.evaluate(async () => {
      await (window as any).__changeWidth();
    });

    // clearing custom function for changing width option of Editor
    await page.evaluate(() => {
      delete (window as any).__changeWidth;
    });
  },
});

snapshotInformational(EditorFullPage, {
  description: 'Toggle editor from full-page to full-width for media snapshot',
  selector: {
    byTestId: CONTENT_AREA_TEST_ID,
  },
  prepare: async (page: Page) => {
    page.setViewportSize(deviceViewPorts['LaptopHiDPI']);
    const editor = await EditorPageModel.from({ page });
    await editor.waitForEditorStable();
    await page.evaluate(async () => {
      await (window as any).__changeWidth();
    });

    // clearing custom function for changing width option of Editor
    await page.evaluate(() => {
      delete (window as any).__changeWidth;
    });
  },
});
