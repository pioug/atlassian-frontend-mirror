import { JsonLd } from 'json-ld-types';
import { MessageDescriptor } from 'react-intl-next';
import { CardProviderRenderers } from '@atlaskit/link-provider';

export type ResolvedResultProps = {
  testId: string;
  title: MessageDescriptor;
  initializeOpened?: boolean;
  resolvedResults: JsonLd.Response[];
  renderers?: CardProviderRenderers;
};
