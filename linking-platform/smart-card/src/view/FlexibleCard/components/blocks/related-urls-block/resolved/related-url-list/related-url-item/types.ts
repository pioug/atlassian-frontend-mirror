import { JsonLd } from 'json-ld-types';
import { CardProviderRenderers } from '@atlaskit/link-provider';

export type ResolvedResultItemProps = {
  results: JsonLd.Response;
  renderers?: CardProviderRenderers;
  testId: string;
};
