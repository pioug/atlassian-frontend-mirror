import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/embeds.adf.json';
import { evaluateTeardownMockDate } from '@atlaskit/visual-regression/helper';
import { waitForSuccessfullyResolvedEmbedCard } from '@atlaskit/media-integration-test-helpers';

describe('Embed Cards:', () => {
  it('display toolbar with offset', async () => {
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
      undefined,
      undefined,
      true,
    );
    await evaluateTeardownMockDate(page);

    await waitForSuccessfullyResolvedEmbedCard(page);
    await page.click('.embed-header');
    await page.waitForSelector('[aria-label="Floating Toolbar"]', {
      visible: true,
    });
    await page.click('[aria-label="Align right"]');
    await snapshot(page);
  });
});
