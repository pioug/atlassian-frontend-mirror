import { type JsonLd } from '@atlaskit/json-ld-types';

import { extractType } from '../primitives';
import { extractUrlFromIconJsonLd } from '../url';

export interface LinkContext {
	name: string;
	icon?: string;
	type?: JsonLd.Primitives.ObjectType[];
}

export const extractContext = (jsonLd: JsonLd.Data.BaseData): LinkContext | undefined => {
	const context = jsonLd.context;
	if (context) {
		if (typeof context === 'string') {
			return { name: context };
		} else if (context['@type'] === 'Link') {
			if (context.name) {
				return { name: context.name };
			}
		} else {
			if (context.name) {
				return {
					name: context.name,
					icon: context.icon && extractUrlFromIconJsonLd(context.icon),
					type: extractType(context),
				};
			}
		}
	}
};
