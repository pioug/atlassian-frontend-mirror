import React from 'react';

import TeamProfileCard from '@atlaskit/profilecard/team-profile-card';

const avatarUrl =
	'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Crect width=%2240%22 height=%2240%22 rx=%2220%22 fill=%22%236C8EFF%22/%3E%3C/svg%3E';
const members = [
	{ id: 'example-person-1', fullName: 'Alex Example', avatarUrl },
	{ id: 'example-person-2', fullName: 'Taylor Sample', avatarUrl },
	{ id: 'example-person-3', fullName: 'Jordan Demo', avatarUrl },
];

export default function TeamProfileCardExample(): React.JSX.Element {
	return (
		<TeamProfileCard
			team={{
				id: 'example-team',
				displayName: 'Example team',
				description: 'Plans and ships a sample project.',
				members,
			}}
			analytics={() => undefined}
			viewProfileLink="/teams/example-team"
			generateUserLink={(userId) => `/people/${userId}`}
		/>
	);
}
