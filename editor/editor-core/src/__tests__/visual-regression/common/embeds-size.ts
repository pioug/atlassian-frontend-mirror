import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/embeds-wide.adf.json';
import { waitForSuccessfullyResolvedEmbedCard } from '@atlaskit/media-integration-test-helpers';
import { evaluateTeardownMockDate } from '@atlaskit/visual-regression/helper';

describe('Embed Cards:', () => {
  it('displays correct sizes for embed when layout changes from wide to center', async () => {
    const page = global.page;

    await initFullPageEditorWithAdf(
      page,
      adf,
      Device.LaptopHiDPI,
      {
        width: 1440,
        height: 2300,
      },
      {
        smartLinks: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    );
    await evaluateTeardownMockDate(page);

    await waitForSuccessfullyResolvedEmbedCard(page, 1, false);
    await page.click('.embed-header');
    await page.waitForSelector('[aria-label="Floating Toolbar"]', {
      visible: true,
    });
    await snapshot(page);

    // This will resize embed from `wide` layout to `100 center`
    await page.click('[aria-label="Align center"]');
    await waitForSuccessfullyResolvedEmbedCard(page, 2, false);
    await snapshot(page);
  });
});
