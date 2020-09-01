import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/embeds-fallback.adf.json';
import erroredViewAdf from './__fixtures__/embeds-errored.adf.json';
import { waitForBlockCardSelection } from '@atlaskit/media-integration-test-helpers';

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

  it('reuses blockCardErroredView when errored and has full height', async () => {
    const page = global.page;

    await initFullPageEditorWithAdf(
      page,
      erroredViewAdf,
      Device.LaptopHiDPI,
      undefined,
      {
        UNSAFE_cards: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    );
    await page.setViewport({
      width: 1440,
      height: 4000,
    });

    // Assert that the resolved view of the block card is rendered.
    await page.waitForSelector('[data-testid="err-view-retry"]');
    await snapshot(page);
  });
});
