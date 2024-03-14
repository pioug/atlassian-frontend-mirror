import { snapshotInformational } from '@af/visual-regression';
import {
  RendererBlockCard,
  RendererBlockCardErrored,
  RendererBlockCardForbidden,
  RendererBlockCardNotFound,
  RendererBlockCardResolving,
  RendererBlockCardUnauthorized,
  RendererEmbedCard,
  RendererEmbedCardWide,
  RendererEmbedCardCenterLayout100PercentWidth,
  RendererEmbedCardCenterLayout88PercentWidth,
  RendererEmbedCardCenterLayoutAndNoWidth,
  RendererEmbedCardCenterLayoutNoHeightAndNoMessage100PercentWidth,
  RendererEmbedCardCenterLayoutNoHeightAndNoMessage88PercentWidth,
  RendererEmbedCardCenterLayoutNoHeightAndNoMessageAndNoWidth,
  RendererEmbedCardComplex,
  RendererEmbedCardErrored,
  RendererEmbedCardForbidden,
  RendererEmbedCardNotFound,
  RendererEmbedCardResolving,
  RendererEmbedCardUnauthorized,
  RendererInlineCard,
  RendererInlineCardErrored,
  RendererInlineCardForbidden,
  RendererInlineCardNotFound,
  RendererInlineCardResolving,
  RendererInlineCardUnauthorized,
} from './card.fixtures';

// TODO: UTEST-1409
// Gemini does not allow test that relies on network assets (too Flaky)
// We may need to change the code to enable those tests
snapshotInformational.skip(RendererInlineCard, {});
snapshotInformational(RendererInlineCardResolving, {
  prepare: async (page) => {
    await page
      .getByTestId('inline-card-resolving-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererInlineCardUnauthorized, {
  prepare: async (page) => {
    await page
      .getByTestId('inline-card-unauthorized-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererInlineCardForbidden, {
  prepare: async (page) => {
    await page
      .getByTestId('inline-card-forbidden-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererInlineCardNotFound, {
  prepare: async (page) => {
    await page
      .getByTestId('inline-card-not-found-view')
      .waitFor({ state: 'visible' });
  },
});
// TODO: UTEST-1409
// Gemini does not allow test that relies on network assets (too Flaky)
// We may need to change the code to enable those tests
snapshotInformational.skip(RendererInlineCardErrored, {
  prepare: async (page) => {
    await page
      .getByTestId('inline-card-errored-view')
      .waitFor({ state: 'visible' });
  },
});
// TODO: UTEST-1409
// Gemini does not allow test that relies on network assets (too Flaky)
// We may need to change the code to enable those tests
snapshotInformational.skip(RendererBlockCard, {});
snapshotInformational(RendererBlockCardResolving, {
  prepare: async (page) => {
    await page
      .getByTestId('block-card-resolving-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererBlockCardUnauthorized, {
  prepare: async (page) => {
    await page
      .getByTestId('block-card-unauthorized-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererBlockCardForbidden, {
  prepare: async (page) => {
    await page
      .getByTestId('block-card-forbidden-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererBlockCardNotFound, {
  prepare: async (page) => {
    await page
      .getByTestId('block-card-not-found-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererBlockCardErrored, {
  prepare: async (page) => {
    await page
      .getByTestId('block-card-errored-view')
      .waitFor({ state: 'visible' });
  },
  // TODO: UTEST-1409
  // Gemini does not allow test that relies on network assets (too Flaky)
  // We may need to change the code to enable those tests
});
snapshotInformational.skip(RendererEmbedCard, {});
snapshotInformational(RendererEmbedCardWide, {
  prepare: async (page) => {
    await page
      .getByTestId('embed-card-not-found-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererEmbedCardComplex, {
  prepare: async (page) => {
    await page
      .getByTestId('embed-card-not-found-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererEmbedCardErrored, {
  prepare: async (page) => {
    await page
      .getByTestId('embed-card-errored-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererEmbedCardForbidden, {
  prepare: async (page) => {
    await page
      .getByTestId('embed-card-forbidden-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererEmbedCardNotFound, {
  prepare: async (page) => {
    await page
      .getByTestId('embed-card-not-found-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererEmbedCardResolving, {
  prepare: async (page) => {
    await page
      .getByTestId('embed-card-resolving-view')
      .waitFor({ state: 'visible' });
  },
});
snapshotInformational(RendererEmbedCardUnauthorized, {
  prepare: async (page) => {
    await page
      .getByTestId('embed-card-unauthorized-view')
      .waitFor({ state: 'visible' });
  },
});
// TODO: UTEST-1409
// Gemini does not allow test that relies on network assets (too Flaky)
// We may need to change the code to enable those tests
snapshotInformational.skip(RendererEmbedCardCenterLayoutAndNoWidth, {});
// TODO: UTEST-1409
// Gemini does not allow test that relies on network assets (too Flaky)
// We may need to change the code to enable those tests
snapshotInformational.skip(RendererEmbedCardCenterLayout100PercentWidth, {});
// TODO: UTEST-1409
// Gemini does not allow test that relies on network assets (too Flaky)
// We may need to change the code to enable those tests
snapshotInformational.skip(RendererEmbedCardCenterLayout88PercentWidth, {});
// TODO: UTEST-1409
// Gemini does not allow test that relies on network assets (too Flaky)
// We may need to change the code to enable those tests
snapshotInformational.skip(
  RendererEmbedCardCenterLayoutNoHeightAndNoMessageAndNoWidth,
  {},
);
// TODO: UTEST-1409
// Gemini does not allow test that relies on network assets (too Flaky)
// We may need to change the code to enable those tests
snapshotInformational.skip(
  RendererEmbedCardCenterLayoutNoHeightAndNoMessage100PercentWidth,
  {},
);
// TODO: UTEST-1409
// Gemini does not allow test that relies on network assets (too Flaky)
// We may need to change the code to enable those tests
snapshotInformational.skip(
  RendererEmbedCardCenterLayoutNoHeightAndNoMessage88PercentWidth,
  {},
);
