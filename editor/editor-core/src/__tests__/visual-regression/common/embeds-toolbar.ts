import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/embeds.adf.json';
import { waitForResolvedEmbedCard } from '../../__helpers/page-objects/_cards';

describe('Embed Cards:', () => {
  it('display toolbar with offset', async () => {
    const page = global.page;

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
    await page.click('.embed-header');
    await page.waitForSelector('[aria-label="Floating Toolbar"]', {
      visible: true,
    });
    await page.click('[aria-label="Align right"]');
    await snapshot(page);
  });
});
