import React, { type ComponentPropsWithoutRef } from 'react';

import type { Meta } from '@storybook/react';
import { injectable } from 'react-magnetic-di';
import { useFragment } from 'react-relay';

import { withDi, withUseIntl } from '@atlassian/agent-studio-test-utils/storybook-decorators';

import type { agentVerified_AtlaskitRovoAgentComponents$key } from './__generated__/agentVerified_AtlaskitRovoAgentComponents.graphql';

import { AgentVerified } from './index';

const commonDeps = [
	injectable(useFragment, () => ({
		isVerified: true,
	})),
];

const meta: Meta<ComponentPropsWithoutRef<typeof AgentVerified>> = {
	decorators: [withUseIntl(), withDi(commonDeps)],
};

export default meta;

export const Default = {
	render: () => <AgentVerified agentRef={{} as agentVerified_AtlaskitRovoAgentComponents$key} />,
};

export const TextLarge = {
	render: () => (
		<AgentVerified
			agentRef={{} as agentVerified_AtlaskitRovoAgentComponents$key}
			adjacentTextSize="textLarge"
		/>
	),
};

export const HeadingMedium = {
	render: () => (
		<AgentVerified
			agentRef={{} as agentVerified_AtlaskitRovoAgentComponents$key}
			adjacentTextSize="headingMedium"
		/>
	),
};

export const HeadingLarge = {
	render: () => (
		<AgentVerified
			agentRef={{} as agentVerified_AtlaskitRovoAgentComponents$key}
			adjacentTextSize="headingLarge"
		/>
	),
};
