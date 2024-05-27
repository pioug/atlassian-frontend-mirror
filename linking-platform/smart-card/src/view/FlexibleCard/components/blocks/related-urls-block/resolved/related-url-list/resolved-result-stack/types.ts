import { type JsonLd } from 'json-ld-types';
import { type CardProviderRenderers } from '@atlaskit/link-provider';

export interface ResolvedResultsStackProps {
  testId: string;
  resolvedResults: JsonLd.Response[];
  renderers?: CardProviderRenderers;
}

export type UiRelatedLinksViewedEventProps = {
  relatedLinksCount: number;
};
