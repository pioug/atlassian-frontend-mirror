import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';

import { EmojiSharedCssClassName } from '../../styles/shared/emoji';

import { loadFullPageEditorWithAdf, snapshot } from './_utils';
import adf from './adf/basic-content.adf.json';

describe('Snapshot Test: Basic Content', () => {
  it('looks correct', async () => {
    const page = global.page;
    await page.setViewport({ width: 1000, height: 1000 });
    await loadFullPageEditorWithAdf(page, adf);
    // Wait for loaded emoji image (contained within ADF)
    await waitForLoadedBackgroundImages(
      page,
      `.${EmojiSharedCssClassName.EMOJI_SPRITE}`,
    );
    await snapshot(page);
  });
});
