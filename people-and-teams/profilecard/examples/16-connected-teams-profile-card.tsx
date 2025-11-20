import React from 'react';

import { TeamProfileCard } from '../src/components/team-profile-card/main';
import {
	mockProfileData,
	mockTeamContainersQueries,
} from '../src/components/team-profile-card/mocks';

import ExampleWrapper from './helper/example-wrapper';

mockTeamContainersQueries();
export default function TeamProfileCardExample(): React.JSX.Element {
	return (
		<>
			<ExampleWrapper>
				<TeamProfileCard
					cloudId={''}
					userId={''}
					containerId={'6'}
					{...mockProfileData}
					isKudosEnabled
					teamCentralBaseUrl="/"
					analyticsSource="example"
				/>
			</ExampleWrapper>
		</>
	);
}
