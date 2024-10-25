import { type JsonLd } from 'json-ld-types';
import { type MessageDescriptor } from 'react-intl-next';

import { type CardProviderRenderers } from '@atlaskit/link-provider';

export type ResolvedResultProps = {
	testId: string;
	title: MessageDescriptor;
	initializeOpened?: boolean;
	resolvedResults: JsonLd.Response[];
	renderers?: CardProviderRenderers;
};
