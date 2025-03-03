import React from 'react';

import { IntlProvider } from 'react-intl-next';
import { BrowserRouter as Router } from 'react-router-dom';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { TeamContainers } from '../src';

import { mockTeamContainersQueries } from './mocks/mockTeamContainersQueries';

mockTeamContainersQueries();

const styles = cssMap({
	root: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		width: '300px',
	},
});

export default function Basic() {
	const locale = 'en';
	return (
		<Router>
			<IntlProvider key={locale} locale={locale}>
				<Box xcss={styles.root}>
					<TeamContainers teamId="team-id" onAddAContainerClick={() => {}} />
				</Box>
			</IntlProvider>
		</Router>
	);
}
