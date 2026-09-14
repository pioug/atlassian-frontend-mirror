import React from 'react';

// eslint-disable-next-line @atlassian/testing-library/prefer-atlassian-testing-library
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { ffTest } from '@atlassian/feature-flags-test-utils/test-runner';

import type { ProfileClient } from '../../../types';
import { AgentProfileCardResourced } from '../AgentProfileCardResourced';

const fireEvent = jest.fn();

jest.mock('@atlaskit/teams-app-internal-analytics/use-analytics-events', () => ({
	...jest.requireActual('@atlaskit/teams-app-internal-analytics/use-analytics-events'),
	useAnalyticsEvents: () => ({ fireEvent }),
}));

const rovoAgentProfile = {
	id: 'agent-id',
	name: 'Rovo Agent',
	description: 'Helpful agent',
	system_prompt_template: '',
	visibility: 'PUBLIC',
	user_defined_conversation_starters: [],
	named_id: 'agent-id',
	creator: 'ari:cloud:identity::user/creator-aaid',
	creator_type: 'CUSTOMER',
	favourite: false,
	is_default: false,
	deactivated: false,
	identity_account_id: 'ari:cloud:identity::user/agent-account-id',
	actor_type: 'AGENT',
	favourite_count: 0,
};

const createResourceClient = (): ProfileClient =>
	({
		getRovoAgentProfile: jest.fn().mockResolvedValue({
			restData: rovoAgentProfile,
			aggData: null,
		}),
		getProfile: jest.fn().mockResolvedValue({
			fullName: 'Agent Creator',
		}),
		getRovoAgentPermissions: jest.fn().mockResolvedValue({
			permissions: {
				AGENT_CREATE: { permitted: true },
				AGENT_UPDATE: { permitted: true },
				AGENT_DEACTIVATE: { permitted: true },
			},
		}),
	}) as unknown as ProfileClient;

const renderCard = (resourceClient: ProfileClient, accountId = 'agent-account-id') =>
	render(
		<IntlProvider locale="en">
			<AgentProfileCardResourced
				accountId={accountId}
				cloudId="cloud-id"
				resourceClient={resourceClient}
			/>
		</IntlProvider>,
	);

describe('AgentProfileCardResourced', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const resourceClient = createResourceClient();
		const { container } = renderCard(resourceClient);

		await screen.findByText(rovoAgentProfile.name);

		await expect(container).toBeAccessible();
	});

	ffTest.on('confluence_fix_agent_profile_card_flash', 'confluence flashing fix enabled', () => {
		it('uses the stable loading path when Confluence agent profile card flashing fix is enabled', async () => {
			const resourceClient = createResourceClient();
			const { rerender } = renderCard(resourceClient);

			await waitFor(() => expect(resourceClient.getRovoAgentProfile).toHaveBeenCalledTimes(1));

			rerender(
				<IntlProvider locale="en">
					<AgentProfileCardResourced
						accountId="agent-account-id"
						cloudId="cloud-id"
						resourceClient={resourceClient}
					/>
				</IntlProvider>,
			);

			await waitFor(() => expect(resourceClient.getRovoAgentProfile).toHaveBeenCalledTimes(1));
		});
	});
});
