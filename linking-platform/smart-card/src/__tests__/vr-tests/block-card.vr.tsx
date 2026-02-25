import { snapshot } from '@af/visual-regression';

import { BlockCardErrorView } from '../../../examples/vr-block-card/vr-block-card-error';
import { BlockCardForbiddenView } from '../../../examples/vr-block-card/vr-block-card-forbidden';
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
} from '../../../examples/vr-block-card/vr-block-card-lazy-icons';
import { BlockCardNotFoundView } from '../../../examples/vr-block-card/vr-block-card-not-found';
import { BlockCardNotFoundSiteAccessExists } from '../../../examples/vr-block-card/vr-block-card-not-found-site-access-exists';
import { BlockCardAtlas } from '../../../examples/vr-block-card/vr-block-card-resolved-atlas';
import { BlockCardBitbucket } from '../../../examples/vr-block-card/vr-block-card-resolved-bitbucket';
import { BlockCardConfluence } from '../../../examples/vr-block-card/vr-block-card-resolved-confluence';
import { BlockCardEntities } from '../../../examples/vr-block-card/vr-block-card-resolved-entities';
import { BlockCardJira } from '../../../examples/vr-block-card/vr-block-card-resolved-jira';
import { BlockCardTrello } from '../../../examples/vr-block-card/vr-block-card-resolved-trello-image-preview';
import { BlockCardUnauthorisedView } from '../../../examples/vr-block-card/vr-block-card-unauthorised';
import { BlockCardUnauthorisedNewDesign } from '../../../examples/vr-block-card/vr-block-card-unauthorised-new-design';
import { BlockCardUnauthorisedViewWithNoAuth } from '../../../examples/vr-block-card/vr-block-card-unauthorised-no-auth';
import { VRBlockProfileCard } from '../../../examples/vr-block-card/vr-block-profile-card';
import { BlockCardForbiddenViews } from '../../../examples/vr-block-card/vr-flexible-block-card-variants-of-forbidden-views';
import FlexibleUiErroredTitleBlockCompetitorPrompt from '../../../examples/vr-flexible-card/vr-flexible-ui-errored-title-block-competitor-prompt';

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
snapshot(BlockCardUnauthorisedNewDesign, {
	description: 'block card unauthorised view with experiment',
	featureFlags: {
		platform_sl_3p_unauth_paste_as_block_card: [
			'control',
			'card_by_default_only',
			'card_by_default_and_new_design',
		],
		'navx-3264-refactoring-unauth-provider-images-fe': true,
	},
	waitForReactLazy: true,
});
snapshot(BlockCardUnauthorisedViewWithNoAuth, {
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardJira, {
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(BlockCardConfluence, {
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
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
snapshot(BlockCardBitbucket, {
	featureFlags: {},
	waitForNetworkIdle: true,
	waitForReactLazy: true,
});
snapshot(BlockCardForbiddenViews, {
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIcon1, {
	description: `block card with lazy load icons, slice 1`,
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIcon2, {
	description: `block card with lazy load icons, slice 2`,
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIcon3, {
	description: `block card with lazy load icons, slice 3`,
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIcon4, {
	description: `block card with lazy load icons, slice 4`,
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIcon5, {
	description: `block card with lazy load icons, slice 5`,
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIcon6, {
	description: `block card with lazy load icons, slice 6`,
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIconsFileType1, {
	description: `block card with lazy load icons per file format, slice 1`,
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIconsFileType2, {
	description: `block card with lazy load icons per file format, slice 2`,
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIconsFileType3, {
	description: `block card with lazy load icons per file format, slice 3`,
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardLazyIconsFileType4, {
	description: `block card with lazy load icons per file format, slice 4`,
	featureFlags: {},
	waitForReactLazy: true,
});
snapshot(BlockCardEntities, {
	description: `block card with entity support`,
	featureFlags: {},
	waitForReactLazy: true,
});

snapshot(VRBlockProfileCard, {
	featureFlags: {},
	waitForReactLazy: true,
});

snapshot(FlexibleUiErroredTitleBlockCompetitorPrompt, {
	description: 'block-card-errored-title-block-competitor-prompt',
});
