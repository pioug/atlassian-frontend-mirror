// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initEditorWithAdf,
  Appearance,
  snapshot,
  pmSelector,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
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
    await snapshot(page, undefined, helpDialogSelector);
  });
});
