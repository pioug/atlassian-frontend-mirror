import { snapshot } from '@af/visual-regression';

import {
	BlockCardErrorView,
	BlockCardErrorViewLegacy,
} from '../../../examples/vr-block-card/vr-block-card-error';
import {
	BlockCardForbiddenView,
	BlockCardForbiddenViewLegacy,
} from '../../../examples/vr-block-card/vr-block-card-forbidden';
import {
	BlockCardNotFoundView,
	BlockCardNotFoundViewLegacy,
} from '../../../examples/vr-block-card/vr-block-card-not-found';
import {
	BlockCardNotFoundSiteAccessExists,
	BlockCardNotFoundSiteAccessExistsLegacy,
} from '../../../examples/vr-block-card/vr-block-card-not-found-site-access-exists';
import {
	BlockCardAtlas,
	BlockCardAtlasLegacy,
} from '../../../examples/vr-block-card/vr-block-card-resolved-atlas';
import {
	BlockCardBitbucket,
	BlockCardBitbucketLegacy,
} from '../../../examples/vr-block-card/vr-block-card-resolved-bitbucket';
import {
	BlockCardConfluence,
	BlockCardConfluenceLegacy,
} from '../../../examples/vr-block-card/vr-block-card-resolved-confluence';
import {
	BlockCardJira,
	BlockCardJiraLegacy,
} from '../../../examples/vr-block-card/vr-block-card-resolved-jira';
import {
	BlockCardTrello,
	BlockCardTrelloLegacy,
} from '../../../examples/vr-block-card/vr-block-card-resolved-trello-image-preview';
import {
	BlockCardUnauthorisedView,
	BlockCardUnauthorisedViewLegacy,
} from '../../../examples/vr-block-card/vr-block-card-unauthorised';
import {
	BlockCardUnauthorisedViewWithNoAuth,
	BlockCardUnauthorisedViewWithNoAuthLegacy,
} from '../../../examples/vr-block-card/vr-block-card-unauthorised-no-auth';
import {
	BlockCardForbiddenViews,
	BlockCardForbiddenViewsLegacy,
} from '../../../examples/vr-block-card/vr-flexible-block-card-variants-of-forbidden-views';

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

snapshot(BlockCardErrorViewLegacy);
snapshot(BlockCardForbiddenViewLegacy);
snapshot(BlockCardNotFoundViewLegacy);
snapshot(BlockCardNotFoundSiteAccessExistsLegacy);
snapshot(BlockCardUnauthorisedViewLegacy);
snapshot(BlockCardUnauthorisedViewWithNoAuthLegacy);
snapshot(BlockCardJiraLegacy);
snapshot(BlockCardConfluenceLegacy);
snapshot(BlockCardTrelloLegacy);
snapshot(BlockCardAtlasLegacy);
snapshot(BlockCardBitbucketLegacy);
snapshot(BlockCardForbiddenViewsLegacy);
