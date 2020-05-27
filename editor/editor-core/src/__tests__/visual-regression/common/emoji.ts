import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { Page } from '../../__helpers/page-objects/_types';
import emojiAdf from './__fixtures__/emoji-adf.json';
import { emojiSelectors } from '../../__helpers/page-objects/_emoji';
import { waitForNoTooltip } from '@atlaskit/visual-regression/helper';

describe('Emoji', () => {
  let page: Page;

  beforeAll(() => {
    page = global.page;
  });

  describe('when clicked on', () => {
    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: emojiAdf,
        viewport: { width: 300, height: 150 },
      });
    });

    afterEach(async () => {
      // move mouse as the cursor overlay covers emoji so makes it hard to see selection
      await page.mouse.move(0, 0);
      await waitForNoTooltip(page);
      await snapshot(page);
    });

    it('displays standard emoji as selected', async () => {
      await page.click(emojiSelectors.standard);
    });

    it('displays custom emoji as selected', async () => {
      await page.click(emojiSelectors.custom);
    });
  });
});