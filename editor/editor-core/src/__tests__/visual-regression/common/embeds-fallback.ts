import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/embeds-fallback.adf.json';
import { waitForBlockCardSelection } from '../../../__tests__/__helpers/page-objects/_cards';
describe('Embed Cards:', () => {
  it('falls back to block card', async () => {
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

    // Assert that the resolved view of the block card is rendered.
    await waitForBlockCardSelection(page, 'resolved');
    await snapshot(page);
  });
});
