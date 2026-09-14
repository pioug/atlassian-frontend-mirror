import { snapshot } from '@af/visual-regression';

import {
	SocialProofBlockCardLoading,
	SocialProofBlockCardLowTier,
	SocialProofBlockCardNotLowTier,
} from '../../../examples/vr-block-card-social-proof.vr.ap';
import { BlockCardErrorView } from '../../../examples/vr-block-card/vr-block-card-error.vr.ap';
import { BlockCardForbiddenView } from '../../../examples/vr-block-card/vr-block-card-forbidden.vr.ap';
import {
	BlockCardLazyIcon1,
	BlockCardLazyIcon2,
	BlockCardLazyIcon3,
	BlockCardLazyIcon4,
	BlockCardLazyIcon5,
	BlockCardLazyIcon6,
	BlockCardLazyIconsFileType1,
	BlockCardLazyIconsFileType2,
	BlockCardLazyIconsFileType3,
	BlockCardLazyIconsFileType4,
} from '../../../examples/vr-block-card/vr-block-card-lazy-icons.vr.ap';
import { BlockCardNotFoundSiteAccessExists } from '../../../examples/vr-block-card/vr-block-card-not-found-site-access-exists.vr.ap';
import { BlockCardNotFoundView } from '../../../examples/vr-block-card/vr-block-card-not-found.vr.ap';
import { BlockCardAtlas } from '../../../examples/vr-block-card/vr-block-card-resolved-atlas.vr.ap';
import { BlockCardBitbucket } from '../../../examples/vr-block-card/vr-block-card-resolved-bitbucket.vr.ap';
import { BlockCardConfluence } from '../../../examples/vr-block-card/vr-block-card-resolved-confluence.vr.ap';
import { BlockCardEntities } from '../../../examples/vr-block-card/vr-block-card-resolved-entities.vr.ap';
import BlockCardResolvedIconVariations from '../../../examples/vr-block-card/vr-block-card-resolved-icon-variations.vr.ap';
import { BlockCardJira } from '../../../examples/vr-block-card/vr-block-card-resolved-jira.vr.ap';
import VRBlockCardResolvedRovoActions from '../../../examples/vr-block-card/vr-block-card-resolved-rovo-actions.vr.ap';
import { BlockCardTrello } from '../../../examples/vr-block-card/vr-block-card-resolved-trello-image-preview.vr.ap';
import { BlockCardUnauthorisedMultipleProviders } from '../../../examples/vr-block-card/vr-block-card-unauthorised-multiple-providers.vr.ap';
import { BlockCardUnauthorisedViewWithNoAuth } from '../../../examples/vr-block-card/vr-block-card-unauthorised-no-auth.vr.ap';
import { BlockCardUnauthorisedView } from '../../../examples/vr-block-card/vr-block-card-unauthorised.vr.ap';
import { VRBlockProfileCard } from '../../../examples/vr-block-card/vr-block-profile-card.vr.ap';
import { BlockCardForbiddenViews } from '../../../examples/vr-block-card/vr-flexible-block-card-variants-of-forbidden-views.vr.ap';
import FlexibleUiErroredTitleBlockCompetitorPrompt from '../../../examples/vr-flexible-card/vr-flexible-ui-errored-title-block-competitor-prompt.vr.ap';

snapshot(BlockCardErrorView, {
	description: 'block card error view with design refresh FF',
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardErrorView, {
	description: 'block card error view - linking refresh only',
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardForbiddenView, {
	description: 'block card forbidden view with design refresh FF',
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardForbiddenView, {
	description: 'block card forbidden view - linking refresh only',
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardForbiddenView, {
	waitForReactLazy: true,
});
snapshot(BlockCardNotFoundView, {
	description: 'block card not found view with design refresh FF',
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardNotFoundView, {
	description: 'block card not found view - linking refresh only',
	featureFlags: {},
});
snapshot(BlockCardNotFoundSiteAccessExists, {
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardUnauthorisedView, {
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardUnauthorisedMultipleProviders, {
	description: 'block card unauthorised multiple providers',
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardUnauthorisedMultipleProviders, {
	description: 'block card unauthorised view better hovercard killswitch enabled',
	featureFlags: {
		platform_sl_3p_preauth_better_hovercard_killswitch: true,
		platform_sl_3p_preauth_better_hovercard: true,
	},
	waitForReactLazy: true,
});
snapshot(BlockCardUnauthorisedViewWithNoAuth, {
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardJira, {
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardConfluence, {
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardTrello, {
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardAtlas, {
	featureFlags: {},
	waitForReactLazy: true,
});

snapshot(BlockCardResolvedIconVariations, {
	description:
		'block card resolved icon variations (ResolvedClient iconTestUrls - flexible extractSmartLinkIcon path)',
	featureFlags: {
		platform_sl_3p_preauth_better_hovercard_killswitch: true,
		platform_sl_3p_preauth_better_hovercard: true,
	},
	waitForReactLazy: true,
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'Icon test fixtures use external image URLs; dev build may log load noise',
			jiraIssueId: 'TODO-1',
		},
	],
});
snapshot(BlockCardBitbucket, {
	waitForNetworkIdle: true,
	waitForReactLazy: true,
});
snapshot(BlockCardForbiddenViews, {
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIcon1, {
	description: `block card with lazy load icons, slice 1`,
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIcon2, {
	description: `block card with lazy load icons, slice 2`,
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIcon3, {
	description: `block card with lazy load icons, slice 3`,
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIcon4, {
	description: `block card with lazy load icons, slice 4`,
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIcon5, {
	description: `block card with lazy load icons, slice 5`,
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIcon6, {
	description: `block card with lazy load icons, slice 6`,
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIconsFileType1, {
	description: `block card with lazy load icons per file format, slice 1`,
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIconsFileType2, {
	description: `block card with lazy load icons per file format, slice 2`,
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIconsFileType3, {
	description: `block card with lazy load icons per file format, slice 3`,
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIconsFileType4, {
	description: `block card with lazy load icons per file format, slice 4`,
	waitForReactLazy: true,
});
snapshot(BlockCardEntities, {
	description: `block card with entity support`,
	waitForReactLazy: true,
});

snapshot(SocialProofBlockCardNotLowTier, {
	description: 'block card: social proof message not-low tier',
	featureFlags: {
		'social-proof-3p-unauth-block-fg': true,
	},
	waitForReactLazy: true,
});

snapshot(SocialProofBlockCardLowTier, {
	description: 'block card: social proof message low tier',
	featureFlags: {
		'social-proof-3p-unauth-block-fg': true,
	},
	waitForReactLazy: true,
});

snapshot(SocialProofBlockCardLoading, {
	description: 'block card: social proof cold cache',
	featureFlags: {
		'social-proof-3p-unauth-block-fg': true,
	},
	waitForReactLazy: true,
});

snapshot(VRBlockProfileCard, {
	waitForReactLazy: true,
});

snapshot(FlexibleUiErroredTitleBlockCompetitorPrompt, {
	description: 'block-card-errored-title-block-competitor-prompt',
});

snapshot(VRBlockCardResolvedRovoActions, {
	waitForReactLazy: true,
});
