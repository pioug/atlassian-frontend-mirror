import React from 'react';

import { IntlProvider } from 'react-intl';

import Example from '../ai/profile-card-resourced';

export default function ProfileCardResourcedPreview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<div data-testid="component-preview">
				<Example />
			</div>
		</IntlProvider>
	);
}
