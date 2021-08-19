import {
  waitForLoadedImageElements,
  waitForElementCount,
  evaluateTeardownMockDate,
} from '@atlaskit/visual-regression/helper';
import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/embed-card-layouts-adf.json';
import containerADF from './__fixtures__/embed-containers.adf.json';
import embedSeperatorADF from './__fixtures__/embed-card-inside-expand.adf.json';
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
    await waitForElementCount(page, embedCardSelector(), 6);
    await waitForSuccessfullyResolvedEmbedCard(page, 6);
    await waitForLoadedImageElements(page, 3000);

    // wait for iframes to be loaded
    await waitForElementCount(page, '[originalheight="282"]', 5);
    await waitForElementCount(page, '[originalheight="319"]', 1);
    await waitForElementCount(page, '[data-iframe-loaded="true"]', 6);
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
    // TODO: https://product-fabric.atlassian.net/browse/ED-13527
    it.skip.each(embedCombinationsWithTitle)(
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
});
// FIXME: Test became inconsistent after Puppeteer's upgrade
it.skip('Seperators are in correct locations in the toolbar', async () => {
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
