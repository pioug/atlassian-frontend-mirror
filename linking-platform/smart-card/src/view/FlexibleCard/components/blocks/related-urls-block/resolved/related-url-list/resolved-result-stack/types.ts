import { JsonLd } from 'json-ld-types';
import { CardProviderRenderers } from '@atlaskit/link-provider';

export interface ResolvedResultsStackProps {
  testId: string;
  resolvedResults: JsonLd.Response[];
  renderers?: CardProviderRenderers;
}

export type UiRelatedLinksViewedEventProps = {
  relatedLinksCount: number;
};
