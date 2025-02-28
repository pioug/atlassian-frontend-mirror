import { snapshot } from '@af/visual-regression';

import { BlockCardErrorView } from '../../../examples/vr-block-card/vr-block-card-error';
import { BlockCardForbiddenView } from '../../../examples/vr-block-card/vr-block-card-forbidden';
import {
	BlockCardLazyIcons,
	BlockCardLazyIconsFileType,
} from '../../../examples/vr-block-card/vr-block-card-lazy-icons';
import { BlockCardNotFoundView } from '../../../examples/vr-block-card/vr-block-card-not-found';
import { BlockCardNotFoundSiteAccessExists } from '../../../examples/vr-block-card/vr-block-card-not-found-site-access-exists';
import { BlockCardAtlas } from '../../../examples/vr-block-card/vr-block-card-resolved-atlas';
import { BlockCardBitbucket } from '../../../examples/vr-block-card/vr-block-card-resolved-bitbucket';
import { BlockCardConfluence } from '../../../examples/vr-block-card/vr-block-card-resolved-confluence';
import { BlockCardJira } from '../../../examples/vr-block-card/vr-block-card-resolved-jira';
import { BlockCardTrello } from '../../../examples/vr-block-card/vr-block-card-resolved-trello-image-preview';
import { BlockCardUnauthorisedView } from '../../../examples/vr-block-card/vr-block-card-unauthorised';
import { BlockCardUnauthorisedViewWithNoAuth } from '../../../examples/vr-block-card/vr-block-card-unauthorised-no-auth';
import { BlockCardForbiddenViews } from '../../../examples/vr-block-card/vr-flexible-block-card-variants-of-forbidden-views';

snapshot(BlockCardErrorView, {
	description: 'block card error view with design refresh FF and compiled FF on',
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'platform-smart-card-icon-migration': true,
		'bandicoots-compiled-migration-smartcard': true,
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(BlockCardErrorView, {
	description: 'block card error view with design refresh FF only',
	featureFlags: {
		'platform-visual-refresh-icons': [true, false],
		'platform-smart-card-icon-migration': [true, false],
	},
});
snapshot(BlockCardErrorView, {
	description: 'block card error view with compiled FF only',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardErrorView, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardForbiddenView, {
	description: 'block card forbidden view with design refresh FF and compiled FF on',
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'platform-smart-card-icon-migration': true,
		'bandicoots-compiled-migration-smartcard': true,
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(BlockCardForbiddenView, {
	description: 'block card forbidden view with design refresh FF only',
	featureFlags: {
		'platform-visual-refresh-icons': [true, false],
		'platform-smart-card-icon-migration': [true, false],
	},
});
snapshot(BlockCardForbiddenView, {
	description: 'block card forbidden view with compiled FF only',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardForbiddenView);
snapshot(BlockCardNotFoundView, {
	description: 'block card not found view with design refresh FF and compiled FF on',
	featureFlags: {
		'platform-visual-refresh-icons': true,
		'platform-smart-card-icon-migration': true,
		'bandicoots-compiled-migration-smartcard': true,
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(BlockCardNotFoundView, {
	description: 'block card not found view with design refresh FF only',
	featureFlags: {
		'platform-visual-refresh-icons': [true, false],
		'platform-smart-card-icon-migration': [true, false],
	},
});
snapshot(BlockCardNotFoundView, {
	description: 'block card not found view with compiled FF only',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardNotFoundView, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardNotFoundSiteAccessExists, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardUnauthorisedView, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(BlockCardUnauthorisedView, {
	description:
		'BlockCardUnauthorisedView Old - remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': false,
	},
});
snapshot(BlockCardUnauthorisedViewWithNoAuth, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardJira, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardConfluence, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardTrello, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardAtlas, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardBitbucket, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardForbiddenViews, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
snapshot(BlockCardLazyIcons, {
	description: `block card with lazy load icons`,
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-visual-refresh-icons': true,
		'platform-smart-card-icon-migration': true,
		'icon-object-migration': true,
	},
});

snapshot(BlockCardLazyIconsFileType, {
	description: `block card with lazy load icons per file format`,
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': true,
		'platform-visual-refresh-icons': true,
		'platform-smart-card-icon-migration': true,
		'icon-object-migration': true,
	},
});
