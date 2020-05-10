import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { Page } from '../../__helpers/page-objects/_types';
import mentionAdf from './__fixtures__/mention-adf.json';
import { mentionSelectors } from '../../__helpers/page-objects/_mention';

describe('Mention', () => {
  let page: Page;

  beforeAll(() => {
    page = global.page;
  });

  it('displays as selected when clicked on', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: mentionAdf,
      viewport: { width: 300, height: 150 },
    });

    await page.click(mentionSelectors.mention);
    await snapshot(page);
  });
});
