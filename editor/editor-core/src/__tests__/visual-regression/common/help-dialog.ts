import { waitForTooltip } from '@atlaskit/visual-regression/helper';
import {
  initEditorWithAdf,
  Appearance,
  snapshot,
  pmSelector,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { helpDialogSelector } from '@atlaskit/editor-test-helpers/page-objects/help-dialog';

describe('Help Dialog', () => {
  it('displays help dialog', async () => {
    const { page } = global;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 1200, height: 1400 },
    });
    await page.click(pmSelector);
    await page.keyboard.down('Control');
    await page.keyboard.down('/');
    await page.waitForSelector(helpDialogSelector);
    await waitForTooltip(page);
    await snapshot(page, undefined, helpDialogSelector);
  });
});
