import React from 'react';

import { TeamsAnchor, TeamsNavigationProvider } from '../src';
import { TeamsLink } from '../src/ui/TeamsLink';
import { TeamsLinkButton } from '../src/ui/TeamsLinkButton';
import { TeamsLinkItem } from '../src/ui/TeamsLinkItem';

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
			<br />
			<TeamsLink
				href="/teams/my-team"
				intent="navigation"
				testId="teams-app-internal-navigation-link"
			>
				Go to My Team (Link)
			</TeamsLink>
			<br />
			<TeamsLinkItem
				href="/teams/my-team"
				intent="navigation"
				testId="teams-app-internal-navigation-link-item"
			>
				Go to My Team (LinkItem)
			</TeamsLinkItem>
			<br />
			<TeamsLinkButton
				href="/teams/my-team"
				intent="navigation"
				testId="teams-app-internal-navigation-link-button"
			>
				Go to My Team (LinkButton)
			</TeamsLinkButton>
		</TeamsNavigationProvider>
	);
}
