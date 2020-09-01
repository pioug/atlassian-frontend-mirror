import {
  waitForLoadedImageElements,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';
import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/embed-card-layouts-adf.json';
import containerADF from './__fixtures__/embed-containers.adf.json';
import {
  waitForResolvedEmbedCard,
  embedCardSelector,
} from '@atlaskit/media-integration-test-helpers';

describe('Embed Cards:', () => {
  it('displays embed properly with different layouts', async () => {
    const { page } = global;

    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI, undefined, {
      UNSAFE_cards: {
        resolveBeforeMacros: ['jira'],
        allowBlockCards: true,
        allowEmbeds: true,
      },
    });
    await page.setViewport({
      width: 1440,
      height: 4000,
    });
    await waitForResolvedEmbedCard(page);
    await waitForElementCount(page, embedCardSelector(), 6);
    await waitForLoadedImageElements(page, 3000);
    await snapshot(page);
  });

  it('does not overflow its container nodes like layouts when its wide', async () => {
    const page = global.page;

    await initFullPageEditorWithAdf(
      page,
      containerADF,
      Device.LaptopHiDPI,
      undefined,
      {
        UNSAFE_cards: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    );
    await page.setViewport({
      width: 1440,
      height: 4000,
    });
    await waitForResolvedEmbedCard(page);
    await waitForLoadedImageElements(page, 3000);
    await snapshot(page);
  });
});
