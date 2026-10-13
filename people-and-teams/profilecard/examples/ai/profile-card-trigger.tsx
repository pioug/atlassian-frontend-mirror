import React from 'react';

import ProfileCardTrigger from '@atlaskit/profilecard/profile-card-trigger';

import { docsProfileClient } from '../mocks/docs-profile-client';

export default function ProfileCardTriggerExample({
	isVisible = false,
}: {
	isVisible?: boolean;
}): React.JSX.Element {
	return (
		<ProfileCardTrigger
			userId="example-account"
			cloudId="example-cloud"
			resourceClient={docsProfileClient}
			trigger="click"
			isVisible={isVisible}
		>
			<button type="button">View Alex Example’s profile</button>
		</ProfileCardTrigger>
	);
}
