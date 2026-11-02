import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { EmbedCardNodeViewProperties } from './embedCard';
import { embedCardNodeView } from './embedCard';
import { embedCardNodeViewWithPreservation } from './embedCardWithPreservation';

export const getEmbedCardNodeViewFactory = (): typeof embedCardNodeViewWithPreservation =>
	isExperimentEnabled('platform_editor_preserve_smart_card_embeds')
		? embedCardNodeViewWithPreservation
		: embedCardNodeView;

export const createEmbedCardNodeView = (
	properties: EmbedCardNodeViewProperties,
): ReturnType<typeof embedCardNodeViewWithPreservation> =>
	getEmbedCardNodeViewFactory()(properties);
