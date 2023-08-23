import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  evaluateTeardownMockDate,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  Appearance,
  initEditorWithAdf,
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import cardAdf from './__fixtures__/card-adf.json';
import cardSelectionAdf from './__fixtures__/card-selection-adf.json';
import cardAdfRequestAccess from './__fixtures__/card-request-access.adf.json';
import cardAdfBlock from './__fixtures__/card-adf.block.json';
import cardAdfSupportedPlatforms from './__fixtures__/card-adf.supported-platforms.json';
import cardAdfBlockLongTitle from './__fixtures__/card-adf-long-title.block.json';
import cardAdfDatasource from './__fixtures__/card-datasource.adf.json';
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
  waitForDatasourceTableView,
} from '@atlaskit/media-integration-test-helpers';
import { contexts } from './__helpers__/card-utils';

const themes = ['light', 'dark'];

function getMode(theme: any) {
  return theme === 'light' ? 'light' : 'dark';
}

describe('Cards:', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  describe.each(themes)('Theme: %s', (theme) => {
    // FIXME: This test was manually skipped due to failure on 23/08/2023: https://product-fabric.atlassian.net/browse/ED-19657
    describe.skip.each([
      Appearance.fullPage,
      Appearance.fullWidth,
      Appearance.comment,
      Appearance.chromeless,
      Appearance.mobile,
    ])('with %s editor', (appearance) => {
      it('displays links with correct appearance', async () => {
        await initEditorWithAdf(page, {
          adf: cardAdf,
          appearance,
          device: Device.LaptopHiDPI,
          viewport: {
            width: 800,
            height: 4500,
          },
          editorProps: {
            smartLinks: {
              resolveBeforeMacros: ['jira'],
              allowBlockCards: true,
              allowEmbeds: true,
            },
          },
          mode: getMode(theme),
          forceReload: true,
        });

        await evaluateTeardownMockDate(page);

        // Render an assortment of inline cards.
        await waitForResolvedInlineCard(page);
        await waitForResolvedInlineCard(page, 'resolving');
        await waitForResolvedInlineCard(page, 'unauthorized');
        await waitForResolvedInlineCard(page, 'forbidden');
        await waitForResolvedInlineCard(page, 'not_found');
        await waitForResolvedInlineCard(page, 'errored');

        // Render an assortment of block cards.
        await waitForResolvedBlockCard(page);
        await waitForResolvedBlockCard(page, 'resolving');
        await waitForResolvedBlockCard(page, 'unauthorized');
        await waitForResolvedBlockCard(page, 'forbidden');
        await waitForResolvedBlockCard(page, 'not_found');
        await waitForResolvedBlockCard(page, 'errored');

        // Render an assortment of embed cards.
        await waitForSuccessfullyResolvedEmbedCard(page);
        await waitForResolvedEmbedCard(page, 'resolving');
        await waitForResolvedEmbedCard(page, 'unauthorized');
        await waitForResolvedEmbedCard(page, 'forbidden');
        await waitForResolvedEmbedCard(page, 'not_found');
        await waitForResolvedEmbedCard(page, 'errored');

        // Ensure all images have finished loading on the page.
        await waitForLoadedImageElements(page, 3000);

        await snapshot(page);
      });

      if (appearance !== Appearance.mobile) {
        it('displays datasource on non-mobile editors', async () => {
          await initEditorWithAdf(page, {
            adf: cardAdfDatasource,
            appearance,
            device: Device.LaptopHiDPI,
            viewport: {
              width: 2400,
              height: 1200,
            },
            editorProps: {
              smartLinks: {
                allowBlockCards: true,
                allowDatasource: true,
              },
            },
            mode: getMode(theme),
            forceReload: true,
            platformFeatureFlags: {
              'platform.linking-platform.datasource-jira_issues': true,
            },
            datasourceMocks: {
              shouldMockORSBatch: true,
              initialVisibleColumnKeys: [
                'type',
                'assignee',
                'summary',
                'description',
              ],
            },
          });

          await evaluateTeardownMockDate(page);

          // Render an assortment of inline cards.
          await waitForDatasourceTableView(page);
          await snapshot(page);
        });
      } else {
        it('displays inline fallback instead of datasource tables on mobile', async () => {
          await initEditorWithAdf(page, {
            adf: cardAdfDatasource,
            appearance,
            device: Device.LaptopHiDPI,
            viewport: {
              width: 800,
              height: 400,
            },
            editorProps: {
              smartLinks: {
                allowBlockCards: true,
                allowDatasource: true,
              },
            },
            mode: getMode(theme),
            forceReload: true,
            platformFeatureFlags: {
              'platform.linking-platform.datasource-jira_issues': true,
            },
            datasourceMocks: {
              shouldMockORSBatch: true,
              initialVisibleColumnKeys: [
                'type',
                'assignee',
                'summary',
                'description',
              ],
            },
          });

          await evaluateTeardownMockDate(page);

          // Render an assortment of inline cards.
          await waitForResolvedInlineCard(page, 'resolved');
          await snapshot(page);
        });
      }
    });
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
