import React from 'react';

import { IntlProvider } from 'react-intl';

import Example from '../ai/profile-card-trigger';

export default function ProfileCardTriggerPreview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<div data-testid="component-preview">
				<Example isVisible />
			</div>
		</IntlProvider>
	);
}
