import {
  waitForLoadedImageElements,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';
import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/embed-card-layouts-adf.json';
import containerADF from './__fixtures__/embed-containers.adf.json';
import {
  embedCardSelector,
  embedCombinationsWithTitle,
  generateEmbedCombinationAdf,
  waitForSuccessfullyResolvedEmbedCard,
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
        UNSAFE_cards: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    );
    await waitForElementCount(page, embedCardSelector(), 6);
    await waitForSuccessfullyResolvedEmbedCard(page, 6);
    await waitForLoadedImageElements(page, 3000);
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
        UNSAFE_cards: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    );

    await waitForSuccessfullyResolvedEmbedCard(page);
    await waitForLoadedImageElements(page, 3000);
    await snapshot(page);
  });

  [true, false].forEach(allowResizing =>
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
            UNSAFE_cards: {
              resolveBeforeMacros: ['jira'],
              allowBlockCards: true,
              allowEmbeds: true,
              allowResizing,
            },
          },
        );

        await waitForSuccessfullyResolvedEmbedCard(page, 2);
        await waitForLoadedImageElements(page, 3000);
        await snapshot(page);
      },
    ),
  );
});
