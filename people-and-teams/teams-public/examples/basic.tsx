import React from 'react';

import { IntlProvider } from 'react-intl-next';
import { BrowserRouter as Router } from 'react-router-dom';

import { Box } from '@atlaskit/primitives';

import { TeamContainers } from '../src';

import { mockTeamContainersQueries } from './mocks/mockTeamContainersQueries';

mockTeamContainersQueries();

export default function Basic() {
	const locale = 'en';
	return (
		<Router>
			<IntlProvider key={locale} locale={locale}>
				<Box padding="space.200">
					<TeamContainers teamId="team-id" onAddAContainerClick={() => {}} />
				</Box>
			</IntlProvider>
		</Router>
	);
}
