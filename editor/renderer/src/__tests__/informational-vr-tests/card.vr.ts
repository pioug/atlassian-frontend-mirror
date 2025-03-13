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

snapshotInformational(RendererInlineCardXSS, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererInlineCard, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-resolved-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererInlineCardResolving, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-resolving-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererInlineCardUnauthorized, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-unauthorized-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererInlineCardForbidden, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererInlineCardNotFound, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-not-found-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererInlineCardErrored, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-errored-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererBlockCard, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-resolved-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshotInformational(RendererBlockCardXSS, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshotInformational(RendererBlockCardResolving, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-resolving-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshotInformational(RendererBlockCardUnauthorized, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-unauthorized-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

snapshotInformational(RendererBlockCardUnauthorized, {
	description:
		'renderer block card unauthorized - OLD remove when cleaning platform-linking-visual-refresh-v1',
	prepare: async (page) => {
		await page.getByTestId('smart-block-unauthorized-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererBlockCardForbidden, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshotInformational(RendererBlockCardNotFound, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-not-found-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshotInformational(RendererBlockCardErrored, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-errored-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshotInformational(RendererEmbedCard, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
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
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardXSS, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardWide, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-not-found-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardComplex, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-not-found-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardErrored, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-errored-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardForbidden, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardNotFound, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-not-found-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardResolving, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolving-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardUnauthorized, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-unauthorized-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'bandicoots-compiled-migration-smartcard': true,
	},
});
snapshotInformational(RendererEmbedCardUnauthorized, {
	description:
		'renderer embed card unauthorized - OLD remove when cleaning platform-linking-visual-refresh-v1',
	prepare: async (page) => {
		await page.getByTestId('embed-card-unauthorized-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'bandicoots-compiled-migration-smartcard': false,
	},
});
snapshotInformational(RendererBlockCardFullWidthLayout, {
	prepare: async (page) => {
		await page.getByTestId('renderer-datasource-table').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererBlockCardDefaultWidthLayout, {
	prepare: async (page) => {
		await page.getByTestId('renderer-datasource-table').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererBlockCardWideWidthLayout, {
	prepare: async (page) => {
		await page.getByTestId('renderer-datasource-table').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardCenterLayoutAndNoWidth, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardCenterLayout100PercentWidth, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardCenterLayout88PercentWidth, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardCenterLayoutNoHeightAndNoMessageAndNoWidth, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardCenterLayoutNoHeightAndNoMessage100PercentWidth, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

snapshotInformational(RendererEmbedCardCenterLayoutNoHeightAndNoMessage88PercentWidth, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-resolved-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

snapshotInformational(RendererInlineCardRequestAccess, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererInlineCardForbiddenPendingRequestAccess, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererInlineCardRequestAccessForbidden, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererInlineCardRequestAccessDirectAccess, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererInlineCardRequestAccessDeniedRequestExists, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererInlineCardForbiddenRequestApprovedRequestExists, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererInlineCardRequestAccessAccessExists, {
	prepare: async (page) => {
		await page.getByTestId('inline-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

snapshotInformational(RendererBlockCardRequestAccess, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshotInformational(RendererBlockCardForbiddenPendingRequestAccess, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshotInformational(RendererBlockCardRequestAccessForbidden, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshotInformational(RendererBlockCardRequestAccessDirectAccess, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshotInformational(RendererBlockCardRequestAccessDeniedRequestExists, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshotInformational(RendererBlockCardForbiddenRequestApprovedRequestExists, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshotInformational(RendererBlockCardRequestAccessAccessExists, {
	prepare: async (page) => {
		await page.getByTestId('smart-block-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshotInformational(RendererEmbedCardRequestAccess, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardForbiddenPendingRequestAccess, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardRequestAccessForbidden, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardRequestAccessDirectAccess, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardRequestAccessDeniedRequestExists, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardForbiddenRequestApprovedRequestExists, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
snapshotInformational(RendererEmbedCardRequestAccessAccessExists, {
	prepare: async (page) => {
		await page.getByTestId('embed-card-forbidden-view').waitFor({ state: 'visible' });
	},
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
