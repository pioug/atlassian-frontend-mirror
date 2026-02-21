import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { IntlProvider } from 'react-intl-next';

import { withPlatformFeatureGates } from '@atlassian/feature-flags-storybook-utils';
import {
	withAnalyticsLogger,
	withMaxWidth,
	withStorybookLinkHarness,
} from '@atlassian/platform-storybook-helpers';

import { AgentProfileCard } from '../src';
import { simpleProfileClient } from '../src/mocks';
import type { AgentProfileCardProps, RovoAgentProfileCardInfo } from '../src/types';

type StoryArgs = AgentProfileCardProps;

const agent: RovoAgentProfileCardInfo = {
	id: '965df475-d134-43ac-8ec4-f4aafd0025c6',
	name: 'Rovo Dev',
	description:
		'Get help writing a user manual page that you can use to share your preferred ways of working with your team.',
	system_prompt_template: '',
	visibility: 'PUBLIC',
	user_defined_conversation_starters: [
		'Help me make my first User Manual.',
		'Help with my goals',
		'This is a very long conversation starter to test the overflow',
	],
	named_id: '965df475-d134-43ac-8ec4-f4aafd0025c6',
	creator: 'ari:cloud:identity::user/62321fb55b6d710070a1ce85',
	creator_type: 'CUSTOMER',
	// Toggle this to 'ROVO_DEV' in Storybook controls to simulate Rovo Dev UI.
	favourite: true,
	is_default: false,
	deactivated: false,
	identity_account_id: 'ari:cloud:identity::user/712020:b719aaa1-2485-4dad-93d3-abc3c93862c6',
	creatorInfo: {
		type: 'CUSTOMER',
		name: 'John Doe',
		profileLink: 'https://example.com/profile',
	},
	actor_type: 'AGENT',
	favourite_count: 1234,
};

const meta: Meta<StoryArgs> = {
	component: AgentProfileCard,
	args: {
		resourceClient: simpleProfileClient,
		agent,
		// Avoid network calls for permissions in Storybook.
		hideMoreActions: true,
	},
	argTypes: {
		hideMoreActions: { control: { type: 'boolean' } },
		agent: {
			control: { type: 'object' },
		},
	},

	decorators: [
		withAnalyticsLogger,
		withMaxWidth('420px'),
		withStorybookLinkHarness({ centered: false }),
		(Story) => (
			<IntlProvider locale="en">
				<Story />
			</IntlProvider>
		),
	],
};

export default meta;

type Story = StoryObj<StoryArgs>;

const baseFeatureGates = {
	rovo_agent_empty_state_refresh: false,
	jira_ai_force_rovo_dev_avatar: false,
};

export const Standard: Story = {
	name: 'Standard (non-Rovo Dev)',
	decorators: [
		withPlatformFeatureGates({ ...baseFeatureGates, rovo_dev_themed_identity_card: false }),
	],
	render: (props) => <AgentProfileCard {...props} />,
};

export const RovoDevGateOff: Story = {
	name: 'Rovo Dev (gate OFF)',
	args: {
		agent: {
			...agent,
			creator_type: 'ROVO_DEV',
		},
	},
	decorators: [
		withPlatformFeatureGates({ ...baseFeatureGates, rovo_dev_themed_identity_card: false }),
	],
	render: (props) => <AgentProfileCard {...props} />,
};

export const RovoDevGateOn: Story = {
	name: 'Rovo Dev (gate ON)',
	args: {
		agent: {
			...agent,
			creator_type: 'ROVO_DEV',
		},
	},
	decorators: [
		withPlatformFeatureGates({ ...baseFeatureGates, rovo_dev_themed_identity_card: true }),
	],
	render: (props) => <AgentProfileCard {...props} />,
};
