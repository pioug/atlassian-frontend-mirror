import React from 'react';

import { IntlProvider } from 'react-intl';

import Example from '../16-connected-teams-profile-card';

export default function TeamProfileCardWithContainerPreview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<div data-testid="component-preview">
				<Example />
			</div>
		</IntlProvider>
	);
}
