import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/nested-actions.adf.json';
import { selectors } from '../../__helpers/page-objects/_editor';

describe('Nested actions', () => {
  it('looks correct', async () => {
    const { page } = global;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
      editorProps: {
        allowNestedTasks: true,
      },
    });
    await page.waitForSelector(selectors.actionList);
    await snapshot(page);
  });
});
