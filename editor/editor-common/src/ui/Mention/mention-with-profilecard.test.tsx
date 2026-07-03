import React from 'react';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render, screen } from '@atlassian/testing-library';

import type { ProfilecardProvider } from '../../provider-factory/profile-card-provider';

import MentionWithProfileCard from './mention-with-profilecard';

jest.mock('@atlaskit/mention', () => ({
	ResourcedMention: ({ id, text }: { id: string; text: string }) => (
		<span data-testid="resourced-mention" data-mention-id={id}>
			{text}
		</span>
	),
}));

jest.mock('@atlaskit/profilecard/user', () => ({
	__esModule: true,
	default: ({
		children,
		trigger,
		userId,
	}: {
		children: React.ReactNode;
		trigger: string;
		userId: string;
	}) => (
		<div data-testid="user-profile-card-trigger" data-user-id={userId} data-trigger={trigger}>
			{children}
		</div>
	),
}));

jest.mock('@atlaskit/profilecard/agent-profile-card-trigger', () => ({
	__esModule: true,
	AgentProfileCardTrigger: ({
		agentId,
		children,
		cloudId,
		trigger,
	}: {
		agentId: string;
		children: React.ReactNode;
		cloudId: string;
		trigger: string;
	}) => (
		<div
			data-testid="agent-profile-card-trigger"
			data-agent-id={agentId}
			data-cloud-id={cloudId}
			data-trigger={trigger}
		>
			{children}
		</div>
	),
}));

const AGENT_ID = '13355586-8097-488c-84cc-7c6a28d3a695';
const CLOUD_ID = 'cloud-abc';

const profilecardProvider = {
	cloudId: CLOUD_ID,
	resourceClient: { getRovoAgentProfile: jest.fn() },
	getActions: () => [],
} as unknown as ProfilecardProvider;

describe('MentionWithProfileCard agent mentions', () => {
	ffTest.on(
		'rovo_chat_agent_selection',
		'an APP mention opens the agent profile card on click',
		() => {
			it('renders AgentProfileCardTrigger with the agent id, cloud id and click trigger', async () => {
				render(
					<MentionWithProfileCard
						id={AGENT_ID}
						text="@Vestie"
						userType="APP"
						profilecardProvider={profilecardProvider}
					/>,
				);

				// Lazy-loaded via react-loadable, so await the chunk resolving.
				const trigger = await screen.findByTestId('agent-profile-card-trigger');
				expect(trigger).toHaveAttribute('data-agent-id', AGENT_ID);
				expect(trigger).toHaveAttribute('data-cloud-id', CLOUD_ID);
				expect(trigger).toHaveAttribute('data-trigger', 'click');
				expect(screen.queryByTestId('user-profile-card-trigger')).not.toBeInTheDocument();
			});
		},
	);

	ffTest.off(
		'rovo_chat_agent_selection',
		'an APP mention falls back to the person profile card',
		() => {
			it('renders the user ProfileCardTrigger, not the agent one', () => {
				render(
					<MentionWithProfileCard
						id={AGENT_ID}
						text="@Vestie"
						userType="APP"
						profilecardProvider={profilecardProvider}
					/>,
				);

				expect(screen.queryByTestId('agent-profile-card-trigger')).not.toBeInTheDocument();
				expect(screen.getByTestId('user-profile-card-trigger')).toBeInTheDocument();
			});
		},
	);

	it('renders the person profile card for a non-APP mention', async () => {
		const { container } = render(
			<MentionWithProfileCard
				id="712020:b977c048-cda2-4eeb-a7b0-985f6ecd4108"
				text="@David Witt"
				profilecardProvider={profilecardProvider}
			/>,
		);

		expect(screen.getByTestId('user-profile-card-trigger')).toBeInTheDocument();
		expect(screen.queryByTestId('agent-profile-card-trigger')).not.toBeInTheDocument();
		await expect(container).toBeAccessible();
	});
});
