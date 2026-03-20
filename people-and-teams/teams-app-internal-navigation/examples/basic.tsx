import React from 'react';

import { TeamsAnchor, TeamsNavigationProvider } from '../src';

export default function Basic() {
	const context = {
		cloudId: 'example-cloud-id',
		orgId: 'example-org-id',
		forceExternalIntent: true,
		navigate: () => {},
		openPreviewPanel: () => {},
	};

	return (
		<TeamsNavigationProvider value={context}>
			<TeamsAnchor href="/teams/my-team" intent="navigation" testId="teams-app-internal-navigation">
				Go to My Team
			</TeamsAnchor>
		</TeamsNavigationProvider>
	);
}
