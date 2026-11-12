import React from 'react';

import { IntlProvider } from 'react-intl';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { waitFor } from '@atlassian/testing-library/wait-for';

import { AgentForbiddenError } from '../../../client/AgentForbiddenError';
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
	user_defined_conversation_starters: ['Help me get started'],
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
				AGENT_DUPLICATE: { permitted: true },
				AGENT_UPDATE: { permitted: true },
				AGENT_DEACTIVATE: { permitted: true },
			},
		}),
	}) as unknown as ProfileClient;

const renderCard = (
	resourceClient: ProfileClient,
	accountId = 'agent-account-id',
	isReadOnly = false,
) =>
	render(
		<IntlProvider locale="en">
			<AgentProfileCardResourced
				isReadOnly={isReadOnly}
				agentName="Rovo Agent"
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

	it('does not re-fetch the agent profile when re-rendered with the same account id', async () => {
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

test('capture and report a11y violations in an informational preview', async () => {
	const { container } = renderCard(createResourceClient(), 'agent-account-id', true);
	await screen.findByText('Agent Creator', { exact: false });
	expect(screen.getByText('Helpful agent')).toBeVisible();
	expect(screen.queryByRole('button')).not.toBeInTheDocument();
	expect(screen.queryByRole('link')).not.toBeInTheDocument();
	await expect(container).toBeAccessible();
});

test('does not offer an unreachable retry action in an informational preview', async () => {
	const resourceClient = createResourceClient();
	jest.mocked(resourceClient.getRovoAgentProfile).mockRejectedValue(new Error('network failure'));
	renderCard(resourceClient, 'agent-account-id', true);
	await screen.findByTestId('profilecard-error');
	expect(screen.queryByRole('button')).not.toBeInTheDocument();
	expect(screen.queryByRole('link')).not.toBeInTheDocument();
});

test('does not offer actions for a forbidden agent in an informational preview', async () => {
	const resourceClient = createResourceClient();
	jest.mocked(resourceClient.getRovoAgentProfile).mockRejectedValue(new AgentForbiddenError());
	renderCard(resourceClient, 'agent-account-id', true);
	await screen.findByText('Rovo Agent');
	expect(screen.queryByRole('button')).not.toBeInTheDocument();
	expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
