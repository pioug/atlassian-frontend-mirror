import React, { useCallback, useState } from 'react';

import { IntlProvider } from 'react-intl-next';
import { BrowserRouter as Router } from 'react-router-dom';

import { cssMap } from '@atlaskit/css';
import Flag, { FlagGroup, type FlagProps } from '@atlaskit/flag';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type TeamContainerProps, TeamContainers } from '../src';

import { mockCreateTeam } from './mocks/mockCreateTeam';
import { mockPermissions } from './mocks/mockPermissions';
import { mockTeamContainersQueries } from './mocks/mockTeamContainersQueries';

const styles = cssMap({
	root: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		width: '600px',
	},
});

mockTeamContainersQueries.data(['ConfluenceSpace']);
mockPermissions.allow();

export default function RequestedContainers(): React.JSX.Element {
	const locale = 'en';
	const [flags, setFlags] = useState<FlagProps[]>([]);

	const onRequestedContainerTimeout: TeamContainerProps['onRequestedContainerTimeout'] =
		useCallback((createFlag: (opts: { onAction: (flagId: string) => void }) => FlagProps) => {
			const dismissFlag = (flagId: string) => {
				mockCreateTeam.error(500);
				setFlags((current) => current.filter((flag) => flag.id !== flagId));
			};
			const flag = createFlag({ onAction: dismissFlag });
			setFlags((current) => [...current, flag]);
		}, []);

	return (
		<Router>
			<IntlProvider key={locale} locale={locale}>
				<Box xcss={styles.root}>
					<TeamContainers
						teamId="team-id"
						onAddAContainerClick={() => {}}
						onRequestedContainerTimeout={onRequestedContainerTimeout}
						userId={'user-id'}
						cloudId={'cloud-id'}
					/>
				</Box>
				<FlagGroup label="test" onDismissed={() => setFlags((current) => current.slice(1))}>
					{flags.map((flag, index) => (
						// @ts-ignore
						<Flag key={index} {...flag} />
					))}
				</FlagGroup>
			</IntlProvider>
		</Router>
	);
}
