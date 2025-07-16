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
import { BlockCardUnauthorisedViewWithNoAuth } from '../../../examples/vr-block-card/vr-block-card-unauthorised-no-auth';
import { VRBlockProfileCard } from '../../../examples/vr-block-card/vr-block-profile-card';
import { BlockCardForbiddenViews } from '../../../examples/vr-block-card/vr-flexible-block-card-variants-of-forbidden-views';

snapshot(BlockCardErrorView, {
	description: 'block card error view with design refresh FF',
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
});
snapshot(BlockCardErrorView, {
	description: 'block card error view with design refresh FF only',
	featureFlags: {
		'platform-visual-refresh-icons': [true, false],
	},
});
snapshot(BlockCardErrorView, {
	description: 'block card error view - linking refresh only',
	featureFlags: {},
});
snapshot(BlockCardForbiddenView, {
	description: 'block card forbidden view with design refresh FF',
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
});
snapshot(BlockCardForbiddenView, {
	description: 'block card forbidden view with design refresh FF only',
	featureFlags: {
		'platform-visual-refresh-icons': [true, false],
	},
});
snapshot(BlockCardForbiddenView, {
	description: 'block card forbidden view - linking refresh only',
	featureFlags: {},
});
snapshot(BlockCardForbiddenView);
snapshot(BlockCardNotFoundView, {
	description: 'block card not found view with design refresh FF',
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
});
snapshot(BlockCardNotFoundView, {
	description: 'block card not found view with design refresh FF only',
	featureFlags: {
		'platform-visual-refresh-icons': [true, false],
	},
});
snapshot(BlockCardNotFoundView, {
	description: 'block card not found view - linking refresh only',
	featureFlags: {},
});
snapshot(BlockCardNotFoundSiteAccessExists, {
	featureFlags: {},
});
snapshot(BlockCardUnauthorisedView, {
	featureFlags: {},
});
snapshot(BlockCardUnauthorisedViewWithNoAuth, {
	featureFlags: {},
});
snapshot(BlockCardJira, {
	featureFlags: {
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
		'platform-linking-enable-avatar-data-separator': [true, false],
	},
});
snapshot(BlockCardConfluence, {
	featureFlags: {
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
		'platform-linking-enable-avatar-data-separator': [true, false],
	},
});
snapshot(BlockCardTrello, {
	featureFlags: {
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
		'platform-linking-enable-avatar-data-separator': [true, false],
	},
});
snapshot(BlockCardAtlas, {
	featureFlags: {
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
		'platform-linking-enable-avatar-data-separator': [true, false],
	},
});
snapshot(BlockCardBitbucket, {
	featureFlags: {
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
		'platform-linking-enable-avatar-data-separator': [true, false],
	},
});
snapshot(BlockCardForbiddenViews, {
	featureFlags: {},
});
snapshot(BlockCardLazyIcon1, {
	description: `block card with lazy load icons, slice 1`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
		'platform-linking-enable-avatar-data-separator': [true, false],
	},
});
snapshot(BlockCardLazyIcon2, {
	description: `block card with lazy load icons, slice 2`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
		'platform-linking-enable-avatar-data-separator': [true, false],
	},
});
snapshot(BlockCardLazyIcon3, {
	description: `block card with lazy load icons, slice 3`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
		'platform-linking-enable-avatar-data-separator': [true, false],
	},
});
snapshot(BlockCardLazyIcon4, {
	description: `block card with lazy load icons, slice 4`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
		'platform-linking-enable-avatar-data-separator': [true, false],
	},
});
snapshot(BlockCardLazyIcon5, {
	description: `block card with lazy load icons, slice 5`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
		'platform-linking-enable-avatar-data-separator': [true, false],
	},
});
snapshot(BlockCardLazyIcon6, {
	description: `block card with lazy load icons, slice 6`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
	},
});
snapshot(BlockCardLazyIconsFileType1, {
	description: `block card with lazy load icons per file format, slice 1`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
		'platform-linking-enable-avatar-data-separator': [true, false],
	},
});
snapshot(BlockCardLazyIconsFileType2, {
	description: `block card with lazy load icons per file format, slice 2`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
		'platform-linking-enable-avatar-data-separator': [true, false],
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
	},
});
snapshot(BlockCardLazyIconsFileType3, {
	description: `block card with lazy load icons per file format, slice 3`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
		'platform-linking-enable-avatar-data-separator': [true, false],
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
	},
});
snapshot(BlockCardLazyIconsFileType4, {
	description: `block card with lazy load icons per file format, slice 4`,
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'icon-object-migration': true,
		'platform-linking-enable-avatar-data-separator': [true, false],
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
	},
});
snapshot(BlockCardEntities, {
	description: `block card with entity support`,
	featureFlags: {
		smart_links_noun_support: true,
		'platform-linking-enable-avatar-data-separator': [true, false],
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
	},
});

snapshot(VRBlockProfileCard, {
	featureFlags: {
		'platform-linking-fix-smart-card-avatar-overrides': [true, false],
	},
});
