import { CardProviderRenderers } from '@atlaskit/link-provider';
import { RelatedUrlsResponse } from '../../../../../../state/hooks/use-related-urls';
import { BlockProps } from '../../types';

export type RelatedUrlsProps = {
  relatedUrlsResponse: RelatedUrlsResponse;
  renderers?: CardProviderRenderers;
  initializeOpened?: boolean;
} & BlockProps;
