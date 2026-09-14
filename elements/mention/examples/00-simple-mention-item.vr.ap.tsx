import React from 'react';

import { IntlProvider } from 'react-intl';

import { generateMentionItem } from '../example-helpers/generate-mention-item';
import { onSelection } from '../example-helpers/on-selection';
import { MentionItem } from '../src/item';

export default function Example(): React.JSX.Element {
	const mention = {
		id: '666',
		name: 'Craig Petchell',
		mentionName: 'petch',
	};

	const teamMention = {
		id: '777',
		name: 'Team Rocket',
		mentionName: 'teamrocket',
		userType: 'TEAM',
	};

	const description = 'Simple mention item with no nickname or avatar';
	const component = (
		<IntlProvider locale="en">
			<div data-testid="vr-tested">
				<MentionItem mention={mention} onSelection={onSelection} />
			</div>
			<div data-testid="vr-tested-team">
				<MentionItem mention={teamMention} onSelection={onSelection} />
			</div>
		</IntlProvider>
	);

	return generateMentionItem(component, description);
}
