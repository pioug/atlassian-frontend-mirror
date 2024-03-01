import { snapshotInformational } from '@af/visual-regression';
import {
  RendererBlockCard,
  RendererBlockCardErrored,
  RendererBlockCardForbidden,
  RendererBlockCardNotFound,
  RendererBlockCardResolving,
  RendererBlockCardUnauthorized,
  RendererEmbedCard,
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
snapshotInformational.skip(RendererInlineCardResolving, {});
snapshotInformational.skip(RendererInlineCardUnauthorized, {});
snapshotInformational.skip(RendererInlineCardForbidden, {});
snapshotInformational.skip(RendererInlineCardNotFound, {});
snapshotInformational.skip(RendererInlineCardErrored, {});
snapshotInformational.skip(RendererBlockCard, {});
snapshotInformational.skip(RendererBlockCardResolving, {});
snapshotInformational.skip(RendererBlockCardUnauthorized, {});
snapshotInformational.skip(RendererBlockCardForbidden, {});
snapshotInformational.skip(RendererBlockCardNotFound, {});
snapshotInformational.skip(RendererBlockCardErrored, {});
snapshotInformational.skip(RendererEmbedCard, {});
snapshotInformational.skip(RendererEmbedCardComplex, {});
snapshotInformational.skip(RendererEmbedCardErrored, {});
snapshotInformational.skip(RendererEmbedCardForbidden, {});
snapshotInformational.skip(RendererEmbedCardNotFound, {});
snapshotInformational.skip(RendererEmbedCardResolving, {});
snapshotInformational.skip(RendererEmbedCardUnauthorized, {});
snapshotInformational.skip(RendererEmbedCardCenterLayoutAndNoWidth, {});
snapshotInformational.skip(RendererEmbedCardCenterLayout100PercentWidth, {});
snapshotInformational.skip(RendererEmbedCardCenterLayout88PercentWidth, {});
snapshotInformational.skip(
  RendererEmbedCardCenterLayoutNoHeightAndNoMessageAndNoWidth,
  {},
);
snapshotInformational.skip(
  RendererEmbedCardCenterLayoutNoHeightAndNoMessage100PercentWidth,
  {},
);
snapshotInformational.skip(
  RendererEmbedCardCenterLayoutNoHeightAndNoMessage88PercentWidth,
  {},
);
