import { snapshot } from '@af/visual-regression';

import {
	RelatedUrlsBlockErrored,
	RelatedUrlsBlockResolving,
	RelatedUrlsResolved,
	RelatedUrlsResolvedOpened,
} from '../../../examples/vr-flexible-card/vr-flexible-ui-block-related-urls';

snapshot(RelatedUrlsResolved, {
	description: 'Renders resolved view of flexible related urls block (collapsed)',
});

snapshot(RelatedUrlsResolvedOpened, {
	description: 'Renders resolved view of flexible related urls block (expanded)',
});

snapshot(RelatedUrlsBlockResolving, {
	description: 'Renders resolving view of flexible related urls block',
});

snapshot(RelatedUrlsBlockErrored, {
	description: 'Renders errrored view of flexible related urls block',
});
