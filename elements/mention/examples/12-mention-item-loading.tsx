import React from 'react';

import { MentionItem } from '../src/item';
import { generateMentionItem, onSelection, sampleAvatarUrl as avatarUrl } from '../example-helpers';
import { IntlProvider } from 'react-intl';

export default function Example(): React.JSX.Element {
	// A non-selectable loading placeholder. `isPlaceholder` makes `MentionItem`
	// render a skeleton/shimmer row instead of the usual avatar + name. Used to
	// indicate a slower mention source (e.g. agents) is still loading.
	const loadingPlaceholder = {
		id: '__loading-placeholder__',
		isPlaceholder: true,
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
