import React from 'react';

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { CardProviderRenderers } from '@atlaskit/link-provider/types';
import type { CardAppearance } from '@atlaskit/linking-common/types';

const sanitizeEmojiValue = (value: string | undefined) =>
	(value && value.replace(/['"]+/g, '').replace(/null/, '')) || '';

export const extractTitlePrefix = (
	jsonLd: JsonLd.Data.BaseData,
	renderers?: CardProviderRenderers,
	type?: CardAppearance,
): string | React.ReactNode | undefined => {
	const prefix = jsonLd['atlassian:titlePrefix'];

	if (prefix) {
		// extract and return Emoji Title Prefix
		if (prefix['@type'] === 'atlassian:Emoji') {
			const emojiId = sanitizeEmojiValue(prefix['text']);
			const hasEmojiPrefix = emojiId.length !== 0;
			const emojiRenderer = renderers?.emoji;

			if (hasEmojiPrefix && emojiRenderer) {
				return emojiRenderer(emojiId, type);
			}
		}
	}
	return undefined;
};
