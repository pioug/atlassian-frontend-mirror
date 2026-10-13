import React from 'react';

import ProfileCardResourced from '@atlaskit/profilecard/profile-card-resourced';

import { docsProfileClient } from '../mocks/docs-profile-client';

export default function ProfileCardResourcedExample(): React.JSX.Element {
	return (
		<ProfileCardResourced
			userId="example-account"
			cloudId="example-cloud"
			resourceClient={docsProfileClient}
		/>
	);
}
