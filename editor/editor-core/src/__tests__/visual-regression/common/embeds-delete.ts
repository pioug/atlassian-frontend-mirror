import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/embeds-delete.adf.json';
import { waitForResolvedEmbedCard } from '@atlaskit/media-integration-test-helpers';
import { evaluateTeardownMockDate } from '@atlaskit/visual-regression/helper';

describe('Embed Cards:', () => {
  it('does not apply deleted embed size to another embed', async () => {
    const { page } = global;

    await initFullPageEditorWithAdf(
      page,
      adf,
      Device.LaptopHiDPI,
      { width: 1440, height: 2300 },
      {
        smartLinks: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
          allowResizing: true,
        },
      },
      undefined,
      undefined,
      true,
    );
    await evaluateTeardownMockDate(page);
    await waitForResolvedEmbedCard(page, 'unauthorized');
    await waitForResolvedEmbedCard(page, 'not_found');
    // Delete the first embed
    await page.click('.embed-header');
    await page.keyboard.press('Backspace');
    await waitForResolvedEmbedCard(page, 'not_found');
    await snapshot(page);
  });
});
