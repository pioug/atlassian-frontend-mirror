// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import { waitForSuccessfullyResolvedEmbedCard } from '@atlaskit/media-integration-test-helpers';
import { evaluateTeardownMockDate } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/embeds-wide.adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Embed Cards:', () => {
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
