import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  evaluateTeardownMockDate,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import cardSelectionAdf from './__fixtures__/card-selection-adf.json';
import cardAdfRequestAccess from './__fixtures__/card-request-access.adf.json';
import cardAdfBlock from './__fixtures__/card-adf.block.json';
import cardAdfSupportedPlatforms from './__fixtures__/card-adf.supported-platforms.json';
import cardAdfBlockLongTitle from './__fixtures__/card-adf-long-title.block.json';
import cardInsideInfoAndLayout from './__fixtures__/card-inside-info-and-layout-adf.json';

import {
  openPreviewState,
  waitForBlockCardSelection,
  waitForEmbedCardSelection,
  waitForInlineCardSelection,
  waitForPreviewState,
  waitForResolvedBlockCard,
  waitForResolvedEmbedCard,
  waitForResolvedInlineCard,
  waitForSuccessfullyResolvedEmbedCard,
} from '@atlaskit/media-integration-test-helpers';
import { contexts } from './__helpers__/card-utils';

describe('Cards:', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  describe.each(contexts)(
    'displays inline link with correct appearance inside',
    ({ name, adf }) => {
      it(`${name}`, async () => {
        await initFullPageEditorWithAdf(
          page,
          adf,
          Device.LaptopHiDPI,
          {
            width: 1440,
            height: 700,
          },
          {
            smartLinks: {
              resolveBeforeMacros: ['jira'],
            },
          },
          undefined,
          undefined,
          true,
        );
        await waitForResolvedInlineCard(page);
        await snapshot(page);
      });
    },
  );

  it('displays request access forbidden links with correct appearance', async () => {
    await initFullPageEditorWithAdf(
      page,
      cardAdfRequestAccess,
      Device.LaptopHiDPI,
      {
        width: 800,
        height: 5300,
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

    await waitForResolvedInlineCard(page, 'forbidden');
    await waitForResolvedBlockCard(page, 'forbidden');
    await waitForResolvedEmbedCard(page, 'forbidden');
    await waitForLoadedImageElements(page, 3000);

    await snapshot(page);
  });

  it('displays selection styles', async () => {
    await initFullPageEditorWithAdf(
      page,
      cardSelectionAdf,
      undefined,
      {
        width: 950,
        height: 1020,
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

    await waitForResolvedInlineCard(page);
    await waitForResolvedBlockCard(page);
    await waitForSuccessfullyResolvedEmbedCard(page);

    await waitForInlineCardSelection(page);
    await page.mouse.move(0, 0);
    await snapshot(page);

    await waitForBlockCardSelection(page, 'resolved');
    await page.mouse.move(0, 0);
    await snapshot(page);

    await waitForEmbedCardSelection(page, 'resolved');
    await page.mouse.move(0, 0);
    await snapshot(page);
  });

  it('displays hover styles', async () => {
    await initFullPageEditorWithAdf(
      page,
      cardSelectionAdf,
      undefined,
      {
        width: 950,
        height: 1020,
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

    await waitForResolvedInlineCard(page);
    await waitForResolvedBlockCard(page);
    await waitForSuccessfullyResolvedEmbedCard(page);

    await page.hover('[data-testid="inline-card-resolved-view"]');
    await snapshot(page);
  });

  [
    [cardAdfBlock, 'regular length title'],
    [cardAdfBlockLongTitle, 'long length title'],
  ].forEach((adf) =>
    it(`displays preview with correct appearance for ${adf[1]}`, async () => {
      await initFullPageEditorWithAdf(
        page,
        adf[0],
        Device.LaptopHiDPI,
        {
          width: 800,
          height: 1500,
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

      await waitForResolvedBlockCard(page);
      await openPreviewState(page);
      await waitForPreviewState(page);
      await snapshot(page);
    }),
  );

  it('should show preview when supported platform matches', async () => {
    await initFullPageEditorWithAdf(
      page,
      cardAdfSupportedPlatforms,
      Device.LaptopHiDPI,
      {
        width: 800,
        height: 1500,
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

    await waitForResolvedBlockCard(page);
    await snapshot(page);
  });

  it('should select card correctly when inside info and layout panel', async () => {
    await initFullPageEditorWithAdf(
      page,
      cardInsideInfoAndLayout,
      Device.LaptopHiDPI,
      {
        width: 800,
        height: 400,
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

    await waitForResolvedInlineCard(page);
    await waitForInlineCardSelection(page);
    await waitForInlineCardSelection(page);
    await waitForInlineCardSelection(page);

    await page.mouse.move(0, 0);
    await snapshot(page);
  });
});
