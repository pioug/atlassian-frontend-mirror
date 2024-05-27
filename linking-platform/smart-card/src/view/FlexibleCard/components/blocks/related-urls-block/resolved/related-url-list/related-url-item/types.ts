import { type JsonLd } from 'json-ld-types';
import { type CardProviderRenderers } from '@atlaskit/link-provider';

export type ResolvedResultItemProps = {
  results: JsonLd.Response;
  renderers?: CardProviderRenderers;
  testId: string;
};
