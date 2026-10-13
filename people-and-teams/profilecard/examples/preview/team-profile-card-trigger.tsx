import React from 'react';

import { IntlProvider } from 'react-intl';

import Example from '../ai/team-profile-card-trigger';

export default function TeamProfileCardTriggerPreview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<div data-testid="component-preview">
				<Example />
			</div>
		</IntlProvider>
	);
}
