import {
  waitForLoadedImageElements,
  waitForElementCount,
  evaluateTeardownMockDate,
  waitForElementCountTimeouts,
} from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/embed-card-layouts-adf.json';
import containerADF from './__fixtures__/embed-containers.adf.json';
import embedSeperatorADF from './__fixtures__/embed-card-inside-expand.adf.json';
import embedTableADF from './__fixtures__/embed-card-inside-table.adf.json';
import {
  embedCardSelector,
  embedCombinationsWithTitle,
  generateEmbedCombinationAdf,
  waitForSuccessfullyResolvedEmbedCard,
  waitForEmbedCardSelection,
} from '@atlaskit/media-integration-test-helpers';

describe('Embed Cards:', () => {
  it('displays embed properly with different layouts', async () => {
    const { page } = global;

    await initFullPageEditorWithAdf(
      page,
      adf,
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
      undefined,
      undefined,
      true,
    );
    await evaluateTeardownMockDate(page);
    await waitForElementCount(page, embedCardSelector(), 6, {
      timeout: waitForElementCountTimeouts.LONG,
    });
    await waitForSuccessfullyResolvedEmbedCard(page, 6);
    await waitForLoadedImageElements(page, waitForElementCountTimeouts.LONG);

    // wait for iframes to be loaded
    await waitForElementCount(page, '[originalheight="282"]', 5, {
      timeout: waitForElementCountTimeouts.LONG,
    });
    await waitForElementCount(page, '[originalheight="316"]', 1, {
      timeout: waitForElementCountTimeouts.LONG,
    });
    await waitForElementCount(page, '[data-iframe-loaded="true"]', 6, {
      timeout: waitForElementCountTimeouts.LONG,
    });
    await snapshot(page);
  });

  it('does not overflow its container nodes like layouts when its wide', async () => {
    const page = global.page;

    await initFullPageEditorWithAdf(
      page,
      containerADF,
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
      undefined,
      undefined,
      true,
    );
    await evaluateTeardownMockDate(page);

    await waitForSuccessfullyResolvedEmbedCard(page);
    await waitForLoadedImageElements(page, 3000);
    await snapshot(page);
  });

  [true, false].forEach((allowResizing) =>
    it.each(embedCombinationsWithTitle)(
      `should render embeds with and without dynamic height control when resizing is ${
        !allowResizing ? 'not' : ''
      } allowed with %s`,
      async (condition, attributes) => {
        const { page } = global;

        await initFullPageEditorWithAdf(
          page,
          generateEmbedCombinationAdf([condition, attributes]),
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
              allowResizing,
            },
          },
          undefined,
          undefined,
          true,
        );
        await evaluateTeardownMockDate(page);

        await waitForSuccessfullyResolvedEmbedCard(page, 2);
        await waitForLoadedImageElements(page, 3000);
        await snapshot(page);
      },
    ),
  );

  it('displays embed card in table correctly', async () => {
    const { page } = global;

    await initFullPageEditorWithAdf(
      page,
      embedTableADF,
      Device.LaptopHiDPI,
      {
        width: 1440,
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

    await waitForSuccessfullyResolvedEmbedCard(page);
    await waitForLoadedImageElements(page, 3000);
    await snapshot(page);
  });
});

it('Seperators are in correct locations in the toolbar', async () => {
  const page = global.page;

  await initFullPageEditorWithAdf(
    page,
    embedSeperatorADF,
    Device.LaptopHiDPI,
    {
      width: 900,
      height: 700,
    },
    {
      smartLinks: {
        resolveBeforeMacros: ['jira'],
        allowBlockCards: true,
        allowEmbeds: true,
      },
    },
  );

  await waitForSuccessfullyResolvedEmbedCard(page);
  await waitForEmbedCardSelection(page);
  await snapshot(page);
});
