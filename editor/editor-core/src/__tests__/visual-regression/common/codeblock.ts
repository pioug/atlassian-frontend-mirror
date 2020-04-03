import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/code-block-adf.json';
import { selectors } from '../../__helpers/page-objects/_editor';
import { Page } from '../../__helpers/page-objects/_types';

describe('Code breakout:', () => {
  it('looks correct', async () => {
    const page: Page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 500 },
    });
    await page.waitForSelector(selectors.codeContent);
    await page.click(selectors.codeContent);
    await snapshot(page);
  });
});
