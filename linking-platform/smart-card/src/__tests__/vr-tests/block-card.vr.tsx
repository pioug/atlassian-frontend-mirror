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

snapshot(BlockCardErrorView);
snapshot(BlockCardForbiddenView);
snapshot(BlockCardNotFoundView);
snapshot(BlockCardNotFoundSiteAccessExists);
snapshot(BlockCardUnauthorisedView);
snapshot(BlockCardUnauthorisedViewWithNoAuth);
snapshot(BlockCardJira);
snapshot(BlockCardConfluence);
snapshot(BlockCardTrello);
snapshot(BlockCardAtlas);
snapshot(BlockCardBitbucket);
snapshot(BlockCardForbiddenViews);
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
