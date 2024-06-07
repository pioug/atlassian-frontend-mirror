import { type CardProviderRenderers } from '@atlaskit/link-provider';
import { type RelatedUrlsResponse } from '../../../../../../state/hooks/use-related-urls';
import { type BlockProps } from '../../types';

export type RelatedUrlsProps = {
	relatedUrlsResponse: RelatedUrlsResponse;
	renderers?: CardProviderRenderers;
	initializeOpened?: boolean;
} & BlockProps;
