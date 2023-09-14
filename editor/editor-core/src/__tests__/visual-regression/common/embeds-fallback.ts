// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/embeds-fallback.adf.json';
import erroredViewAdf from './__fixtures__/embeds-errored.adf.json';
import { waitForBlockCardSelection } from '@atlaskit/media-integration-test-helpers';
import { evaluateTeardownMockDate } from '@atlaskit/visual-regression/helper';

describe('Embed Cards:', () => {
  it('falls back to block card', async () => {
    const page = global.page;

    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI, undefined, {
      smartLinks: {
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
      {
        width: 1440,
        height: 4000,
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

    // Assert that the resolved view of the block card is rendered.
    await page.waitForSelector('[data-testid="err-view-retry"]');
    await snapshot(page);
  });
});
