import React from 'react';

import { IntlProvider } from 'react-intl';

import DecisionItem from '@atlaskit/task-decision/decision-item';
import DecisionList from '@atlaskit/task-decision/decision-list';

export default function DecisionListExample(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<section>
				<h2>Release planning decisions</h2>
				<DecisionList>
					<DecisionItem>We will ship the updated onboarding flow in the next release.</DecisionItem>
					<DecisionItem>Support documentation will be ready before rollout begins.</DecisionItem>
				</DecisionList>
			</section>
		</IntlProvider>
	);
}
