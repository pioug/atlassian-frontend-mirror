import React from 'react';

import { IntlProvider } from 'react-intl-next';
import { BrowserRouter as Router } from 'react-router-dom';

import { Box } from '@atlaskit/primitives';

import { TeamContainers } from '../src';

export default function Basic() {
	const locale = 'en';
	return (
		<Router>
			<IntlProvider key={locale} locale={locale}>
				<Box padding="space.200">
					<TeamContainers />
				</Box>
			</IntlProvider>
		</Router>
	);
}
