import React from 'react';

import { IntlProvider } from 'react-intl';

import { sampleAvatarUrl as avatarUrl } from '../example-helpers';
import { generateMentionItem } from '../example-helpers/generate-mention-item';
import { onSelection } from '../example-helpers/on-selection';
import { MentionItem } from '../src/item';
import type { MentionDescription } from '../src/types';

export default function Example(): React.JSX.Element {
	// A non-selectable loading placeholder. `isPlaceholder` makes `MentionItem`
	// render a skeleton/shimmer row instead of the usual avatar + name. Used to
	// indicate a slower mention source (e.g. agents) is still loading.
	const loadingPlaceholder: MentionDescription = {
		id: '__loading-placeholder__',
		isPlaceholder: true,
		placeholderType: 'loading',
	};

	const regularMention = {
		avatarUrl,
		id: 'user-456',
		name: 'Regular User',
		mentionName: 'regular-user',
		presence: {
			status: 'online',
		},
		accessLevel: 'SITE',
	};

	const component = (
		<IntlProvider locale="en">
			<div data-testid="vr-tested">
				{/* A resolved row above the placeholder shows the layout the
				    shimmer occupies while the slower source loads. */}
				<MentionItem mention={regularMention} onSelection={onSelection} />
				<MentionItem mention={loadingPlaceholder} onSelection={onSelection} />
			</div>
		</IntlProvider>
	);

	return generateMentionItem(component);
}
