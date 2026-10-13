import React from 'react';

import ProfileCard from '@atlaskit/profilecard/profile-card';

export default function UserProfileCardExample(): React.JSX.Element {
	return (
		<ProfileCard
			fullName="Alex Example"
			nickname="alex-example"
			meta="Design systems"
			email="alex@example.test"
			location="Sydney"
			customLozenges={[{ text: 'Available', appearance: 'success' }]}
		/>
	);
}
