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
	RendererBlockCardFullWidthLayout,
	RendererBlockCardDefaultWidthLayout,
	RendererBlockCardWideWidthLayout,
	RendererInlineCardRequestAccess,
	RendererInlineCardForbiddenPendingRequestAccess,
	RendererInlineCardRequestAccessForbidden,
	RendererInlineCardRequestAccessDirectAccess,
	RendererInlineCardRequestAccessDeniedRequestExists,
	RendererInlineCardForbiddenRequestApprovedRequestExists,
	RendererInlineCardRequestAccessAccessExists,
	RendererBlockCardRequestAccess,
	RendererBlockCardForbiddenPendingRequestAccess,
	RendererBlockCardRequestAccessForbidden,
	RendererBlockCardRequestAccessDirectAccess,
	RendererBlockCardRequestAccessDeniedRequestExists,
	RendererBlockCardForbiddenRequestApprovedRequestExists,
	RendererBlockCardRequestAccessAccessExists,
	RendererEmbedCardRequestAccess,
	RendererEmbedCardForbiddenPendingRequestAccess,
	RendererEmbedCardRequestAccessForbidden,
	RendererEmbedCardRequestAccessDirectAccess,
	RendererEmbedCardRequestAccessDeniedRequestExists,
	RendererEmbedCardForbiddenRequestApprovedRequestExists,
	RendererEmbedCardRequestAccessAccessExists,
	RendererInlineCardXSS,
	RendererBlockCardXSS,
	RendererEmbedCardXSS,
} from './card.fixtures';

snapshotInformational(RendererInlineCardXSS, {});
snapshotInformational(RendererInlineCard, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-resolved-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererInlineCardResolving, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-resolving-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererInlineCardUnauthorized, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-unauthorized-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererInlineCardForbidden, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererInlineCardNotFound, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-not-found-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererInlineCardErrored, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-errored-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCard, {
	prepare: async (page) => {
		await page.getByTestId('block-card-resolved-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardXSS, {});
snapshotInformational(RendererBlockCardResolving, {
	prepare: async (page) => {
		await page.getByTestId('block-card-resolving-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardUnauthorized, {
	prepare: async (page) => {
		await page.getByTestId('block-card-unauthorized-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardForbidden, {
	prepare: async (page) => {
		await page.getByTestId('block-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardNotFound, {
	prepare: async (page) => {
		await page.getByTestId('block-card-not-found-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardErrored, {
	prepare: async (page) => {
		await page.getByTestId('block-card-errored-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCard, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCard, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
	description: 'renderer embed card hovered',
	states: [
		{
			selector: { byTestId: 'embed-card-resolved-view' },
			state: 'hovered',
		},
	],
});
snapshotInformational(RendererEmbedCardXSS, {});
snapshotInformational(RendererEmbedCardWide, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-not-found-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardComplex, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-not-found-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardErrored, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-errored-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardForbidden, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardNotFound, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-not-found-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardResolving, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolving-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardUnauthorized, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-unauthorized-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardFullWidthLayout, {
	prepare: async (page) => {
		await page.getByTestId('renderer-datasource-table').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardDefaultWidthLayout, {
	prepare: async (page) => {
		await page.getByTestId('renderer-datasource-table').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardWideWidthLayout, {
	prepare: async (page) => {
		await page.getByTestId('renderer-datasource-table').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardCenterLayoutAndNoWidth, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardCenterLayout100PercentWidth, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardCenterLayout88PercentWidth, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardCenterLayoutNoHeightAndNoMessageAndNoWidth, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardCenterLayoutNoHeightAndNoMessage100PercentWidth, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
});

snapshotInformational(RendererEmbedCardCenterLayoutNoHeightAndNoMessage88PercentWidth, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
});

snapshotInformational(RendererInlineCardRequestAccess, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererInlineCardForbiddenPendingRequestAccess, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererInlineCardRequestAccessForbidden, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererInlineCardRequestAccessDirectAccess, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererInlineCardRequestAccessDeniedRequestExists, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererInlineCardForbiddenRequestApprovedRequestExists, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererInlineCardRequestAccessAccessExists, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
});

snapshotInformational(RendererBlockCardRequestAccess, {
	prepare: async (page) => {
		await page.getByTestId('block-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardForbiddenPendingRequestAccess, {
	prepare: async (page) => {
		await page.getByTestId('block-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardRequestAccessForbidden, {
	prepare: async (page) => {
		await page.getByTestId('block-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardRequestAccessDirectAccess, {
	prepare: async (page) => {
		await page.getByTestId('block-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardRequestAccessDeniedRequestExists, {
	prepare: async (page) => {
		await page.getByTestId('block-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardForbiddenRequestApprovedRequestExists, {
	prepare: async (page) => {
		await page.getByTestId('block-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererBlockCardRequestAccessAccessExists, {
	prepare: async (page) => {
		await page.getByTestId('block-card-forbidden-view').waitFor({ state: 'visible' });
	},
});

snapshotInformational(RendererEmbedCardRequestAccess, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardForbiddenPendingRequestAccess, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardRequestAccessForbidden, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardRequestAccessDirectAccess, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardRequestAccessDeniedRequestExists, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardForbiddenRequestApprovedRequestExists, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
snapshotInformational(RendererEmbedCardRequestAccessAccessExists, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
});
