import React from 'react';

import { IntlProvider } from 'react-intl-next';
import { BrowserRouter as Router } from 'react-router-dom';

import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { TeamContainers } from '../src';
import { LinkedContainerCardProps } from '../src/ui/team-containers/linked-container-card';

import { mockTeamContainersQueries } from './mocks/mockTeamContainersQueries';

mockTeamContainersQueries();

const styles = cssMap({
	root: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		width: '600px',
	},
});

const CustomContainerCard = ({ containerType, title }: LinkedContainerCardProps) => {
	return (
		<Box backgroundColor="elevation.surface.sunken">
			<Text maxLines={1} weight="medium" color="color.text">
				{title}
			</Text>
			<Text maxLines={1} color="color.text">
				{containerType}
			</Text>
		</Box>
	);
};

const CustomTeamContainersSkeleton = () => {
	return (
		<Box backgroundColor="elevation.surface.sunken">
			<Box backgroundColor="color.background.neutral" />
			<Box backgroundColor="color.background.neutral" />
		</Box>
	);
};

export default function Basic() {
	const locale = 'en';
	return (
		<Router>
			<IntlProvider key={locale} locale={locale}>
				<Box xcss={styles.root}>
					<TeamContainers
						teamId="team-id"
						onAddAContainerClick={() => {}}
						components={{
							ContainerCard: CustomContainerCard,
							TeamContainersSkeleton: CustomTeamContainersSkeleton,
						}}
						userId={'user-id'}
						cloudId={'cloud-id'}
					/>
				</Box>
			</IntlProvider>
		</Router>
	);
}
