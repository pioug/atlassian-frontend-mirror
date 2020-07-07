import { waitForLoadedImageElements } from '@atlaskit/visual-regression/helper';
import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/embed-card-layouts-adf.json';
import { waitForResolvedEmbedCard } from '../../__helpers/page-objects/_cards';

describe('Embed Cards:', () => {
  it('displays embed properly with different layouts', async () => {
    const { page } = global;

    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI, undefined, {
      UNSAFE_cards: {
        resolveBeforeMacros: ['jira'],
        allowBlockCards: true,
        allowEmbeds: true,
      },
    });
    await page.setViewport({
      width: 1440,
      height: 4000,
    });
    await waitForResolvedEmbedCard(page);
    await waitForLoadedImageElements(page, 3000);
    await snapshot(page);
  });
});
