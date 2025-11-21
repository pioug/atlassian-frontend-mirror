import React from 'react';

import MentionItem from '../src/components/MentionItem';
import { generateMentionItem, onSelection, sampleAvatarUrl as avatarUrl } from '../example-helpers';
import { IntlProvider } from 'react-intl-next';

export default function Example(): React.JSX.Element {
	const mention = {
		// SSR workaround Avatar not 1:1 between server and client (rest to avatarUrl when fixed)
		avatarUrl: typeof jest === 'undefined' ? avatarUrl : undefined,
		id: '666',
		name: 'Craig Petchell',
		mentionName: 'cpetchell',
		nickname: 'petch',
		selected: true,
		presence: {
			status: 'online',
			time: '11:23am',
		},
		accessLevel: 'SITE',
		highlight: {
			name: [
				{
					start: 6,
					end: 10,
				},
			],
			mentionName: [],
			nickname: [
				{
					start: 0,
					end: 4,
				},
			],
		},
	};
	const description =
		'Selected mention with nickname, avatar, highlights presence, lozenge and restricted access';
	const component = (
		<IntlProvider locale="en">
			<div data-testid="vr-tested">
				<MentionItem mention={mention} selected={mention.selected} onSelection={onSelection} />
			</div>
		</IntlProvider>
	);

	return generateMentionItem(component, description);
}
