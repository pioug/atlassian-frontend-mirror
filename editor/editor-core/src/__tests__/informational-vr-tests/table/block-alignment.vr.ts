import { snapshotInformational } from '@af/visual-regression';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';
import { EditorPageModel } from '@af/editor-libra/page-models';
import { EditorWithAdf } from './block-alignment.fixtures';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { deviceViewPorts } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';

snapshotInformational(EditorWithAdf, {
  description: 'Table with block looks correct for comment:default layout',
  selector: {
    byTestId: 'click-wrapper',
  },
  prepare: async (page: Page) => {
    page.setViewportSize(deviceViewPorts['LaptopMDPI']);
    const editor = await EditorPageModel.from({ page });
    await editor.waitForEditorStable();
    await editor.page.click('table tr:nth-child(4) > *:nth-child(1)');
    await editor.waitForEditorStable();
  },
});
