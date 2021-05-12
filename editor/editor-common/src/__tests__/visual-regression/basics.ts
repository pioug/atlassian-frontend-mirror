import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';

import { EmojiSharedCssClassName } from '../../styles/shared/emoji';

import { loadFullPageEditorWithAdf, snapshot } from './_utils';
import adf from './adf/basic-content.adf.json';

// Skipped due to https://product-fabric.atlassian.net/browse/ED-12847
describe.skip('Snapshot Test: Basic Content', () => {
  it('looks correct', async () => {
    const { page } = global;
    await page.setViewport({ width: 1000, height: 1000 });
    await loadFullPageEditorWithAdf(page, adf);
    // Wait for loaded emoji image (contained within ADF)
    await waitForLoadedBackgroundImages(
      page,
      `.${EmojiSharedCssClassName.EMOJI_SPRITE}`,
    );
    await snapshot(page, undefined, '.ProseMirror');
  });
});
