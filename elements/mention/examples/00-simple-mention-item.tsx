import React from 'react';

import { MentionItem } from '../src/item';
import { generateMentionItem, onSelection } from '../example-helpers';
import { IntlProvider } from 'react-intl-next';

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
