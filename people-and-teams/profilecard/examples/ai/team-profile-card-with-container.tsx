import React from 'react';

import { TeamProfileCard as TeamProfileCardWithContainer } from '@atlaskit/profilecard/team-profile-card/main';

const avatarUrl =
	'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Crect width=%2240%22 height=%2240%22 rx=%2220%22 fill=%22%236C8EFF%22/%3E%3C/svg%3E';
const memberAvatars = [
	{ key: 'example-person-1', name: 'Alex Example', src: avatarUrl },
	{ key: 'example-person-2', name: 'Taylor Sample', src: avatarUrl },
	{ key: 'example-person-3', name: 'Jordan Demo', src: avatarUrl },
];

/** Mount under the product's Teams/Relay providers so related containers can load for this team. */
export default function TeamProfileCardWithContainerExample(): React.JSX.Element {
	return (
		<TeamProfileCardWithContainer
			containerId="ari:cloud:jira::project/example-project"
			teamId="ari:cloud:identity::team/example-team"
			displayName="Example team"
			description="A team coordinating a sample project."
			avatarImageUrl=""
			headerImageUrl=""
			memberAvatars={memberAvatars}
			memberCount={memberAvatars.length}
			cloudId="example-cloud"
			userId="example-viewer"
		/>
	);
}
