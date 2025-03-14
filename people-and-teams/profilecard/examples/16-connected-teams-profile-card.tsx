import React from 'react';

import { TeamProfileCard } from '../src/components/team-profile-card/main';
import { mockProfileData } from '../src/components/team-profile-card/mocks';

import ExampleWrapper from './helper/example-wrapper';

export default function TeamProfileCardExample() {
	return (
		<>
			<ExampleWrapper>
				<TeamProfileCard {...mockProfileData} />
			</ExampleWrapper>
		</>
	);
}
